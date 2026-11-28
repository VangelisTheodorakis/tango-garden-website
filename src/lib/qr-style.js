/**
 * QR codes in the Tango Garden gift-card style: olive rounded dots and
 * rounded-square eyes with a solid circle inside. Generated locally (no QR
 * service). Dots fill 80% of a module: 73% like the printed gift card looked
 * the same but decoded less reliably in tests.
 */
import QRCode from 'qrcode';

export const QR_COLOR = '#576D1F';
const MARGIN = 3;
const DOT = 0.8;

/** @returns {string} a standalone SVG document */
export function qrSvg(text, { size = 1024 } = {}) {
  const qr = QRCode.create(text, { errorCorrectionLevel: 'M' });
  const n = qr.modules.size;
  const inEye = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
  const off = (1 - DOT) / 2;
  let shapes = '';
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (!qr.modules.get(r, c) || inEye(r, c)) continue;
      shapes += `<rect x="${(c + MARGIN + off).toFixed(2)}" y="${(r + MARGIN + off).toFixed(2)}" width="${DOT}" height="${DOT}" rx="0.14"/>`;
    }
  }
  for (const [r, c] of [[0, 0], [0, n - 7], [n - 7, 0]]) {
    const x = c + MARGIN;
    const y = r + MARGIN;
    shapes += `<rect x="${x + 0.5}" y="${y + 0.5}" width="6" height="6" rx="1.6" fill="none" stroke="${QR_COLOR}" stroke-width="1"/>`;
    shapes += `<circle cx="${x + 3.5}" cy="${y + 3.5}" r="1.5"/>`;
  }
  const total = n + MARGIN * 2;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="${size}" height="${size}">` +
    `<rect width="${total}" height="${total}" fill="#fff"/><g fill="${QR_COLOR}">${shapes}</g></svg>`
  );
}
