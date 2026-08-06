import { CartItem } from "@/redux/slices/cartSlice";
import { Fulfillment } from "@/lib/fulfillment";

// TODO: swap for real tax/shipping API once order endpoint is ready
export const TAX_RATE = 0.08;
export const FLAT_SHIPPING_FEE = 5;

export const calcVendorSubtotal = (
  products: { price: number; quantity: number }[],
) => products.reduce((sum, p) => sum + p.price * p.quantity, 0);

export const calcVendorTax = (subtotal: number) => subtotal * TAX_RATE;

export const calcVendorShipping = (fulfillment?: string) =>
  fulfillment === "shipping" ? FLAT_SHIPPING_FEE : 0;

// Per-vendor form fields collected in VendorDetailsStep,
// keyed as vendors.{vendor_id}.* in the shared FormProvider
export interface VendorFormFields {
  name?: string;
  phone?: string;
  address?: string;
  instructions?: string;
}

export type VendorFormValues = Record<string, VendorFormFields>;

// One line item as sent to the backend
export interface CheckoutProductPayload {
  product_id: number;
  quantity: number;
  unit_price: number;
}

// One vendor sub-order as sent to the backend
export interface CheckoutVendorPayload {
  vendor_id: number;
  shop_id: number;
  fulfillment: Fulfillment;
  contact_name: string | null;
  contact_phone: string | null;
  // only populated for delivery/shipping
  address: string | null;
  // delivery instructions or pickup notes, whichever applies
  instructions: string | null;
  products: CheckoutProductPayload[];
  subtotal: number;
  tax: number;
  shipping: number;
  vendor_total: number;
}

export interface CheckoutPayload {
  vendors: CheckoutVendorPayload[];
  subtotal: number;
  tax_total: number;
  shipping_total: number;
  total: number;
}

// Builds the full /checkout request body from cart items + RHF form values.
// Call this right before POSTing from PaymentStep (or the confirm handler
// on ReviewStep, whichever fires the actual API call).
export const buildCheckoutPayload = (
  items: CartItem[],
  formValues: VendorFormValues,
): CheckoutPayload => {
  const vendors: CheckoutVendorPayload[] = items.map(vendor => {
    const fields = formValues[vendor.vendor_id] || {};
    const fulfillment = vendor.selectedFulfillment as Fulfillment;

    const subtotal = calcVendorSubtotal(vendor.products);
    const tax = calcVendorTax(subtotal);
    const shipping = calcVendorShipping(fulfillment);

    const needsAddress =
      fulfillment === "delivery" || fulfillment === "shipping";

    return {
      vendor_id: vendor.vendor_id,
      shop_id: vendor.shop_id,
      fulfillment,
      contact_name: fields.name ?? null,
      contact_phone: fields.phone ?? null,
      address: needsAddress ? (fields.address ?? null) : null,
      instructions: fields.instructions ?? null,
      products: vendor.products.map(product => ({
        product_id: product.id,
        quantity: product.quantity,
        unit_price: product.price,
      })),
      subtotal: Number(subtotal.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      shipping: Number(shipping.toFixed(2)),
      vendor_total: Number((subtotal + tax + shipping).toFixed(2)),
    };
  });

  const subtotal = vendors.reduce((sum, v) => sum + v.subtotal, 0);
  const tax_total = vendors.reduce((sum, v) => sum + v.tax, 0);
  const shipping_total = vendors.reduce((sum, v) => sum + v.shipping, 0);

  return {
    vendors,
    subtotal: Number(subtotal.toFixed(2)),
    tax_total: Number(tax_total.toFixed(2)),
    shipping_total: Number(shipping_total.toFixed(2)),
    total: Number((subtotal + tax_total + shipping_total).toFixed(2)),
  };
};
