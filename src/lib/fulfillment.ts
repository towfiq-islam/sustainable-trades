import { Fulfillment, VendorFulfillmentStatus } from "@/Types";

export type { Fulfillment, VendorFulfillmentStatus };

export const fulfillmentMap: Record<string, Fulfillment[]> = {
  pickup: ["pickup"],
  delivery: ["delivery"],
  shipping: ["shipping"],

  pickup_and_delivery: ["pickup", "delivery"],

  pickup_and_shipping: ["pickup", "shipping"],

  delivery_and_shipping: ["delivery", "shipping"],

  pickup_and_delivery_and_shipping: ["pickup", "delivery", "shipping"],
};

export const normalizeFulfillment = (
  fulfillment?: Fulfillment[] | string,
): Fulfillment[] => {
  if (Array.isArray(fulfillment)) return fulfillment;
  if (typeof fulfillment === "string") return fulfillmentMap[fulfillment] ?? [];
  return [];
};

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
  products: { fulfillment: Fulfillment[] | string }[],
): Fulfillment[] => {
  if (!products.length) return [];

  return products.reduce<Fulfillment[]>(
    (common, product) =>
      common.filter(f => normalizeFulfillment(product.fulfillment).includes(f)),
    normalizeFulfillment(products[0].fulfillment),
  );
};

export const getVendorFulfillmentStatus = (
  products: { fulfillment: Fulfillment[] }[],
): VendorFulfillmentStatus => {
  const options = getVendorFulfillmentOptions(products);

  if (options.length === 0) return { status: "blocked", options: [] };
  if (options.length === 1)
    return { status: "auto", options: options as [Fulfillment] };
  return { status: "choose", options };
};
