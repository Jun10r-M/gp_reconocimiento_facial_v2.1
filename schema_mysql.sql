-- ============================================================
-- MySQL Database Schema
-- Sistema de Gestión de Planillas - Perú (D.Leg. 728)
-- Compatible con MySQL 5.7+ y MySQL 8.x
-- ============================================================

-- Crear base de datos (ajusta el nombre si ya la tienes)
CREATE DATABASE IF NOT EXISTS db_gestion_planilla
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE db_gestion_planilla;

-- Deshabilitar verificación de claves foráneas durante la creación
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- 0. Tabla: roles
-- ============================================================
CREATE TABLE IF NOT EXISTS roles (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(50)  NOT NULL UNIQUE,
    description VARCHAR(255) NULL,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by  VARCHAR(50)  NULL,
    updated_at  DATETIME     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    updated_by  VARCHAR(50)  NULL,
    deleted_at  DATETIME     NULL DEFAULT NULL,
    deleted_by  VARCHAR(50)  NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 1. Tabla: administrators
-- ============================================================
CREATE TABLE IF NOT EXISTS administrators (
    id                    INT AUTO_INCREMENT PRIMARY KEY,
    username              VARCHAR(50)  NOT NULL UNIQUE,
    password_hash         VARCHAR(255) NOT NULL,
    email                 VARCHAR(100) NOT NULL UNIQUE,
    role                  VARCHAR(20)  NOT NULL DEFAULT 'admin',  -- Legacy: 'admin', 'super_admin'
    role_id               INT          NULL,
    is_active             TINYINT(1)   NOT NULL DEFAULT 1,
    failed_login_attempts INT          NOT NULL DEFAULT 0,
    locked_at             DATETIME     NULL DEFAULT NULL,
    created_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by            VARCHAR(50)  NULL,
    updated_at            DATETIME     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    updated_by            VARCHAR(50)  NULL,
    deleted_at            DATETIME     NULL DEFAULT NULL,
    deleted_by            VARCHAR(50)  NULL,
    CONSTRAINT fk_admin_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. Tabla: employees
-- ============================================================
CREATE TABLE IF NOT EXISTS employees (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    first_names     VARCHAR(100) NOT NULL,
    last_names      VARCHAR(100) NOT NULL,
    full_name       VARCHAR(201) GENERATED ALWAYS AS (CONCAT(first_names, ' ', last_names)) STORED,
    document_number VARCHAR(8)   NOT NULL UNIQUE,  -- DNI
    email           VARCHAR(100) NOT NULL UNIQUE,
    phone           VARCHAR(20)  NULL,
    has_children    TINYINT(1)   NOT NULL DEFAULT 0,  -- Para Asignación Familiar
    pension_system  VARCHAR(20)  NOT NULL,            -- 'ONP', 'Integra', 'Habitat', 'Prima', 'Profuturo'
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by      VARCHAR(50)  NULL,
    updated_at      DATETIME     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    updated_by      VARCHAR(50)  NULL,
    deleted_at      DATETIME     NULL DEFAULT NULL,
    deleted_by      VARCHAR(50)  NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. Tabla: contracts
-- ============================================================
CREATE TABLE IF NOT EXISTS contracts (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    employee_id    INT            NOT NULL,
    position       VARCHAR(100)   NOT NULL,
    monthly_salary DECIMAL(10, 2) NOT NULL,
    hourly_wage    DECIMAL(10, 2) NOT NULL,  -- monthly_salary / 240
    start_date     DATE           NOT NULL,
    end_date       DATE           NULL,       -- NULL = contrato indefinido
    is_active      TINYINT(1)     NOT NULL DEFAULT 1,
    created_at     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by     VARCHAR(50)    NULL,
    updated_at     DATETIME       NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    updated_by     VARCHAR(50)    NULL,
    deleted_at     DATETIME       NULL DEFAULT NULL,
    deleted_by     VARCHAR(50)    NULL,
    CONSTRAINT fk_contract_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. Tabla: biometrics
-- ============================================================
CREATE TABLE IF NOT EXISTS biometrics (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    employee_id    INT         NOT NULL,
    biometric_type VARCHAR(20) NOT NULL,  -- 'face', 'fingerprint'
    pattern_data   LONGTEXT    NOT NULL,  -- embeddings CNN o hash huella
    created_at     DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by     VARCHAR(50) NULL,
    updated_at     DATETIME    NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    updated_by     VARCHAR(50) NULL,
    deleted_at     DATETIME    NULL DEFAULT NULL,
    deleted_by     VARCHAR(50) NULL,
    CONSTRAINT fk_biometrics_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. Tabla: shifts
-- ============================================================
CREATE TABLE IF NOT EXISTS shifts (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT         NOT NULL,
    day_of_week INT         NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),  -- 0=Domingo
    start_time  TIME        NOT NULL,
    end_time    TIME        NOT NULL,
    tolerance   INT         NOT NULL DEFAULT 10,  -- minutos de tolerancia
    created_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by  VARCHAR(50) NULL,
    updated_at  DATETIME    NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    updated_by  VARCHAR(50) NULL,
    deleted_at  DATETIME    NULL DEFAULT NULL,
    deleted_by  VARCHAR(50) NULL,
    UNIQUE KEY uq_shift_employee_day (employee_id, day_of_week),
    CONSTRAINT fk_shifts_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. Tabla: attendance_logs
-- ============================================================
CREATE TABLE IF NOT EXISTS attendance_logs (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT         NOT NULL,
    timestamp   DATETIME    NOT NULL,
    method      VARCHAR(20) NOT NULL,  -- 'face', 'fingerprint', 'manual'
    created_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by  VARCHAR(50) NULL,
    updated_at  DATETIME    NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    updated_by  VARCHAR(50) NULL,
    deleted_at  DATETIME    NULL DEFAULT NULL,
    deleted_by  VARCHAR(50) NULL,
    CONSTRAINT fk_attendance_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. Tabla: justifications
-- ============================================================
CREATE TABLE IF NOT EXISTS justifications (
    id                 INT AUTO_INCREMENT PRIMARY KEY,
    employee_id        INT         NOT NULL,
    date               DATE        NOT NULL,
    justification_type VARCHAR(50) NOT NULL,  -- 'medical', 'license', 'permit'
    description        TEXT        NULL,
    created_at         DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by         VARCHAR(50) NULL,
    updated_at         DATETIME    NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    updated_by         VARCHAR(50) NULL,
    deleted_at         DATETIME    NULL DEFAULT NULL,
    deleted_by         VARCHAR(50) NULL,
    UNIQUE KEY uq_justification_employee_date (employee_id, date),
    CONSTRAINT fk_justification_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 8. Tabla: payrolls
-- ============================================================
CREATE TABLE IF NOT EXISTS payrolls (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    employee_id         INT            NOT NULL,
    period              VARCHAR(7)     NOT NULL,           -- YYYY-MM
    days_worked         INT            NOT NULL DEFAULT 30,
    lateness_minutes    INT            NOT NULL DEFAULT 0,
    overtime_25_hours   DECIMAL(5, 2)  NOT NULL DEFAULT 0.00,
    overtime_35_hours   DECIMAL(5, 2)  NOT NULL DEFAULT 0.00,
    base_salary         DECIMAL(10, 2) NOT NULL,
    family_allowance    DECIMAL(10, 2) NOT NULL DEFAULT 0.00,  -- S/. 102.50
    overtime_pay        DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    lateness_deduction  DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    absence_deduction   DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    gross_salary        DECIMAL(10, 2) NOT NULL,
    pension_deduction   DECIMAL(10, 2) NOT NULL,               -- AFP o ONP
    net_salary          DECIMAL(10, 2) NOT NULL,
    essalud_contribution DECIMAL(10, 2) NOT NULL,              -- 9% costo empleador
    created_at          DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          VARCHAR(50)    NULL,
    updated_at          DATETIME       NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    updated_by          VARCHAR(50)    NULL,
    deleted_at          DATETIME       NULL DEFAULT NULL,
    deleted_by          VARCHAR(50)    NULL,
    UNIQUE KEY uq_payroll_employee_period (employee_id, period),
    CONSTRAINT fk_payroll_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 9. Tabla: knowledge (Base de conocimiento chatbot)
-- ============================================================
CREATE TABLE IF NOT EXISTS knowledge (
    question   VARCHAR(255) PRIMARY KEY,
    answer     TEXT         NOT NULL,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50)  NULL,
    updated_at DATETIME     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    updated_by VARCHAR(50)  NULL,
    deleted_at DATETIME     NULL DEFAULT NULL,
    deleted_by VARCHAR(50)  NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 10. Tabla: audit_logs
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    username    VARCHAR(50)  NOT NULL,
    action      VARCHAR(100) NOT NULL,
    description TEXT         NULL,
    timestamp   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by  VARCHAR(50)  NULL,
    updated_at  DATETIME     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    updated_by  VARCHAR(50)  NULL,
    deleted_at  DATETIME     NULL DEFAULT NULL,
    deleted_by  VARCHAR(50)  NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 11. Tabla: permissions
-- ============================================================
CREATE TABLE IF NOT EXISTS permissions (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    module     VARCHAR(50)  NOT NULL,
    action     VARCHAR(20)  NOT NULL,
    code       VARCHAR(100) NOT NULL UNIQUE,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50)  NULL,
    updated_at DATETIME     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    updated_by VARCHAR(50)  NULL,
    deleted_at DATETIME     NULL DEFAULT NULL,
    deleted_by VARCHAR(50)  NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 12. Tabla: role_permissions (join)
-- ============================================================
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id       INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_rp_role       FOREIGN KEY (role_id)       REFERENCES roles(id)       ON DELETE CASCADE,
    CONSTRAINT fk_rp_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 13. Tabla: menus
-- ============================================================
CREATE TABLE IF NOT EXISTS menus (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    `key`      VARCHAR(50)  NOT NULL UNIQUE,
    label      VARCHAR(100) NOT NULL,
    icon       TEXT         NULL,
    parent_id  INT          NULL,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50)  NULL,
    updated_at DATETIME     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    updated_by VARCHAR(50)  NULL,
    deleted_at DATETIME     NULL DEFAULT NULL,
    deleted_by VARCHAR(50)  NULL,
    CONSTRAINT fk_menu_parent FOREIGN KEY (parent_id) REFERENCES menus(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 14. Tabla: role_menus (join)
-- ============================================================
CREATE TABLE IF NOT EXISTS role_menus (
    role_id INT NOT NULL,
    menu_id INT NOT NULL,
    PRIMARY KEY (role_id, menu_id),
    CONSTRAINT fk_rm_role FOREIGN KEY (role_id) REFERENCES roles(id)  ON DELETE CASCADE,
    CONSTRAINT fk_rm_menu FOREIGN KEY (menu_id) REFERENCES menus(id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 15. Tabla: afp_configs (Administradoras de Fondos de Pensiones)
-- ============================================================
CREATE TABLE IF NOT EXISTS afp_configs (
    id                    INT AUTO_INCREMENT PRIMARY KEY,
    name                  VARCHAR(50)   NOT NULL UNIQUE,  -- 'Integra', 'Habitat', 'Prima', 'Profuturo'
    mandatory_contribution DECIMAL(5, 4) NOT NULL DEFAULT 0.1000,  -- 10%
    insurance_premium     DECIMAL(5, 4) NOT NULL,                  -- e.g. 0.0184
    flow_commission       DECIMAL(5, 4) NOT NULL DEFAULT 0.0100,   -- e.g. 0.0100
    updated_at            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by            VARCHAR(50)   NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Rehabilitar verificación de claves foráneas
-- ============================================================
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- Datos semilla: AFP configs
-- ============================================================
INSERT IGNORE INTO afp_configs (name, mandatory_contribution, insurance_premium, flow_commission) VALUES
    ('Integra',  0.1000, 0.0184, 0.0100),
    ('Habitat',  0.1000, 0.0182, 0.0100),
    ('Prima',    0.1000, 0.0186, 0.0100),
    ('Profuturo',0.1000, 0.0184, 0.0100);
