export interface UserProfile {
  username: string;
  email: string;
  role: string;
  menus: string[];
  scopes: string[];
}

export interface Employee {
  id: number;
  first_names: string;
  last_names: string;
  full_name: string;
  document_number: string;
  email: string;
  phone?: string;
  has_children: boolean;
  pension_system: string;
  position: string;
  monthly_salary: number;
}

export interface Contract {
  id: number;
  employee_id: number;
  position: string;
  monthly_salary: number;
  hourly_wage: number;
  start_date: string;
  end_date?: string;
  is_active: boolean;
}

export interface Shift {
  id: number;
  employee_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  tolerance?: number;
}

export interface AttendanceLog {
  id: number;
  employee_id: number;
  nombre?: string;
  timestamp: string;
  method: string;
}

export interface Justification {
  id: number;
  employee_id: number;
  date: string;
  justification_type: string;
  description?: string;
}

export interface Payroll {
  id: number;
  employee_id: number;
  full_name: string;
  document_number: string;
  period: string;
  days_worked: number;
  lateness_minutes: number;
  overtime_25_hours: number;
  overtime_35_hours: number;
  base_salary: number;
  family_allowance: number;
  overtime_pay: number;
  lateness_deduction: number;
  absence_deduction: number;
  gross_salary: number;
  pension_deduction: number;
  net_salary: number;
  essalud_contribution: number;
}

export interface AuditLog {
  id: number;
  username: string;
  action: string;
  description: string;
  timestamp: string;
  created_at?: string;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  failed_login_attempts?: number;
  locked_at?: string | null;
}
