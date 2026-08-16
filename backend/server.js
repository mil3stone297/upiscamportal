const express = require('express');
const cors = require('cors');
const path = require('path');

const reportsRouter = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// ─── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/reports', reportsRouter);

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'UPI Scam Portal API is running.', timestamp: new Date().toISOString() });
});

// ─── 404 Handler for unknown API routes ───────────────────────────────────────
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found.' });
});

// ─── SPA Fallback (serve index.html for all non-API routes) ───────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong on the server.' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 UPI Scam Portal Server running at http://localhost:${PORT}`);
  console.log(`📋 API base: http://localhost:${PORT}/api/reports`);
  console.log(`🌐 Frontend: http://localhost:${PORT}\n`);
});

module.exports = app;
