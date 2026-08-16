/**
 * Confirmation modal component
 */
const Modal = (() => {
  const overlay = document.getElementById('modal-overlay');
  const cancelBtn = document.getElementById('modal-cancel-btn');
  const confirmBtn = document.getElementById('modal-confirm-btn');
  const messageEl = document.getElementById('modal-message');

  let _resolve = null;

  function open(message = 'Are you sure? This action cannot be undone.') {
    messageEl.textContent = message;
    overlay.classList.add('active');

    return new Promise((resolve) => {
      _resolve = resolve;
    });
  }

  function close(result) {
    overlay.classList.remove('active');
    if (_resolve) {
      _resolve(result);
      _resolve = null;
    }
  }

  cancelBtn.addEventListener('click', () => close(false));
  confirmBtn.addEventListener('click', () => close(true));

  // Close on backdrop click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close(false);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) close(false);
  });

  return { open };
})();
