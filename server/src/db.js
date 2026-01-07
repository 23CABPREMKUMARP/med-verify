const { Pool } = require('pg');
require('dotenv').config();

const pool = process.env.DATABASE_URL
  ? new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for many cloud DBs (Render/Neon/Supabase)
  })
  : null;

if (pool) {
  pool.on('connect', () => {
    console.log('Connected to the PostgreSQL database');
  });

  pool.on('error', (err) => {
    console.error('PostgreSQL Connection Error:', err.message);
  });
} else {
  console.log('DATABASE_URL not found. Using Mock Data exclusively.');
}

// --- Viva-Safe Mock Fallback Data ---
const mockData = {
  cdsco_approved_drugs: [
    {
      generic_name: 'Amoxicillin',
      brand_name: 'Amoxil',
      dosage_form: 'Capsule',
      therapeutic_class: 'Antibiotic',
      indication: 'Bacterial infections of the ear, nose, throat, skin, or urinary tract.'
    },
    {
      generic_name: 'Paracetamol',
      brand_name: 'Crocin',
      dosage_form: 'Tablet',
      therapeutic_class: 'Analgesic & Antipyretic',
      indication: 'Pain relief and fever reduction.'
    },
    {
      generic_name: 'Metformin',
      brand_name: 'Glycomet',
      dosage_form: 'Tablet',
      therapeutic_class: 'Anti-diabetic',
      indication: 'Type 2 diabetes mellitus management.'
    }
  ],
  cdsco_manufacturers: [
    { company_name: 'Sun Pharmaceutical Industries Ltd', license_number: 'DL-12345', license_status: 'Active' },
    { company_name: 'Cipla Ltd', license_number: 'DL-67890', license_status: 'Active' },
    { company_name: "Dr. Reddy's Laboratories", license_number: 'DL-11223', license_status: 'Active' }
  ],
  cdsco_banned_drugs: [
    { drug_name: 'Nimesulide Formulation', notification_number: 'GSR 123(E)', reason: 'High risk of hepatotoxicity' }
  ],
  cdsco_safety_alerts: [
    {
      medicine_name: 'Paracetamol 500mg',
      batch_number: 'BATCH-XY-001',
      manufacturer_name: 'Local Pharma Pvt Ltd',
      alert_type: 'NSQ',
      reason_for_alert: 'Fails Dissolution Test'
    },
    {
      medicine_name: 'Fake-Cillin',
      batch_number: 'FAKE-789',
      manufacturer_name: 'Unknown',
      alert_type: 'Spurious',
      reason_for_alert: 'Spurious / Counterfeit'
    }
  ],
  batch_blacklist: [
    {
      batch_number: 'BLACK-999',
      source: 'WHO GSMS',
      reason: 'Falsified version detected in multiple countries',
      medicine_name: 'Artesunate'
    }
  ],
  verification_logs: [
    { batch_number: 'BATCH-X', reported_expiry: '2025-12-31' }
  ],
  indian_medicines: [
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
  ]
};

module.exports = {
  query: async (text, params) => {
    try {
      // Try real DB first
      return await pool.query(text, params);
    } catch (err) {
      console.warn('DB Query Failed, using Mock Fallback:', err.message);

      // Simple Mock Lookup Logic for Demo
      const lowerText = text.toLowerCase();
      let rows = [];

      if (lowerText.includes('cdsco_banned_drugs')) {
        const searchTerm = params[0].replace(/%/g, '').toLowerCase();
        rows = mockData.cdsco_banned_drugs.filter(d =>
          d.drug_name.toLowerCase().includes(searchTerm)
        );
      } else if (lowerText.includes('cdsco_safety_alerts')) {
        rows = mockData.cdsco_safety_alerts.filter(d => d.batch_number === params[0]);
      } else if (lowerText.includes('cdsco_approved_drugs')) {
        const searchTerm = params[0].replace(/%/g, '').toLowerCase();
        rows = mockData.cdsco_approved_drugs.filter(d =>
          d.generic_name.toLowerCase().includes(searchTerm) ||
          d.brand_name.toLowerCase().includes(searchTerm)
        );
      } else if (lowerText.includes('cdsco_manufacturers')) {
        const searchTerm = params[0].replace(/%/g, '').toLowerCase();
        rows = mockData.cdsco_manufacturers.filter(d => d.company_name.toLowerCase().includes(searchTerm));
      } else if (lowerText.includes('batch_blacklist')) {
        rows = mockData.batch_blacklist.filter(d => d.batch_number === params[0]);
      } else if (lowerText.includes('indian_medicines')) {
        const searchTerm = params[0].replace(/%/g, '').toLowerCase();
        rows = mockData.indian_medicines.filter(d =>
          d.medicine_name.toLowerCase().includes(searchTerm)
        );
      } else if (lowerText.includes('verification_logs')) {
        if (lowerText.includes('select')) {
          rows = mockData.verification_logs.filter(d =>
            d.batch_number === params[0] && (params.length < 2 || d.reported_expiry !== params[1])
          );
        } else if (lowerText.includes('insert')) {
          console.log('Mock: verification log inserted:', params);
          return { rows: [] };
        }
      }

      console.log(`Mock DB Query: ${text} | params: ${params} | Results Found: ${rows.length}`);
      return { rows };
    }
  },
};
