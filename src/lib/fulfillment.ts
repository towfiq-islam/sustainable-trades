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
  pickup: "Arrange Local Pickup",
  delivery: "Local Delivery",
  shipping: "Shipping",
};
