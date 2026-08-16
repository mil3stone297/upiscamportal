/**
 * Report Form View — Create new report and Edit existing report
 */

// ─── Validation ─────────────────────────────────────────────────────────────

const Validators = {
  required: (val) => val && val.trim().length > 0 ? null : 'This field is required.',
  minLen: (n) => (val) => val && val.trim().length >= n ? null : `Must be at least ${n} characters.`,
  email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? null : 'Enter a valid email address.',
  phone: (val) => /^[6-9]\d{9}$/.test(val) ? null : 'Enter a valid 10-digit Indian mobile number.',
  nonNegNumber: (val) => val !== '' && !isNaN(val) && Number(val) >= 0 ? null : 'Enter a valid non-negative amount.',
  pastDate: (val) => {
    if (!val) return 'Please select an incident date.';
    if (new Date(val) > new Date()) return 'Incident date cannot be in the future.';
    return null;
  },
};

const FIELD_RULES = {
  reporterName:  [Validators.required, Validators.minLen(2)],
  email:         [Validators.required, Validators.email],
  phone:         [Validators.required, Validators.phone],
  incidentDate:  [Validators.pastDate],
  amountLost:    [Validators.nonNegNumber],
  incidentType:  [Validators.required],
  description:   [Validators.required, Validators.minLen(10)],
};

function validateField(name, value) {
  const rules = FIELD_RULES[name];
  if (!rules) return null;
  for (const rule of rules) {
    const err = rule(value);
    if (err) return err;
  }
  return null;
}

function showFieldError(name, message) {
  const input = document.getElementById(`field-${name}`);
  const errEl = document.getElementById(`err-${name}`);
  if (input) input.classList.add('error');
  if (errEl) { errEl.textContent = '⚠ ' + message; errEl.style.display = 'flex'; }
}

function clearFieldError(name) {
  const input = document.getElementById(`field-${name}`);
  const errEl = document.getElementById(`err-${name}`);
  if (input) input.classList.remove('error');
  if (errEl) { errEl.textContent = ''; errEl.style.display = 'none'; }
}

// ─── Form Renderer ──────────────────────────────────────────────────────────

function renderReportForm(editData = null) {
  const isEdit = !!editData;
  const d = editData || {};
  const root = document.getElementById('app-root');

  root.innerHTML = `
    <div class="view-enter">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <span class="breadcrumb-link" id="breadcrumb-home" role="button" tabindex="0">Dashboard</span>
        <span class="breadcrumb-sep">›</span>
        <span>${isEdit ? 'Edit Report' : 'New Report'}</span>
      </nav>

      <div class="form-page-header">
        <h1>${isEdit ? '✏️ Edit Fraud Report' : '🚨 Report a Fraud Incident'}</h1>
        <p>${isEdit ? 'Update the details of this fraud report.' : 'Fill in the details below to submit a new fraud report. Fields marked with * are required.'}</p>
      </div>

      <form id="report-form" class="form-card" novalidate>

        <!-- Section 1: Reporter Info -->
        <div class="form-section">
          <div class="form-section-title">
            <span class="form-section-icon">👤</span> Reporter Information
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label" for="field-reporterName">Full Name <span class="required">*</span></label>
              <input type="text" id="field-reporterName" name="reporterName" class="form-input"
                placeholder="e.g. Priya Sharma" value="${escHtml(d.reporterName || '')}" autocomplete="name" />
              <span class="field-error" id="err-reporterName" style="display:none;"></span>
            </div>
            <div class="form-group">
              <label class="form-label" for="field-email">Email Address <span class="required">*</span></label>
              <input type="email" id="field-email" name="email" class="form-input"
                placeholder="e.g. priya@example.com" value="${escHtml(d.email || '')}" autocomplete="email" />
              <span class="field-error" id="err-email" style="display:none;"></span>
            </div>
            <div class="form-group">
              <label class="form-label" for="field-phone">Mobile Number <span class="required">*</span></label>
              <input type="tel" id="field-phone" name="phone" class="form-input"
                placeholder="e.g. 9876543210" value="${escHtml(d.phone || '')}" autocomplete="tel" maxlength="10" />
              <span class="field-error" id="err-phone" style="display:none;"></span>
            </div>
          </div>
        </div>

        <!-- Section 2: Incident Info -->
        <div class="form-section">
          <div class="form-section-title">
            <span class="form-section-icon">⚡</span> Incident Details
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label" for="field-incidentDate">Incident Date <span class="required">*</span></label>
              <input type="date" id="field-incidentDate" name="incidentDate" class="form-input"
                value="${d.incidentDate || ''}" max="${new Date().toISOString().split('T')[0]}" />
              <span class="field-error" id="err-incidentDate" style="display:none;"></span>
            </div>
            <div class="form-group">
              <label class="form-label" for="field-incidentType">Type of Incident <span class="required">*</span></label>
              <select id="field-incidentType" name="incidentType" class="form-select">
                <option value="" disabled ${!d.incidentType ? 'selected' : ''}>Select type…</option>
                <option value="phishing"               ${d.incidentType === 'phishing'               ? 'selected' : ''}>Phishing / Fake Link</option>
                <option value="fake_call"              ${d.incidentType === 'fake_call'              ? 'selected' : ''}>Fake Customer Care Call</option>
                <option value="unauthorized_transaction" ${d.incidentType === 'unauthorized_transaction' ? 'selected' : ''}>Unauthorized Transaction</option>
                <option value="fake_qr"                ${d.incidentType === 'fake_qr'                ? 'selected' : ''}>Fake QR Code</option>
                <option value="other"                  ${d.incidentType === 'other'                  ? 'selected' : ''}>Other</option>
              </select>
              <span class="field-error" id="err-incidentType" style="display:none;"></span>
            </div>
            <div class="form-group">
              <label class="form-label" for="field-amountLost">Amount Lost (₹) <span class="required">*</span></label>
              <input type="number" id="field-amountLost" name="amountLost" class="form-input"
                placeholder="e.g. 5000" value="${d.amountLost !== undefined ? d.amountLost : ''}" min="0" step="1" />
              <span class="field-error" id="err-amountLost" style="display:none;"></span>
            </div>
            <div class="form-group">
              <label class="form-label" for="field-bankName">Bank / Payment App</label>
              <input type="text" id="field-bankName" name="bankName" class="form-input"
                placeholder="e.g. HDFC Bank, Google Pay" value="${escHtml(d.bankName || '')}" />
            </div>
            <div class="form-group">
              <label class="form-label" for="field-upiId">Fraudulent UPI ID</label>
              <input type="text" id="field-upiId" name="upiId" class="form-input"
                placeholder="e.g. fraud123@paytm" value="${escHtml(d.upiId || '')}" />
            </div>
            <div class="form-group">
              <label class="form-label" for="field-transactionId">Transaction ID / Reference</label>
              <input type="text" id="field-transactionId" name="transactionId" class="form-input"
                placeholder="e.g. TXN20260810123456" value="${escHtml(d.transactionId || '')}" />
            </div>
          </div>
        </div>

        <!-- Section 3: Description -->
        <div class="form-section">
          <div class="form-section-title">
            <span class="form-section-icon">📝</span> Incident Description
          </div>
          <div class="form-group full-width">
            <label class="form-label" for="field-description">Describe what happened <span class="required">*</span></label>
            <textarea id="field-description" name="description" class="form-textarea"
              placeholder="Provide a detailed account of the incident — how it started, what happened, and any other relevant details…"
              rows="5">${escHtml(d.description || '')}</textarea>
            <span class="field-error" id="err-description" style="display:none;"></span>
          </div>
        </div>

        ${isEdit ? `
        <!-- Section 4: Status (Edit only) -->
        <div class="form-section">
          <div class="form-section-title">
            <span class="form-section-icon">🔄</span> Report Status
          </div>
          <div class="form-group" style="max-width:260px;">
            <label class="form-label" for="field-status">Current Status</label>
            <select id="field-status" name="status" class="form-select">
              <option value="pending"        ${d.status === 'pending'        ? 'selected' : ''}>⏳ Pending</option>
              <option value="under_review"   ${d.status === 'under_review'   ? 'selected' : ''}>🔍 Under Review</option>
              <option value="resolved"       ${d.status === 'resolved'       ? 'selected' : ''}>✅ Resolved</option>
              <option value="rejected"       ${d.status === 'rejected'       ? 'selected' : ''}>❌ Rejected</option>
            </select>
          </div>
        </div>
        ` : ''}

        <!-- Footer -->
        <div class="form-footer">
          <button type="button" class="btn btn-outline" id="form-cancel-btn">Cancel</button>
          <button type="submit" class="btn btn-primary" id="form-submit-btn">
            ${isEdit ? '💾 Save Changes' : '🚀 Submit Report'}
          </button>
        </div>
      </form>
    </div>
  `;

  // Breadcrumb
  const breadcrumb = document.getElementById('breadcrumb-home');
  breadcrumb.addEventListener('click', () => App.navigate('home'));
  breadcrumb.addEventListener('keydown', (e) => { if (e.key === 'Enter') App.navigate('home'); });

  // Cancel button
  document.getElementById('form-cancel-btn').addEventListener('click', () => App.navigate('home'));

  // Live validation on blur
  const validatedFields = Object.keys(FIELD_RULES);
  validatedFields.forEach(name => {
    const input = document.getElementById(`field-${name}`);
    if (!input) return;
    input.addEventListener('blur', () => {
      const err = validateField(name, input.value);
      if (err) showFieldError(name, err);
      else clearFieldError(name);
    });
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        const err = validateField(name, input.value);
        if (!err) clearFieldError(name);
      }
    });
  });

  // Form submit
  document.getElementById('report-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('form-submit-btn');

    // Validate all fields
    let hasErrors = false;
    validatedFields.forEach(name => {
      const input = document.getElementById(`field-${name}`);
      if (!input) return;
      const err = validateField(name, input.value);
      if (err) { showFieldError(name, err); hasErrors = true; }
      else clearFieldError(name);
    });

    if (hasErrors) {
      Toast.error('Validation Failed', 'Please fix the errors highlighted in the form.');
      // Scroll to first error
      const firstError = document.querySelector('.form-input.error, .form-select.error, .form-textarea.error');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Collect payload
    const payload = {
      reporterName:  document.getElementById('field-reporterName').value.trim(),
      email:         document.getElementById('field-email').value.trim(),
      phone:         document.getElementById('field-phone').value.trim(),
      incidentDate:  document.getElementById('field-incidentDate').value,
      incidentType:  document.getElementById('field-incidentType').value,
      amountLost:    Number(document.getElementById('field-amountLost').value),
      bankName:      document.getElementById('field-bankName').value.trim(),
      upiId:         document.getElementById('field-upiId').value.trim(),
      transactionId: document.getElementById('field-transactionId').value.trim(),
      description:   document.getElementById('field-description').value.trim(),
    };

    if (isEdit) {
      payload.status = document.getElementById('field-status').value;
    }

    // Submit
    submitBtn.disabled = true;
    submitBtn.textContent = isEdit ? '⏳ Saving…' : '⏳ Submitting…';

    try {
      if (isEdit) {
        await Api.updateReport(d.id, payload);
        Toast.success('Report Updated', 'The fraud report has been updated successfully.');
        App.navigate('report-detail', d.id);
      } else {
        const res = await Api.createReport(payload);
        Toast.success('Report Submitted!', 'Your fraud report has been received. Reference ID: ' + res.data.id.slice(0, 8).toUpperCase());
        App.navigate('home');
      }
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = isEdit ? '💾 Save Changes' : '🚀 Submit Report';

      if (err.errors && err.errors.length > 0) {
        Toast.error('Validation Error', err.errors.join(' '));
      } else {
        Toast.error('Submission Failed', err.message || 'Please try again.');
      }
    }
  });
}

function escHtml(str) {
  if (!str && str !== 0) return '';
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}
