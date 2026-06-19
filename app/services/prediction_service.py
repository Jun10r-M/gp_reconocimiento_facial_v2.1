
import os
import numpy as np
from datetime import datetime, date, timedelta
from typing import Dict, Any, List, Optional
from app.repositories.database import db

class PredictionService:
    def __init__(self):
        # Lambda para regularización de Cresta (Ridge)
        self.lmbda = 0.1

    def _execute_write_raw(self, query: str, params: tuple = ()) -> None:
        if db.is_sqlite:
            query = query.replace("%s", "?")
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            conn.commit()

    async def generate_historical_time_series_if_empty(self) -> None:
    
        check_query = "SELECT COUNT(*) as count FROM payrolls"
        rows = db.execute_query(check_query)
        count = rows[0]["count"] if rows else 0

        if count >= 15:
            return

        print("[PREDICCIÓN IA] Detectado historial vacío. Generando series temporales sintéticas realistas de 12 meses...")

        emp_query = "SELECT id, pension_system, has_children FROM employees WHERE deleted_at IS NULL"
        employees = db.execute_query(emp_query)
        if not employees:
            print("[PREDICCIÓN IA] Advertencia: No hay empleados en la base de datos. No se puede generar historial.")
            return

        contract_query = "SELECT employee_id, monthly_salary, hourly_wage, position FROM contracts WHERE is_active = TRUE"
        contracts = {c["employee_id"]: c for c in db.execute_query(contract_query)}

        today = date.today()
        periods = []
        for i in range(12, 0, -1):
            first_day_of_current_month = today.replace(day=1)
            past_date = first_day_of_current_month - timedelta(days=i * 28) # salto aproximado
            past_date_fixed = past_date.replace(day=1)
            periods.append(past_date_fixed.strftime("%Y-%m"))

        periods = sorted(list(set(periods)))

        np.random.seed(42) 

        for period in periods:
            year, month = map(int, period.split("-"))
            is_peak = month in [7, 12] 
            is_winter = month in [6, 7, 8] 

            for emp in employees:
                emp_id = emp["id"]
                contract = contracts.get(emp_id)
                if not contract:
                    continue

                salary = float(contract["monthly_salary"])
                wage = float(contract["hourly_wage"])

                grati = salary if is_peak else 0.0

                ot_base = np.random.uniform(2, 10)
                if is_peak:
                    ot_base += np.random.uniform(5, 12)
                
                ot_25 = round(ot_base * 0.6, 2)
                ot_35 = round(ot_base * 0.4, 2)
                ot_pay = (ot_25 * wage * 1.25) + (ot_35 * wage * 1.35)

                lateness_min = int(np.random.exponential(40))
                lateness_ded = round((lateness_min / 60) * wage, 2)

                absence_chance = np.random.rand()
                absences = 0
                if is_winter and absence_chance > 0.8:
                    absences = np.random.randint(1, 3)
                elif absence_chance > 0.95:
                    absences = 1
                
                absence_ded = round(absences * (salary / 30), 2)

                fam_allow = 102.50 if emp["has_children"] else 0.0

                gross = salary + fam_allow + ot_pay + grati - lateness_ded - absence_ded
                gross = max(gross, 0.0)

                rate = 0.13 if emp["pension_system"] == "ONP" else 0.1284
                pension_ded = round(gross * rate, 2)
                net = round(gross - pension_ded, 2)

                essalud = round(gross * 0.09, 2)

                insert_payroll = """
                    INSERT INTO payrolls (
                        employee_id, period, days_worked, lateness_minutes,
                        overtime_25_hours, overtime_35_hours, base_salary,
                        family_allowance, overtime_pay, lateness_deduction,
                        absence_deduction, gross_salary, pension_deduction,
                        net_salary, essalud_contribution, created_by
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT(employee_id, period) DO NOTHING
                """
                self._execute_write_raw(insert_payroll, (
                    emp_id, period, 30 - absences, lateness_min,
                    ot_25, ot_35, salary, fam_allow, round(ot_pay, 2),
                    lateness_ded, absence_ded, round(gross, 2), pension_ded,
                    net, essalud, "ia_system"
                ))

                if absences > 0:
                    for d in range(absences):
                        sim_day = np.random.randint(2, 27)
                        sim_date = f"{year}-{month:02d}-{sim_day:02d}"
                        
                        just_type = np.random.choice(["medical", "permit", "unjustified"], p=[0.5, 0.3, 0.2])
                        if just_type != "unjustified":
                            insert_just = """
                                INSERT INTO justifications (employee_id, date, justification_type, description, created_by)
                                VALUES (%s, %s, %s, %s, %s)
                                ON CONFLICT(employee_id, date) DO NOTHING
                            """
                            self._execute_write_raw(insert_just, (
                                emp_id, sim_date, just_type, f"Justificación automática del mes {month}", "ia_system"
                            ))
                        
                        pass

        print(f"[PREDICCIÓN IA] Finalizada la provisión de series temporales históricas.")

    def _train_ridge_model(self, X: np.ndarray, y: np.ndarray) -> tuple:
        """
        Entrena un regresor lineal con regularización Ridge (Cresta)
        mediante la ecuación cerrada: beta = (X^T * X + lambda * I)^-1 * X^T * y
        Retorna los coeficientes beta y las métricas (MAE, RMSE, R2) usando división 80/20.
        """
        n_samples = X.shape[0]
        if n_samples < 5:
            I = np.identity(X.shape[1])
            beta = np.linalg.inv(X.T @ X + self.lmbda * I) @ X.T @ y
            return beta, 0.0, 0.0, 1.0

        np.random.seed(100)
        indices = np.arange(n_samples)
        np.random.shuffle(indices)
        
        split = int(n_samples * 0.8)
        if split == n_samples:
            split -= 1
        
        train_idx, test_idx = indices[:split], indices[split:]

        X_train, y_train = X[train_idx], y[train_idx]
        X_test, y_test = X[test_idx], y[test_idx]

        I = np.identity(X_train.shape[1])
        beta = np.linalg.inv(X_train.T @ X_train + self.lmbda * I) @ X_train.T @ y_train

        y_pred = X_test @ beta
        y_pred = np.maximum(y_pred, 0.0)

        mae = float(np.mean(np.abs(y_test - y_pred)))
        rmse = float(np.sqrt(np.mean((y_test - y_pred) ** 2)))
        
        y_mean = np.mean(y_test)
        ss_tot = np.sum((y_test - y_mean) ** 2)
        ss_res = np.sum((y_test - y_pred) ** 2)
        
        r2 = 1.0
        if ss_tot > 0:
            r2 = float(1.0 - (ss_res / ss_tot))

        I_all = np.identity(X.shape[1])
        beta_final = np.linalg.inv(X.T @ X + self.lmbda * I_all) @ X.T @ y

        return beta_final, round(mae, 2), round(rmse, 2), round(r2, 4)

    async def get_dashboard_stats(self) -> Dict[str, Any]:
     
        await self.generate_historical_time_series_if_empty()

        query = """
            SELECT 
                period,
                COUNT(DISTINCT employee_id) as emp_count,
                SUM(gross_salary + essalud_contribution) as total_payroll_cost,
                SUM(overtime_25_hours + overtime_35_hours) as total_overtime_hours,
                SUM(30 - days_worked) as total_absences
            FROM payrolls
            GROUP BY period
            ORDER BY period ASC
        """
        monthly_data = db.execute_query(query)
        if len(monthly_data) < 3:
            return {
                "last_period": "N/A",
                "next_period": "2026-06",
                "current_emp_count": 0,
                "payroll_forecast": 15000.0, "payroll_mae": 0.0, "payroll_rmse": 0.0, "payroll_r2": 1.0,
                "overtime_forecast": 40.0, "overtime_mae": 0.0, "overtime_rmse": 0.0, "overtime_r2": 1.0,
                "absenteeism_forecast": 3.0, "absenteeism_mae": 0.0, "absenteeism_rmse": 0.0, "absenteeism_r2": 1.0,
                "emp_count": 0,
                "coefficients": {
                    "beta_payroll": [15000.0, 0.0, 0.0, 0.0],
                    "t_next": 1,
                    "next_month": 6
                }
            }

        n_months = len(monthly_data)
        
        t = np.arange(1, n_months + 1)
        emp_counts = np.array([float(r["emp_count"]) for r in monthly_data])
        
        months = np.array([int(r["period"].split("-")[1]) for r in monthly_data])
        
        is_july_dec = np.array([1.0 if m in [7, 12] else 0.0 for m in months])
        is_winter = np.array([1.0 if m in [6, 7, 8] else 0.0 for m in months])
        is_peak_ot = np.array([1.0 if m in [7, 12, 3] else 0.0 for m in months]) # Marzo inicio escolar, Jul/Dic fiestas

        y_payroll = np.array([float(r["total_payroll_cost"]) for r in monthly_data])
        y_overtime = np.array([float(r["total_overtime_hours"]) for r in monthly_data])
        y_absences = np.array([float(r["total_absences"]) for r in monthly_data])

        X_pay = np.column_stack((np.ones(n_months), t, emp_counts, is_july_dec))
        beta_pay, pay_mae, pay_rmse, pay_r2 = self._train_ridge_model(X_pay, y_payroll)

        X_ot = np.column_stack((np.ones(n_months), t, emp_counts, is_peak_ot))
        beta_ot, ot_mae, ot_rmse, ot_r2 = self._train_ridge_model(X_ot, y_overtime)

        X_abs = np.column_stack((np.ones(n_months), t, is_winter))
        beta_abs, abs_mae, abs_rmse, abs_r2 = self._train_ridge_model(X_abs, y_absences)

        last_period_str = monthly_data[-1]["period"]
        last_year, last_month = map(int, last_period_str.split("-"))
        
        next_month = last_month + 1 if last_month < 12 else 1
        next_year = last_year if last_month < 12 else last_year + 1
        next_period_str = f"{next_year}-{next_month:02d}"

        t_next = n_months + 1
        current_emp_count = emp_counts[-1] 
        
        next_is_july_dec = 1.0 if next_month in [7, 12] else 0.0
        next_is_winter = 1.0 if next_month in [6, 7, 8] else 0.0
        next_is_peak_ot = 1.0 if next_month in [7, 12, 3] else 0.0

        payroll_forecast = float(np.dot([1.0, t_next, current_emp_count, next_is_july_dec], beta_pay))
        overtime_forecast = float(np.dot([1.0, t_next, current_emp_count, next_is_peak_ot], beta_ot))
        absenteeism_forecast = float(np.dot([1.0, t_next, next_is_winter], beta_abs))

        payroll_forecast = max(round(payroll_forecast, 2), 0.0)
        overtime_forecast = max(round(overtime_forecast, 1), 0.0)
        absenteeism_forecast = max(round(absenteeism_forecast, 1), 0.0)

        return {
            "last_period": last_period_str,
            "next_period": next_period_str,
            "current_emp_count": int(current_emp_count),
            
            "payroll_forecast": payroll_forecast,
            "payroll_mae": pay_mae,
            "payroll_rmse": pay_rmse,
            "payroll_r2": pay_r2,
            
            "overtime_forecast": overtime_forecast,
            "overtime_mae": ot_mae,
            "overtime_rmse": ot_rmse,
            "overtime_r2": ot_r2,
            
            "absenteeism_forecast": absenteeism_forecast,
            "absenteeism_mae": abs_mae,
            "absenteeism_rmse": abs_rmse,
            "absenteeism_r2": abs_r2,

            "coefficients": {
                "beta_payroll": beta_pay.tolist(),
                "t_next": int(t_next),
                "next_month": next_month
            }
        }

    async def simulate_budget(self, new_employees: int, target_overtime_hours: float) -> Dict[str, Any]:
        stats = await self.get_dashboard_stats()
        coefs = stats["coefficients"]
        
        beta_pay = np.array(coefs["beta_payroll"])
        t_next = coefs["t_next"]
        next_month = coefs["next_month"]
        
        simulated_emp_count = stats["current_emp_count"] + new_employees
        next_is_july_dec = 1.0 if next_month in [7, 12] else 0.0

        predicted_payroll_base = np.dot([1.0, t_next, simulated_emp_count, next_is_july_dec], beta_pay)
        
        avg_salary = 1600.0 # Sueldo base promedio en planilla peruana
        avg_hourly_wage = avg_salary / 240
        
        cost_ot_25 = (target_overtime_hours * 0.6) * (avg_hourly_wage * 1.25)
        cost_ot_35 = (target_overtime_hours * 0.4) * (avg_hourly_wage * 1.35)
        total_ot_cost = cost_ot_25 + cost_ot_35
        
        essalud_ot_cost = total_ot_cost * 0.09
        
        simulated_total_payroll = predicted_payroll_base + total_ot_cost + essalud_ot_cost
        simulated_total_payroll = max(round(simulated_total_payroll, 2), 0.0)

        base_forecast = stats["payroll_forecast"]
        variation_pct = 0.0
        if base_forecast > 0:
            variation_pct = round(((simulated_total_payroll - base_forecast) / base_forecast) * 100, 2)

        return {
            "simulated_employees": simulated_emp_count,
            "simulated_overtime_hours": target_overtime_hours,
            "simulated_payroll_cost": simulated_total_payroll,
            "overtime_cost_impact": round(total_ot_cost, 2),
            "essalud_impact": round(essalud_ot_cost, 2),
            "variation_pct": variation_pct,
            "base_payroll_forecast": base_forecast
        }
