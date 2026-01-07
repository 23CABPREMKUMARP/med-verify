const fs = require('fs');
const path = require('path');
const db = require('../db');
const { seedCDSCOData } = require('./seedCDSCO');

async function initDb() {
    try {
        console.log('Initializing Database Schema...');
        const schemaPath = path.join(__dirname, '..', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        await db.query(schema);
        console.log('Schema Applied Successfully.');

        await seedCDSCOData();
        console.log('Database Initialization Complete.');
        process.exit(0);
    } catch (err) {
        console.error('Database Initialization Failed:', err.message);
        process.exit(1);
    }
}

initDb();
