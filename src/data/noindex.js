/**
 * Routes that must not be indexed.
 *
 * These pages set `noindex` on their BaseLayout; this list is what keeps them
 * out of the sitemap too, so the two signals agree. The build test
 * "never lists a noindexed page in the sitemap" fails if they drift apart.
 *
 * Legal boilerplate is deliberately kept out of search results — it is linked
 * from the footer for humans, but has no business ranking for the studio.
 * The German pages are additionally unfinished placeholders.
 */
export const noindexRoutes = [
  '/pages/impressum/',
  '/pages/privacy-policy/',
  '/pages/terms-of-service/',
  '/pages/refund-and-cancellation-policy/',
  '/pages/agb/',
  '/pages/datenschutz/',
  '/pages/widerruf/',
];
