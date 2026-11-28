// Flip for personal cards (/card/<slug> and the editor preview). Delegated, so
// cards drawn later (the editor re-renders its preview) flip too. Opening a
// card once reveals its details link for good.
document.addEventListener('click', (event) => {
  const card = event.target instanceof Element ? event.target.closest('.tgc-card') : null;
  if (!card) return;
  const open = card.getAttribute('aria-pressed') !== 'true';
  card.setAttribute('aria-pressed', String(open));
  card.setAttribute('aria-label', open ? 'Close the card' : 'Open the card');
  card.querySelector('.tgc-front')?.setAttribute('aria-hidden', String(open));
  card.querySelector('.tgc-back')?.setAttribute('aria-hidden', String(!open));
  const after = card.parentElement?.querySelector('.tgc-after');
  if (open && after) after.hidden = false;
});
