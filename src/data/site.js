/**
 * Site-wide feature flags.
 */

/**
 * Whether the product pages show their purchase controls — stock, variant
 * picker, quantity stepper and the Add to cart / Buy it now buttons.
 *
 * Off for now: those buttons hand the visitor to the Shopify cart, and the
 * store is not where we want to send people yet. The markup and the checkout
 * script stay in place and hidden, so turning this back to `true` restores a
 * working buy flow with no other change.
 */
export const showPurchaseControls = false;
