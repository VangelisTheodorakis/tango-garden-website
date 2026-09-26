// Contact-page FAQ accordion, shared by /pages/contact and /de/pages/contact.
// In the pre-Astro HTML this lived in the same <script> tag as the nav drawer
// IIFE, so the migration dropped it along with the nav code — leaving every
// answer permanently collapsed.
for (const btn of document.querySelectorAll<HTMLButtonElement>('.faq-question')) {
  // The markup ships without these, so a screen reader would announce a
  // plain button with no hint that it expands anything.
  btn.setAttribute('aria-expanded', 'false');

  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    if (!item) return;
    const wasOpen = item.classList.contains('is-open');

    for (const open of document.querySelectorAll('.faq-item.is-open')) {
      open.classList.remove('is-open');
      open.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
    }

    if (!wasOpen) {
      item.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      if (typeof window.gtag === 'function') {
        // German questions carry the English wording as data-faq-key, so both
        // languages report under one faq_question value.
        const question = btn.dataset.faqKey ?? btn.textContent?.trim();
        window.gtag('event', 'faq_expand', { faq_question: question });
      }
    }
  });
}
