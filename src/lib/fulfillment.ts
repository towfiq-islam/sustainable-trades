export const fulfillmentMap: Record<string, string[]> = {
  pickup: ["pickup"],
  delivery: ["delivery"],
  shipping: ["shipping"],

  pickup_and_delivery: ["pickup", "delivery"],

  pickup_and_shipping: ["pickup", "shipping"],

  delivery_and_shipping: ["delivery", "shipping"],

  pickup_and_delivery_and_shipping: ["pickup", "delivery", "shipping"],
};

export type Fulfillment = "pickup" | "delivery" | "shipping";

export const fulfillmentLabel: Record<Fulfillment, string> = {
  pickup: "Arrange local pickup",
  delivery: "Local delivery",
  shipping: "Shipping",
};

export const fulfillmentDescription: Record<Fulfillment, string> = {
  pickup: "Pick up from the seller",
  delivery: "Delivered by the seller",
  shipping: "Delivered by carrier",
};

/**
 * A vendor can only pick ONE fulfillment method to cover their entire order,
 * so the customer must only be offered methods common to every product from
 * that vendor — the INTERSECTION of each product's `fulfillment` array, not
 * the union.
 *
 * Examples:
 *   [["pickup","shipping"], ["pickup"]]                -> ["pickup"]
 *   [["delivery","shipping"], ["shipping"]]             -> ["shipping"]
 *   [["pickup"], ["delivery"]]                          -> []  (no overlap)
 */
export const getVendorFulfillmentOptions = (
  products: { fulfillment: Fulfillment[] }[],
): Fulfillment[] => {
  if (!products.length) return [];

  return products.reduce<Fulfillment[]>(
    (common, product) => common.filter(f => product.fulfillment.includes(f)),
    products[0].fulfillment,
  );
};

/**
 * Convenience wrapper used by the fulfillment step to decide, per vendor:
 * - "auto"    -> exactly one common option, pre-select it, no user choice needed
 * - "choose"  -> multiple common options, customer must pick one
 * - "blocked" -> zero common options, customer must remove a product
 */
export type VendorFulfillmentStatus =
  | { status: "auto"; options: [Fulfillment] }
  | { status: "choose"; options: Fulfillment[] }
  | { status: "blocked"; options: [] };

export const getVendorFulfillmentStatus = (
  products: { fulfillment: Fulfillment[] }[],
): VendorFulfillmentStatus => {
  const options = getVendorFulfillmentOptions(products);

  if (options.length === 0) return { status: "blocked", options: [] };
  if (options.length === 1)
    return { status: "auto", options: options as [Fulfillment] };
  return { status: "choose", options };
};
