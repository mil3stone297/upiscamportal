/**
 * API client — all fetch calls to the backend
 */
const API_BASE = '/api';

const Api = {
  async request(method, path, body = null) {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(`${API_BASE}${path}`, options);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const err = new Error(data.message || 'An error occurred.');
      err.status = res.status;
      err.errors = data.errors || [];
      throw err;
    }
    return data;
  },

  // ─── Reports ──────────────────────────────────────────────────
  getReports(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request('GET', `/reports${qs ? '?' + qs : ''}`);
  },

  getReport(id) {
    return this.request('GET', `/reports/${id}`);
  },

  createReport(payload) {
    return this.request('POST', '/reports', payload);
  },

  updateReport(id, payload) {
    return this.request('PUT', `/reports/${id}`, payload);
  },

  deleteReport(id) {
    return this.request('DELETE', `/reports/${id}`);
  },
};
