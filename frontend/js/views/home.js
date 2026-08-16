/**
 * Home View — Dashboard with stats and filterable report list
 */

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function statusBadge(status) {
  const labels = {
    pending: 'Pending',
    under_review: 'Under Review',
    resolved: 'Resolved',
    rejected: 'Rejected',
  };
  return `<span class="badge badge-${status}"><span class="badge-dot"></span>${labels[status] || status}</span>`;
}

function incidentTypeLabel(type) {
  const labels = {
    phishing: 'Phishing',
    fake_call: 'Fake Call',
    unauthorized_transaction: 'Unauthorized',
    fake_qr: 'Fake QR',
    other: 'Other',
  };
  return labels[type] || type;
}

// ─── Home View Renderer ────────────────────────────────────────────────────

function renderHomeView() {
  const root = document.getElementById('app-root');
  root.innerHTML = `
    <div class="view-enter">
      <!-- Hero -->
      <div class="hero">
        <div class="hero-badge">
          <span class="hero-badge-dot"></span>
          Digital Payment Safety Initiative
        </div>
        <h1 class="hero-title">
          Report & Track<br/>
          <span class="hero-title-gradient">UPI Fraud Incidents</span>
        </h1>
        <p class="hero-subtitle">
          Help protect India's digital payment ecosystem. Report suspicious transactions, 
          phishing attempts, and fake payment requests instantly.
        </p>
        <div class="hero-cta">
          <button class="btn btn-primary btn-lg" id="hero-report-btn">🚨 Report a Fraud</button>
          <button class="btn btn-outline btn-lg" id="hero-view-btn">📋 View All Reports</button>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-grid" id="stats-grid">
        <div class="stat-card" style="--stat-accent: #8b5cf6;">
          <span class="stat-icon">📋</span>
          <span class="stat-value" id="stat-total">—</span>
          <span class="stat-label">Total Reports</span>
        </div>
        <div class="stat-card" style="--stat-accent: #f59e0b;">
          <span class="stat-icon">⏳</span>
          <span class="stat-value" id="stat-pending">—</span>
          <span class="stat-label">Pending</span>
        </div>
        <div class="stat-card" style="--stat-accent: #3b82f6;">
          <span class="stat-icon">🔍</span>
          <span class="stat-value" id="stat-review">—</span>
          <span class="stat-label">Under Review</span>
        </div>
        <div class="stat-card" style="--stat-accent: #10b981;">
          <span class="stat-icon">✅</span>
          <span class="stat-value" id="stat-resolved">—</span>
          <span class="stat-label">Resolved</span>
        </div>
        <div class="stat-card" style="--stat-accent: #ef4444;">
          <span class="stat-icon">💸</span>
          <span class="stat-value" id="stat-amount">—</span>
          <span class="stat-label">Total Amount Reported</span>
        </div>
      </div>

      <!-- Reports Section -->
      <div class="section-header">
        <h2 class="section-title">Fraud Reports</h2>
      </div>

      <!-- Filter Bar -->
      <div class="filter-bar">
        <div class="search-wrapper">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            id="search-input" 
            class="search-input" 
            placeholder="Search by name, UPI ID, transaction ID…"
            aria-label="Search reports"
          />
        </div>
        <select id="filter-type" class="filter-select" aria-label="Filter by incident type">
          <option value="">All Types</option>
          <option value="phishing">Phishing</option>
          <option value="fake_call">Fake Call</option>
          <option value="unauthorized_transaction">Unauthorized Transaction</option>
          <option value="fake_qr">Fake QR Code</option>
          <option value="other">Other</option>
        </select>
        <select id="filter-status" class="filter-select" aria-label="Filter by status">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under Review</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <!-- Table -->
      <div id="reports-container">
        <div class="loading-container">
          <div class="spinner"></div>
          <p class="loading-text">Loading reports…</p>
        </div>
      </div>
    </div>
  `;

  // Wire up CTA buttons
  document.getElementById('hero-report-btn').addEventListener('click', () => App.navigate('new-report'));
  document.getElementById('hero-view-btn').addEventListener('click', () => {
    document.getElementById('reports-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Load data
  loadReports();

  // Search & filter with debounce
  let debounceTimer;
  const debounce = (fn) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fn, 320);
  };

  document.getElementById('search-input').addEventListener('input', () => debounce(loadReports));
  document.getElementById('filter-type').addEventListener('change', loadReports);
  document.getElementById('filter-status').addEventListener('change', loadReports);
}

async function loadReports() {
  const search  = document.getElementById('search-input')?.value || '';
  const type    = document.getElementById('filter-type')?.value || '';
  const status  = document.getElementById('filter-status')?.value || '';

  const params = {};
  if (search) params.search = search;
  if (type)   params.type   = type;
  if (status) params.status = status;

  try {
    const { data: reports } = await Api.getReports(params);
    updateStats(reports);
    renderReportsTable(reports);
  } catch (err) {
    document.getElementById('reports-container').innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <h3 class="empty-state-title">Could not load reports</h3>
        <p class="empty-state-sub">${err.message}</p>
        <button class="btn btn-outline" onclick="loadReports()">Retry</button>
      </div>
    `;
  }
}

function updateStats(reports) {
  const total    = reports.length;
  const pending  = reports.filter(r => r.status === 'pending').length;
  const review   = reports.filter(r => r.status === 'under_review').length;
  const resolved = reports.filter(r => r.status === 'resolved').length;
  const amount   = reports.reduce((sum, r) => sum + (r.amountLost || 0), 0);

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('stat-total',    total);
  set('stat-pending',  pending);
  set('stat-review',   review);
  set('stat-resolved', resolved);
  set('stat-amount',   formatCurrency(amount));
}

function renderReportsTable(reports) {
  const container = document.getElementById('reports-container');

  if (!reports || reports.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <h3 class="empty-state-title">No reports found</h3>
        <p class="empty-state-sub">No fraud reports match your current filters.</p>
        <button class="btn btn-primary" id="empty-new-btn">+ Submit First Report</button>
      </div>
    `;
    document.getElementById('empty-new-btn')?.addEventListener('click', () => App.navigate('new-report'));
    return;
  }

  const rows = reports.map(r => `
    <tr data-id="${r.id}" class="report-row" tabindex="0" title="Click to view details">
      <td>
        <div class="reporter-name">${escHtml(r.reporterName)}</div>
        <div class="reporter-email">${escHtml(r.email)}</div>
      </td>
      <td><span class="type-pill">${incidentTypeLabel(r.incidentType)}</span></td>
      <td class="amount-cell">${formatCurrency(r.amountLost)}</td>
      <td class="date-cell">${formatDate(r.incidentDate)}</td>
      <td>${statusBadge(r.status)}</td>
      <td class="action-btns" onclick="event.stopPropagation()">
        <button class="btn btn-outline btn-sm" data-action="view" data-id="${r.id}" title="View report">👁 View</button>
        <button class="btn btn-ghost btn-sm" data-action="edit" data-id="${r.id}" title="Edit report">✏️</button>
        <button class="btn btn-ghost btn-sm text-error" data-action="delete" data-id="${r.id}" title="Delete report">🗑️</button>
      </td>
    </tr>
  `).join('');

  container.innerHTML = `
    <div class="reports-table-wrapper">
      <table class="reports-table" role="table" aria-label="Fraud reports list">
        <thead>
          <tr>
            <th scope="col">Reporter</th>
            <th scope="col">Type</th>
            <th scope="col">Amount</th>
            <th scope="col">Date</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody id="reports-tbody">${rows}</tbody>
      </table>
    </div>
  `;

  // Row click to view detail
  document.querySelectorAll('.report-row').forEach(row => {
    row.addEventListener('click', () => App.navigate('report-detail', row.dataset.id));
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') App.navigate('report-detail', row.dataset.id);
    });
  });

  // Action buttons
  container.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const { action, id } = btn.dataset;
      if (action === 'view')   App.navigate('report-detail', id);
      if (action === 'edit')   App.navigate('edit-report', id);
      if (action === 'delete') await handleDelete(id);
    });
  });
}

async function handleDelete(id) {
  const confirmed = await Modal.open('Are you sure you want to delete this fraud report? This action cannot be undone.');
  if (!confirmed) return;
  try {
    await Api.deleteReport(id);
    Toast.success('Report Deleted', 'The fraud report has been removed successfully.');
    await loadReports();
  } catch (err) {
    Toast.error('Delete Failed', err.message);
  }
}

function escHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}
