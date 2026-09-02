export type OrderStatus =
  | "Pending"
  | "Shipped"
  | "Delivered"
  | "Canceled"
  | "Local";

export type Order = {
  id: string;
  date: string;
  customer: string;
  email: string;
  optIn: string;
  items: number;
  amount: string;
  status: OrderStatus;
  fullfill: string;
};

export type AddressFormData = {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipcode: string;
};
