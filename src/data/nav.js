/**
 * Single source of truth for the primary navigation.
 * Used by both the desktop dropdown menu and the mobile drawer so the two can
 * never drift apart (they were hand-duplicated in every HTML page before).
 *
 * `hint` is a short plain description shown under a child label, so the
 * programme names ("Sprouting Sessions" etc.) say what they are.
 *
 * @typedef {{ href: string, label: string, children?: { href: string, label: string, hint?: string }[] }} NavItem
 * @type {NavItem[]}
 */
export const navItems = [
  {
    href: '/pages/the-garden',
    label: 'The Garden',
    children: [
      { href: '/pages/the-garden#our-story', label: 'Our Story' },
      { href: '/pages/the-garden#our-gardeners', label: 'Our Gardeners' },
      { href: '/pages/the-garden#is-this-for-you', label: 'Is This For Me?' },
    ],
  },
  {
    href: '/pages/classes',
    label: 'Classes',
    children: [
      { href: '/pages/enter-the-garden', label: 'Enter the Garden', hint: 'Free intro class' },
      { href: '/pages/beginner-course', label: 'Sprouting Sessions', hint: 'Beginner course' },
      { href: '/pages/growth-sessions', label: 'Growth Sessions', hint: 'Improvers course' },
      { href: '/pages/garden-practica', label: 'Garden Practica', hint: 'Guided practica' },
      { href: '/pages/private-classes', label: 'Private Classes' },
      { href: '/pages/gift-cards', label: 'Gift Cards', hint: 'Give someone tango' },
    ],
  },
  {
    href: '/pages/training-material',
    label: 'Training Material',
    children: [
      { href: '/pages/tango-rhythm-trainer', label: 'Tango Rhythm Trainer' },
      { href: '/pages/tango-vals-rhythm-trainer', label: 'Vals Rhythm Trainer' },
      { href: '/pages/milonga-rhythm-trainer', label: 'Milonga Rhythm Trainer' },
    ],
  },
  { href: '/pages/contact', label: 'Connect with us' },
];

export const social = {
  facebook: 'https://www.facebook.com/tangogardencologne/',
  instagram: 'https://www.instagram.com/tangogardencologne',
  whatsapp: 'https://wa.me/491602368723',
};
