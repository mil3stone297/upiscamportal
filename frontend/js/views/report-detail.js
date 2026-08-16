/**
 * Report Detail View — Show full info for a single fraud report
 */

async function renderReportDetail(id) {
  const root = document.getElementById('app-root');

  // Loading state
  root.innerHTML = `
    <div class="view-enter">
      <div class="loading-container">
        <div class="spinner"></div>
        <p class="loading-text">Loading report…</p>
      </div>
    </div>
  `;

  let report;
  try {
    const res = await Api.getReport(id);
    report = res.data;
  } catch (err) {
    root.innerHTML = `
      <div class="view-enter">
        <nav class="breadcrumb">
          <span class="breadcrumb-link" id="bc-home" role="button" tabindex="0">Dashboard</span>
          <span class="breadcrumb-sep">›</span>
          <span>Report Not Found</span>
        </nav>
        <div class="empty-state">
          <div class="empty-state-icon">🚫</div>
          <h1 class="empty-state-title">Report Not Found</h1>
          <p class="empty-state-sub">${err.message}</p>
          <button class="btn btn-outline" id="back-btn">← Back to Dashboard</button>
        </div>
      </div>
    `;
    document.getElementById('bc-home')?.addEventListener('click', () => App.navigate('home'));
    document.getElementById('back-btn')?.addEventListener('click', () => App.navigate('home'));
    return;
  }

  const statusLabels = { pending: 'Pending', under_review: 'Under Review', resolved: 'Resolved', rejected: 'Rejected' };
  const typeLabels   = { phishing: 'Phishing / Fake Link', fake_call: 'Fake Customer Care Call', unauthorized_transaction: 'Unauthorized Transaction', fake_qr: 'Fake QR Code', other: 'Other' };

  root.innerHTML = `
    <div class="view-enter">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <span class="breadcrumb-link" id="bc-home" role="button" tabindex="0">Dashboard</span>
        <span class="breadcrumb-sep">›</span>
        <span>Report #${report.id.slice(0, 8).toUpperCase()}</span>
      </nav>

      <div class="detail-header">
        <div class="detail-header-left">
          <h1>Fraud Report Details</h1>
          <div class="detail-meta">
            <span>${statusBadgeDetail(report.status)}</span>
            <span>·</span>
            <span>Submitted ${formatDateDetail(report.createdAt)}</span>
            ${report.updatedAt !== report.createdAt
              ? `<span>·</span><span>Updated ${formatDateDetail(report.updatedAt)}</span>`
              : ''
            }
          </div>
        </div>
        <div class="detail-header-actions">
          <button class="btn btn-outline" id="detail-edit-btn">✏️ Edit Report</button>
          <button class="btn btn-danger" id="detail-delete-btn">🗑️ Delete</button>
        </div>
      </div>

      <div class="detail-grid">
        <!-- Left column -->
        <div style="display:flex;flex-direction:column;gap:var(--space-6);">
          
          <!-- Reporter Info -->
          <div class="detail-card">
            <div class="detail-card-header">👤 Reporter Information</div>
            <div class="detail-card-body">
              <div class="detail-field">
                <span class="detail-field-label">Full Name</span>
                <span class="detail-field-value font-bold">${esc(report.reporterName)}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field-label">Email Address</span>
                <span class="detail-field-value">
                  <a href="mailto:${esc(report.email)}" style="color:var(--color-primary-light);">${esc(report.email)}</a>
                </span>
              </div>
              <div class="detail-field">
                <span class="detail-field-label">Mobile Number</span>
                <span class="detail-field-value">${esc(report.phone)}</span>
              </div>
            </div>
          </div>

          <!-- Incident Details -->
          <div class="detail-card">
            <div class="detail-card-header">⚡ Incident Details</div>
            <div class="detail-card-body">
              <div class="detail-field">
                <span class="detail-field-label">Type of Incident</span>
                <span class="detail-field-value"><span class="type-pill">${typeLabels[report.incidentType] || report.incidentType}</span></span>
              </div>
              <div class="detail-field">
                <span class="detail-field-label">Incident Date</span>
                <span class="detail-field-value">${formatDateDetail(report.incidentDate)}</span>
              </div>
              ${report.bankName ? `
              <div class="detail-field">
                <span class="detail-field-label">Bank / Payment App</span>
                <span class="detail-field-value">${esc(report.bankName)}</span>
              </div>` : ''}
              ${report.upiId ? `
              <div class="detail-field">
                <span class="detail-field-label">Fraudulent UPI ID</span>
                <span class="detail-field-value" style="color:var(--color-error);font-family:monospace;">${esc(report.upiId)}</span>
              </div>` : ''}
              ${report.transactionId ? `
              <div class="detail-field">
                <span class="detail-field-label">Transaction ID</span>
                <span class="detail-field-value" style="font-family:monospace;font-size:0.8rem;">${esc(report.transactionId)}</span>
              </div>` : ''}
            </div>
          </div>

          <!-- Description -->
          <div class="detail-card">
            <div class="detail-card-header">📝 Incident Description</div>
            <div class="detail-card-body">
              <p class="detail-description">${esc(report.description)}</p>
            </div>
          </div>
        </div>

        <!-- Right column: Summary -->
        <div style="display:flex;flex-direction:column;gap:var(--space-6);">
          
          <!-- Amount Card -->
          <div class="detail-card">
            <div class="detail-card-header">💸 Financial Impact</div>
            <div class="detail-card-body">
              <div class="detail-field" style="border:none;padding:0;">
                <span class="detail-field-label">Amount Lost</span>
                <span class="detail-field-value amount">${formatCurrencyDetail(report.amountLost)}</span>
              </div>
            </div>
          </div>

          <!-- Status Card -->
          <div class="detail-card">
            <div class="detail-card-header">🔄 Report Status</div>
            <div class="detail-card-body">
              <div class="detail-field">
                <span class="detail-field-label">Current Status</span>
                <span class="detail-field-value">${statusBadgeDetail(report.status)}</span>
              </div>
              <div class="status-update-section">
                <p class="detail-field-label" style="margin-bottom:var(--space-3);">Quick Status Update</p>
                <div class="status-select-group">
                  <select id="quick-status-select" class="filter-select" style="flex:1;" aria-label="Change report status">
                    <option value="pending"        ${report.status === 'pending'        ? 'selected' : ''}>⏳ Pending</option>
                    <option value="under_review"   ${report.status === 'under_review'   ? 'selected' : ''}>🔍 Under Review</option>
                    <option value="resolved"       ${report.status === 'resolved'       ? 'selected' : ''}>✅ Resolved</option>
                    <option value="rejected"       ${report.status === 'rejected'       ? 'selected' : ''}>❌ Rejected</option>
                  </select>
                  <button class="btn btn-outline btn-sm" id="update-status-btn">Save</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Meta Card -->
          <div class="detail-card">
            <div class="detail-card-header">🪪 Report Meta</div>
            <div class="detail-card-body">
              <div class="detail-field">
                <span class="detail-field-label">Report ID</span>
                <span class="detail-field-value" style="font-family:monospace;font-size:0.75rem;">${report.id}</span>
              </div>
              <div class="detail-field">
                <span class="detail-field-label">Created At</span>
                <span class="detail-field-value">${formatDateDetail(report.createdAt)}</span>
              </div>
              <div class="detail-field" style="border:none;padding-bottom:0;">
                <span class="detail-field-label">Last Updated</span>
                <span class="detail-field-value">${formatDateDetail(report.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Breadcrumb
  document.getElementById('bc-home')?.addEventListener('click', () => App.navigate('home'));

  // Edit button
  document.getElementById('detail-edit-btn').addEventListener('click', () => App.navigate('edit-report', id));

  // Delete button
  document.getElementById('detail-delete-btn').addEventListener('click', async () => {
    const confirmed = await Modal.open(`Delete report #${report.id.slice(0, 8).toUpperCase()}? This cannot be undone.`);
    if (!confirmed) return;
    try {
      await Api.deleteReport(id);
      Toast.success('Report Deleted', 'The fraud report has been removed.');
      App.navigate('home');
    } catch (err) {
      Toast.error('Delete Failed', err.message);
    }
  });

  // Quick status update
  document.getElementById('update-status-btn').addEventListener('click', async () => {
    const newStatus = document.getElementById('quick-status-select').value;
    const btn = document.getElementById('update-status-btn');
    btn.disabled = true;
    btn.textContent = '…';
    try {
      await Api.updateReport(id, { status: newStatus });
      Toast.success('Status Updated', 'Report status has been changed successfully.');
      // Re-render detail with fresh data
      await renderReportDetail(id);
    } catch (err) {
      btn.disabled = false;
      btn.textContent = 'Save';
      Toast.error('Update Failed', err.message);
    }
  });
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatCurrencyDetail(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

function formatDateDetail(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-IN', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function statusBadgeDetail(status) {
  const labels = { pending: 'Pending', under_review: 'Under Review', resolved: 'Resolved', rejected: 'Rejected' };
  return `<span class="badge badge-${status}"><span class="badge-dot"></span>${labels[status] || status}</span>`;
}

function esc(str) {
  const div = document.createElement('div');
  div.textContent = str || '—';
  return div.innerHTML;
}
