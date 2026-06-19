-- PostgreSQL Database Schema (English Names)
-- Legal Context: Peru Labor Law (Decreto Legislativo Nº 728)

-- 0. Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_at TIMESTAMP,
    updated_by VARCHAR(50),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(50)
);

-- 1. Administrators Table (Security & Authentication)
CREATE TABLE IF NOT EXISTS administrators (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'admin', -- 'admin', 'super_admin' (Legacy)
    role_id INT REFERENCES roles(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    failed_login_attempts INT DEFAULT 0,   -- Contador de intentos fallidos consecutivos
    locked_at TIMESTAMP DEFAULT NULL,       -- Fecha/hora de bloqueo automático
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_at TIMESTAMP,
    updated_by VARCHAR(50),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(50)
);

-- 2. Employees Table (Personal Identification & Data)
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    first_names VARCHAR(100) NOT NULL,
    last_names VARCHAR(100) NOT NULL,
    full_name VARCHAR(200) GENERATED ALWAYS AS (first_names || ' ' || last_names) STORED,
    document_number VARCHAR(8) UNIQUE NOT NULL, -- DNI
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    has_children BOOLEAN DEFAULT FALSE, -- For Asignación Familiar
    pension_system VARCHAR(10) NOT NULL, -- 'ONP' or 'AFP'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_at TIMESTAMP,
    updated_by VARCHAR(50),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(50)
);

-- 3. Contracts Table (Employment Contracts & Career Progression)
CREATE TABLE IF NOT EXISTS contracts (
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employees(id) ON DELETE CASCADE,
    position VARCHAR(100) NOT NULL, -- Job Title
    monthly_salary DECIMAL(10, 2) NOT NULL, -- Base Salary (S/.)
    hourly_wage DECIMAL(10, 2) NOT NULL, -- Calculated (monthly_salary / 240)
    start_date DATE NOT NULL,
    end_date DATE, -- NULL for indefinite contracts
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_at TIMESTAMP,
    updated_by VARCHAR(50),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(50)
);

-- 4. Biometrics Table (Biometric Signatures for Authentication)
CREATE TABLE IF NOT EXISTS biometrics (
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employees(id) ON DELETE CASCADE,
    biometric_type VARCHAR(20) NOT NULL, -- 'face' or 'fingerprint'
    pattern_data TEXT NOT NULL, -- CNN Face embeddings (128-d / 512-d) or Fingerprint hash
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_at TIMESTAMP,
    updated_by VARCHAR(50),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(50)
);

-- 5. Shifts Table (Scheduled Working Hours)
CREATE TABLE IF NOT EXISTS shifts (
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employees(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 1=Monday, etc.
    start_time TIME NOT NULL, -- Expected entrance time (e.g. 08:00:00)
    end_time TIME NOT NULL, -- Expected exit time (e.g. 17:00:00)
    tolerance INT DEFAULT 10, -- Tolerance in minutes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_at TIMESTAMP,
    updated_by VARCHAR(50),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(50),
    UNIQUE (employee_id, day_of_week)
);

-- 6. Attendance Logs Table (Fichadas / Punches)
CREATE TABLE IF NOT EXISTS attendance_logs (
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employees(id) ON DELETE CASCADE,
    timestamp TIMESTAMP NOT NULL,
    method VARCHAR(20) NOT NULL, -- 'face', 'fingerprint', 'manual'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_at TIMESTAMP,
    updated_by VARCHAR(50),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(50)
);

-- 7. Justifications Table (Leaves & Medical Justifications)
CREATE TABLE IF NOT EXISTS justifications (
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employees(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    justification_type VARCHAR(50) NOT NULL, -- 'medical', 'license', 'permit'
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_at TIMESTAMP,
    updated_by VARCHAR(50),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(50),
    UNIQUE (employee_id, date)
);

-- 8. Payrolls Table (Monthly Payroll Records)
CREATE TABLE IF NOT EXISTS payrolls (
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employees(id) ON DELETE CASCADE,
    period VARCHAR(7) NOT NULL, -- YYYY-MM
    days_worked INT DEFAULT 30,
    lateness_minutes INT DEFAULT 0,
    overtime_25_hours DECIMAL(5, 2) DEFAULT 0.0,
    overtime_35_hours DECIMAL(5, 2) DEFAULT 0.0,
    base_salary DECIMAL(10, 2) NOT NULL, -- Contractual salary
    family_allowance DECIMAL(10, 2) DEFAULT 0.0, -- S/. 102.50
    overtime_pay DECIMAL(10, 2) DEFAULT 0.0,
    lateness_deduction DECIMAL(10, 2) DEFAULT 0.0,
    absence_deduction DECIMAL(10, 2) DEFAULT 0.0,
    gross_salary DECIMAL(10, 2) NOT NULL,
    pension_deduction DECIMAL(10, 2) NOT NULL, -- AFP or ONP
    net_salary DECIMAL(10, 2) NOT NULL,
    essalud_contribution DECIMAL(10, 2) NOT NULL, -- 9% Employer Cost
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_at TIMESTAMP,
    updated_by VARCHAR(50),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(50),
    UNIQUE (employee_id, period)
);

-- 9. Chatbot Knowledge Base Table
CREATE TABLE IF NOT EXISTS knowledge (
    question VARCHAR(255) PRIMARY KEY,
    answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_at TIMESTAMP,
    updated_by VARCHAR(50),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(50)
);

-- 10. Audit Logs Table (Unified system audit trails)
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_at TIMESTAMP,
    updated_by VARCHAR(50),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(50)
);

-- 11. Permissions Table (Granular system actions)
CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    module VARCHAR(50) NOT NULL,
    action VARCHAR(20) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_at TIMESTAMP,
    updated_by VARCHAR(50),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(50)
);

-- 12. Role Permissions Join Table
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INT REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 13. Menus Table (UI visible modules)
CREATE TABLE IF NOT EXISTS menus (
    id SERIAL PRIMARY KEY,
    key VARCHAR(50) UNIQUE NOT NULL,
    label VARCHAR(100) NOT NULL,
    icon TEXT,
    parent_id INT REFERENCES menus(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    updated_at TIMESTAMP,
    updated_by VARCHAR(50),
    deleted_at TIMESTAMP,
    deleted_by VARCHAR(50)
);

-- 14. Role Menus Join Table
CREATE TABLE IF NOT EXISTS role_menus (
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    menu_id INT REFERENCES menus(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, menu_id)
);

-- 15. AFP Configuration Table (Peru Pension System)
CREATE TABLE IF NOT EXISTS afp_configs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL, -- 'Integra', 'Habitat', 'Prima', 'Profuturo'
    mandatory_contribution DECIMAL(5, 4) DEFAULT 0.1000, -- 10%
    insurance_premium DECIMAL(5, 4) NOT NULL, -- e.g. 0.0184
    flow_commission DECIMAL(5, 4) DEFAULT 0.0100, -- e.g. 0.0100
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(50)
);
