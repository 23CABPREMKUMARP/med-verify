-- CDSCO Database Schema for Fake Medicine Detection
-- This schema represents data ingested from CDSCO public documents (PDF/XLS/HTML)

-- 1. Table for Approved Drugs in India
CREATE TABLE IF NOT EXISTS cdsco_approved_drugs (
    id SERIAL PRIMARY KEY,
    generic_name VARCHAR(255) NOT NULL,
    brand_name VARCHAR(255),
    dosage_form VARCHAR(100),
    therapeutic_class VARCHAR(150),
    approval_date DATE,
    indication TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table for Licensed Manufacturers
CREATE TABLE IF NOT EXISTS cdsco_manufacturers (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) UNIQUE,
    state VARCHAR(100),
    address TEXT,
    license_status VARCHAR(50) DEFAULT 'Active', -- Active, Suspended, Cancelled
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Table for Banned or Restricted Drugs
CREATE TABLE IF NOT EXISTS cdsco_banned_drugs (
    id SERIAL PRIMARY KEY,
    drug_name VARCHAR(255) NOT NULL,
    notification_number VARCHAR(100),
    banned_date DATE,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Table for Safety Alerts / NSQ (Not of Standard Quality) Reports
-- This table stores batch-specific data extracted from periodic CDSCO alerts
CREATE TABLE IF NOT EXISTS cdsco_safety_alerts (
    id SERIAL PRIMARY KEY,
    medicine_name VARCHAR(255) NOT NULL,
    batch_number VARCHAR(100) NOT NULL,
    manufacturer_name VARCHAR(255),
    reason_for_alert TEXT, -- e.g., "Failed disintegration test", "Spurious"
    alert_type VARCHAR(50), -- NSQ, Spurious, Misbranded
    report_month_year VARCHAR(20), -- e.g., "November 2023"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster lookup
CREATE INDEX IF NOT EXISTS idx_cdsco_approved_drugs_name ON cdsco_approved_drugs(generic_name, brand_name);
CREATE INDEX IF NOT EXISTS idx_cdsco_safety_batch ON cdsco_safety_alerts(batch_number);
CREATE INDEX IF NOT EXISTS idx_cdsco_manufacturers_name ON cdsco_manufacturers(company_name);

-- 5. Global Batch Blacklist (Aggregated from WHO, Global Recalls, and Manual Flags)
CREATE TABLE IF NOT EXISTS batch_blacklist (
    id SERIAL PRIMARY KEY,
    batch_number VARCHAR(100) UNIQUE NOT NULL,
    source VARCHAR(100), -- e.g., "WHO GSMS", "DEA", "Manual"
    reason TEXT,
    severity VARCHAR(20) DEFAULT 'HIGH', -- HIGH, MEDIUM
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Verification Logs (For pattern detection and suspicious expiry tracking)
CREATE TABLE IF NOT EXISTS verification_logs (
    id SERIAL PRIMARY KEY,
    medicine_name VARCHAR(255),
    batch_number VARCHAR(100),
    reported_expiry DATE,
    user_location VARCHAR(100),
    verification_status VARCHAR(50),
    verification_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_logs_batch ON verification_logs(batch_number);
