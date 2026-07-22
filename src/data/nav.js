/**
 * Single source of truth for the primary navigation.
 * Used by both the desktop dropdown menu and the mobile drawer so the two can
 * never drift apart (they were hand-duplicated in every HTML page before).
 *
 * @typedef {{ href: string, label: string, children?: { href: string, label: string }[] }} NavItem
 * @type {NavItem[]}
 */
export const navItems = [
  {
    href: '/pages/the-garden',
    label: 'The Garden',
    children: [
      { href: '/pages/the-garden#our-story', label: 'Our Story' },
      { href: '/pages/the-garden#our-gardeners', label: 'Our Gardeners' },
    ],
  },
  {
    href: '/pages/start-here',
    label: 'Start Here',
    children: [
      { href: '/pages/start-here#three-ways-to-enter', label: 'Three Ways to Enter the Garden' },
      { href: '/pages/start-here#is-this-for-you', label: 'Is This For Me?' },
      { href: '/pages/start-here#common-questions', label: 'Common Questions' },
    ],
  },
  {
    href: '/collections/all',
    label: 'Classes',
    children: [
      { href: '/products/enter-the-garden-general-admission', label: 'Enter the Garden' },
      {
        href: '/products/the-sprouting-sessions-beginner-level-full-course-pass-general-admission',
        label: 'Sprouting Sessions',
      },
      {
        href: '/products/the-garden-practica-1-practica-pass-general-admission',
        label: 'Garden Practica',
      },
    ],
  },
  { href: '/pages/contact', label: 'Connect with us' },
];

export const social = {
  facebook: 'https://www.facebook.com/tangogardencologne/',
  instagram: 'https://www.instagram.com/tangogardencologne',
  whatsapp: 'https://wa.me/491602368723',
};
