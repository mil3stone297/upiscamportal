/**
 * App Router & Bootstrap
 * Manages navigation between views and wires up global nav buttons.
 */

const App = (() => {
  let _currentView = null;
  let _currentParam = null;

  // ─── Navigation ─────────────────────────────────────────────────────────
  function navigate(view, param = null) {
    _currentView  = view;
    _currentParam = param;
    render();
  }

  function render() {
    switch (_currentView) {
      case 'home':
        renderHomeView();
        break;
      case 'new-report':
        renderReportForm(null);
        break;
      case 'edit-report':
        loadAndRenderEditForm(_currentParam);
        break;
      case 'report-detail':
        renderReportDetail(_currentParam);
        break;
      default:
        renderHomeView();
    }
  }

  async function loadAndRenderEditForm(id) {
    const root = document.getElementById('app-root');
    root.innerHTML = `
      <div class="view-enter">
        <div class="loading-container">
          <div class="spinner"></div>
          <p class="loading-text">Loading report data…</p>
        </div>
      </div>
    `;
    try {
      const res = await Api.getReport(id);
      renderReportForm(res.data);
    } catch (err) {
      Toast.error('Could not load report', err.message);
      navigate('home');
    }
  }

  // ─── Nav button wiring ───────────────────────────────────────────────────
  function initNav() {
    document.getElementById('nav-brand-link').addEventListener('click', (e) => {
      e.preventDefault();
      navigate('home');
    });
    document.getElementById('nav-dashboard-btn').addEventListener('click', () => navigate('home'));
    document.getElementById('nav-report-btn').addEventListener('click', () => navigate('new-report'));
  }

  // ─── Bootstrap ───────────────────────────────────────────────────────────
  function init() {
    initNav();
    navigate('home');
  }

  return { navigate, init };
})();

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
