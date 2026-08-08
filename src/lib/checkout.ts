import { CartItem } from "@/redux/slices/cartSlice";
import { Fulfillment } from "@/lib/fulfillment";

// TODO: swap for real tax/shipping API once available
export const TAX_RATE = 0.08;
export const FLAT_SHIPPING_FEE = 5;

export const calcVendorSubtotal = (
  products: { price: number; quantity: number }[],
) => products.reduce((sum, p) => sum + p.price * p.quantity, 0);

export const calcVendorTax = (subtotal: number) => subtotal * TAX_RATE;

export const calcVendorShipping = (fulfillment?: string) =>
  fulfillment === "shipping" ? FLAT_SHIPPING_FEE : 0;

// Matches the fields registered per-vendor in DeliveryDetails.tsx,
// under vendors.{vendor_id}.* in the shared FormProvider
export interface VendorFormFields {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  // only present when fulfillment needs an address (delivery / shipping)
  street_address?: string;
  apt?: string;
  city?: string;
  postal_code?: string;
  state?: string;
  country?: string;
  // only present when fulfillment is pickup
  pickup_id?: string;
}

export type VendorFormValues = Record<string, VendorFormFields>;

export interface CheckoutProductPayload {
  product_id: number;
  quantity: number;
  unit_price: number;
}

// Nested address object — only present when fulfillment is delivery/shipping
export interface CheckoutAddressPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  street_address: string;
  apt: string | null;
  city: string;
  postal_code: string;
  state: string;
  country: string;
}

export interface CheckoutVendorPayload {
  vendor_id: number;
  shop_id: number;
  fulfillment: Fulfillment;

  // present only when fulfillment is delivery/shipping
  address: CheckoutAddressPayload | null;

  // present only when fulfillment is pickup — pickup still needs a name/
  // phone/email to identify the buyer, so those travel alongside pickup_id
  pickup: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    pickup_id: string;
  } | null;

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

export const buildCheckoutPayload = (
  items: CartItem[],
  formValues: VendorFormValues,
): CheckoutPayload => {
  const vendors: CheckoutVendorPayload[] = items.map(vendor => {
    const fields = formValues[vendor.vendor_id] || {};
    const fulfillment = vendor.selectedFulfillment as Fulfillment;
    const needsAddress =
      fulfillment === "delivery" || fulfillment === "shipping";
    const isPickup = fulfillment === "pickup";

    const subtotal = calcVendorSubtotal(vendor.products);
    const tax = calcVendorTax(subtotal);
    const shipping = calcVendorShipping(fulfillment);

    return {
      vendor_id: vendor.vendor_id,
      shop_id: vendor.shop_id,
      fulfillment,

      address: needsAddress
        ? {
            first_name: fields.first_name ?? "",
            last_name: fields.last_name ?? "",
            email: fields.email ?? "",
            phone: fields.phone ?? "",
            street_address: fields.street_address ?? "",
            apt: fields.apt ?? null,
            city: fields.city ?? "",
            postal_code: fields.postal_code ?? "",
            state: fields.state ?? "",
            country: fields.country ?? "",
          }
        : null,

      pickup: isPickup
        ? {
            first_name: fields.first_name ?? "",
            last_name: fields.last_name ?? "",
            email: fields.email ?? "",
            phone: fields.phone ?? "",
            pickup_id: fields.pickup_id ?? "",
          }
        : null,

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
