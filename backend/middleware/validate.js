/**
 * Validation middleware for fraud report creation and update.
 */

const VALID_INCIDENT_TYPES = ['phishing', 'fake_call', 'unauthorized_transaction', 'fake_qr', 'other'];
const VALID_STATUSES = ['pending', 'under_review', 'resolved', 'rejected'];

// Validate fields required for creating a new report
const validateCreateReport = (req, res, next) => {
  const errors = [];
  const { reporterName, email, phone, incidentDate, amountLost, incidentType, description } = req.body;

  if (!reporterName || typeof reporterName !== 'string' || reporterName.trim().length < 2) {
    errors.push('reporterName is required and must be at least 2 characters.');
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('A valid email address is required.');
  }

  if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
    errors.push('A valid 10-digit Indian mobile number is required.');
  }

  if (!incidentDate || isNaN(Date.parse(incidentDate))) {
    errors.push('A valid incidentDate (YYYY-MM-DD) is required.');
  } else if (new Date(incidentDate) > new Date()) {
    errors.push('incidentDate cannot be in the future.');
  }

  if (amountLost === undefined || amountLost === null || isNaN(Number(amountLost)) || Number(amountLost) < 0) {
    errors.push('amountLost must be a non-negative number.');
  }

  if (!incidentType || !VALID_INCIDENT_TYPES.includes(incidentType)) {
    errors.push(`incidentType must be one of: ${VALID_INCIDENT_TYPES.join(', ')}.`);
  }

  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    errors.push('description is required and must be at least 10 characters.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

// Validate fields for updating an existing report (all fields optional but must be valid if provided)
const validateUpdateReport = (req, res, next) => {
  const errors = [];
  const { reporterName, email, phone, incidentDate, amountLost, incidentType, description, status } = req.body;

  if (reporterName !== undefined && (typeof reporterName !== 'string' || reporterName.trim().length < 2)) {
    errors.push('reporterName must be at least 2 characters.');
  }

  if (email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('A valid email address is required.');
  }

  if (phone !== undefined && !/^[6-9]\d{9}$/.test(phone)) {
    errors.push('A valid 10-digit Indian mobile number is required.');
  }

  if (incidentDate !== undefined) {
    if (isNaN(Date.parse(incidentDate))) {
      errors.push('A valid incidentDate (YYYY-MM-DD) is required.');
    } else if (new Date(incidentDate) > new Date()) {
      errors.push('incidentDate cannot be in the future.');
    }
  }

  if (amountLost !== undefined && (isNaN(Number(amountLost)) || Number(amountLost) < 0)) {
    errors.push('amountLost must be a non-negative number.');
  }

  if (incidentType !== undefined && !VALID_INCIDENT_TYPES.includes(incidentType)) {
    errors.push(`incidentType must be one of: ${VALID_INCIDENT_TYPES.join(', ')}.`);
  }

  if (description !== undefined && (typeof description !== 'string' || description.trim().length < 10)) {
    errors.push('description must be at least 10 characters.');
  }

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    errors.push(`status must be one of: ${VALID_STATUSES.join(', ')}.`);
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

module.exports = { validateCreateReport, validateUpdateReport };
