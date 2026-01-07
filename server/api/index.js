const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('../src/db'); // Adjusted path

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/api/health', (req, res) => {
    res.json({ message: 'Fake Medicine Detection API is running (Health Check)' });
});

// Routes stub
app.use('/api/medicine', require('../src/routes/medicine')); // Adjusted path
// app.use('/api/analytics', require('../src/routes/analytics')); 

// Export app for Vercel
module.exports = app;

// Production: Serve static files from local public folder
const path = require('path');
// Reliable path resolution for Vercel
const clientBuildPath = path.join(process.cwd(), 'src', 'public');

app.use(express.static(clientBuildPath));

// Handle React routing, return all requests to React app
// Express 5 requires (.*) instead of * for wildcard matching
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Only start the server if not running in a Vercel environment
if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
    });
}
