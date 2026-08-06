// TODO: swap for real tax/shipping API once order endpoint is ready
export const TAX_RATE = 0.08;
export const FLAT_SHIPPING_FEE = 5;

export const calcVendorSubtotal = (
  products: { price: number; quantity: number }[],
) => products.reduce((sum, p) => sum + p.price * p.quantity, 0);

export const calcVendorTax = (subtotal: number) => subtotal * TAX_RATE;

export const calcVendorShipping = (fulfillment?: string) =>
  fulfillment === "shipping" ? FLAT_SHIPPING_FEE : 0;
