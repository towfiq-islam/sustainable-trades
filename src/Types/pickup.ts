export type PickupLocationFormValues = {
  location_name: string;
  address: string;
  unit: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  is_active: string | boolean;
};

export type PickupLocation = PickupLocationFormValues & {
  id: number;
  is_active: string | boolean;
};

export type DeliveryOriginFormValues = {
  address: string;
  unit: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
};

export type DeliveryRangeFormValues = {
  minMiles: string;
  maxMiles: string;
  fee: string;
};
