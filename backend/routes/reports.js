const express = require('express');
const router = express.Router();
const { getAllReports, getReportById, createReport, updateReport, deleteReport } = require('../data/store');
const { validateCreateReport, validateUpdateReport } = require('../middleware/validate');

// ─── GET /api/reports ──────────────────────────────────────────────────────────
// Retrieve all reports with optional search and filter
router.get('/', (req, res) => {
  try {
    let reports = getAllReports();
    const { search, type, status } = req.query;

    if (search) {
      const q = search.toLowerCase();
      reports = reports.filter(
        (r) =>
          r.reporterName.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          (r.upiId && r.upiId.toLowerCase().includes(q)) ||
          (r.transactionId && r.transactionId.toLowerCase().includes(q)) ||
          (r.bankName && r.bankName.toLowerCase().includes(q))
      );
    }

    if (type) {
      reports = reports.filter((r) => r.incidentType === type);
    }

    if (status) {
      reports = reports.filter((r) => r.status === status);
    }

    // Sort by most recently created
    reports = reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// ─── GET /api/reports/:id ──────────────────────────────────────────────────────
router.get('/:id', (req, res) => {
  try {
    const report = getReportById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: `Report with id '${req.params.id}' not found.` });
    }
    res.status(200).json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// ─── POST /api/reports ─────────────────────────────────────────────────────────
router.post('/', validateCreateReport, (req, res) => {
  try {
    const { reporterName, email, phone, incidentDate, upiId, transactionId, amountLost, incidentType, bankName, description } = req.body;

    const report = createReport({
      reporterName: reporterName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      incidentDate,
      upiId: upiId ? upiId.trim() : '',
      transactionId: transactionId ? transactionId.trim() : '',
      amountLost: Number(amountLost),
      incidentType,
      bankName: bankName ? bankName.trim() : '',
      description: description.trim(),
    });

    res.status(201).json({ success: true, message: 'Fraud report submitted successfully.', data: report });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// ─── PUT /api/reports/:id ──────────────────────────────────────────────────────
router.put('/:id', validateUpdateReport, (req, res) => {
  try {
    const existing = getReportById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: `Report with id '${req.params.id}' not found.` });
    }

    const allowedFields = ['reporterName', 'email', 'phone', 'incidentDate', 'upiId', 'transactionId', 'amountLost', 'incidentType', 'bankName', 'description', 'status'];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.amountLost !== undefined) updates.amountLost = Number(updates.amountLost);
    if (updates.reporterName) updates.reporterName = updates.reporterName.trim();
    if (updates.description) updates.description = updates.description.trim();

    const updated = updateReport(req.params.id, updates);
    res.status(200).json({ success: true, message: 'Report updated successfully.', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// ─── DELETE /api/reports/:id ───────────────────────────────────────────────────
router.delete('/:id', (req, res) => {
  try {
    const deleted = deleteReport(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: `Report with id '${req.params.id}' not found.` });
    }
    res.status(200).json({ success: true, message: 'Report deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

module.exports = router;
