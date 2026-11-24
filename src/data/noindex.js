/**
 * Routes that must not be indexed.
 *
 * These pages set `noindex` on their BaseLayout; this list is what keeps them
 * out of the sitemap too, so the two signals agree. The build test
 * "never lists a noindexed page in the sitemap" fails if they drift apart.
 *
 * Legal boilerplate is deliberately kept out of search results — it is linked
 * from the footer for humans, but has no business ranking for the studio.
 */
export const noindexRoutes = [
  '/pages/impressum/',
  '/pages/privacy-policy/',
  '/pages/terms-of-service/',
  '/pages/refund-and-cancellation-policy/',
  // Gift card QR landing page: for card holders, not for search.
  '/pages/you-ve-got-tango/',
  // Personal advent card for one student: not for search.
  '/pages/for-my-jini/',
  // Private team dashboard, behind Cloudflare Access.
  '/gardeners-area/',
];
