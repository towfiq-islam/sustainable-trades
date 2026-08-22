export type Fulfillment = "pickup" | "delivery" | "shipping";

export type VendorFulfillmentStatus =
  | { status: "auto"; options: [Fulfillment] }
  | { status: "choose"; options: Fulfillment[] }
  | { status: "blocked"; options: [] };
