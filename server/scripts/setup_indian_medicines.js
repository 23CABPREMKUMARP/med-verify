const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const setupDatabase = async () => {
    try {
        console.log('Starting Database Setup...');

        // 1. Create Indian Medicines Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS indian_medicines (
                id SERIAL PRIMARY KEY,
                medicine_name VARCHAR(255) NOT NULL,
                manufacturer VARCHAR(255),
                composition TEXT,
                price DECIMAL(10, 2),
                dosage_form VARCHAR(100),
                category VARCHAR(100),
                therapeutic_class VARCHAR(255),
                indications TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Created indian_medicines table.');

        // 2. Clear existing entries to prevent duplicates during testing
        await pool.query('TRUNCATE TABLE indian_medicines RESTART IDENTITY;');

        // 3. Seed Sample Data (Simulating the GitHub Dataset)
        const sampleMedicines = [
            {
                medicine_name: 'Dolo-650',
                manufacturer: 'Micro Labs Ltd',
                composition: 'Paracetamol (650mg)',
                price: 30.50,
                dosage_form: 'Tablet',
                category: 'Allopathic',
                therapeutic_class: 'Analgesic & Antipyretic',
                indications: 'Fever, Mild to moderate pain.'
            },
            {
                medicine_name: 'Saridon',
                manufacturer: 'Bayer Pharmaceuticals',
                composition: 'Paracetamol, Propyphenazone, Caffeine',
                price: 42.00,
                dosage_form: 'Tablet',
                category: 'Allopathic',
                therapeutic_class: 'Analgesic',
                indications: 'Headache.'
            },
            {
                medicine_name: 'Azithral 500',
                manufacturer: 'Alembic Pharmaceuticals',
                composition: 'Azithromycin (500mg)',
                price: 119.50,
                dosage_form: 'Tablet',
                category: 'Allopathic',
                therapeutic_class: 'Antibiotic',
                indications: 'Bacterial infections.'
            },
            {
                medicine_name: 'Amoxil',
                manufacturer: 'Sun Pharma',
                composition: 'Amoxicillin (500mg)',
                price: 105.00,
                dosage_form: 'Capsule',
                category: 'Allopathic',
                therapeutic_class: 'Antibiotic',
                indications: 'Bacterial infections.'
            },
            {
                medicine_name: 'Augmentin 625',
                manufacturer: 'GlaxoSmithKline',
                composition: 'Amoxicillin (500mg) + Clavulanic Acid (125mg)',
                price: 201.00,
                dosage_form: 'Tablet',
                category: 'Allopathic',
                therapeutic_class: 'Antibiotic',
                indications: 'Bacterial infections.'
            }
        ];

        for (const med of sampleMedicines) {
            await pool.query(`
                INSERT INTO indian_medicines 
                (medicine_name, manufacturer, composition, price, dosage_form, category, therapeutic_class, indications)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `, [med.medicine_name, med.manufacturer, med.composition, med.price, med.dosage_form, med.category, med.therapeutic_class, med.indications]);
        }
        console.log(`✅ Seeded ${sampleMedicines.length} medicines into indian_medicines.`);

        // 4. Ensure CDSCO Safety Alerts Table exists and has sample data for testing
        // We might keep existing tables, but let's reinforce the data we need.
        await pool.query(`
            CREATE TABLE IF NOT EXISTS cdsco_safety_alerts (
                id SERIAL PRIMARY KEY,
                medicine_name VARCHAR(255),
                batch_number VARCHAR(255),
                manufacturer_name VARCHAR(255),
                alert_type VARCHAR(100),
                reason_for_alert TEXT,
                alert_date DATE DEFAULT CURRENT_DATE
            );
        `);

        // Remove old test verify logic artifacts if needed
        await pool.query("DELETE FROM cdsco_safety_alerts WHERE batch_number IN ('BATCH-XY-001', 'FAKE-789')");

        await pool.query(`
            INSERT INTO cdsco_safety_alerts (medicine_name, batch_number, manufacturer_name, alert_type, reason_for_alert)
            VALUES 
            ('Paracetamol 500mg', 'BATCH-XY-001', 'Local Pharma Pvt Ltd', 'NSQ', 'Fails Dissolution Test'),
            ('Fake-Cillin', 'FAKE-789', 'Unknown', 'Spurious', 'Spurious / Counterfeit product detected')
        `);
        console.log('✅ Seeded safety alerts.');

        console.log('Database Setup Completed Successfully.');
        process.exit(0);

    } catch (err) {
        console.error('Database Setup Error:', err);
        process.exit(1);
    }
};

setupDatabase();
