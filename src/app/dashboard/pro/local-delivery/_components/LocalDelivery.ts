export interface DeliveryOrigin {
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface DeliveryRange {
  id: string;
  minMiles: number;
  maxMiles: number;
  fee: number;
}

export const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

export function formatFee(fee: number): string {
  return fee === 0 ? "$0.00 (Free)" : `$${fee.toFixed(2)}`;
}
