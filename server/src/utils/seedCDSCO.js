const db = require('../db');

async function seedCDSCOData() {
    try {
        console.log('Seeding CDSCO Mock Data...');

        // 1. Seed Approved Drugs
        await db.query(`
            INSERT INTO cdsco_approved_drugs (generic_name, brand_name, dosage_form, approval_date)
            VALUES 
            ('Amoxicillin', 'Amoxil', 'Capsule', '1990-05-15'),
            ('Paracetamol', 'Crocin', 'Tablet', '1985-10-10'),
            ('Metformin', 'Glycomet', 'Tablet', '2000-01-20')
            ON CONFLICT DO NOTHING;
        `);

        // 2. Seed Manufacturers
        await db.query(`
            INSERT INTO cdsco_manufacturers (company_name, license_number, state, license_status)
            VALUES 
            ('Sun Pharmaceutical Industries Ltd', 'DL-12345', 'Gujarat', 'Active'),
            ('Cipla Ltd', 'DL-67890', 'Maharashtra', 'Active'),
            ('Dr. Reddy''s Laboratories', 'DL-11223', 'Telangana', 'Active')
            ON CONFLICT DO NOTHING;
        `);

        // 3. Seed Banned Drugs
        await db.query(`
            INSERT INTO cdsco_banned_drugs (drug_name, notification_number, banned_date, reason)
            VALUES 
            ('Nimesulide Formulation', 'GSR 123(E)', '2011-02-10', 'High risk of hepatotoxicity in children')
            ON CONFLICT DO NOTHING;
        `);

        // 4. Seed Safety Alerts (NSQ)
        await db.query(`
            INSERT INTO cdsco_safety_alerts (medicine_name, batch_number, manufacturer_name, reason_for_alert, alert_type)
            VALUES 
            ('Paracetamol 500mg', 'BATCH-XY-001', 'Local Pharma Pvt Ltd', 'Fails Dissolution Test', 'NSQ'),
            ('Fake-Cillin', 'FAKE-789', 'Unknown', 'Spurious / Counterfeit', 'Spurious')
            ON CONFLICT DO NOTHING;
        `);

        console.log('CDSCO Mock Data Seeded Successfully.');
    } catch (err) {
        console.error('Error seeding CDSCO data:', err.message);
    }
}

module.exports = { seedCDSCOData };
