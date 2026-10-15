import { State } from "country-state-city";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;

export interface StructuredAddress {
  address?: string;
  street_address?: string;
  address_line_1?: string;
  address_line_2?: string;
  unit?: string;
  apt?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  postal_code?: string;
  country?: string;
}

/**
 * Normalizes state name to 2-letter ISO code (e.g. "New York" -> "NY", "NY" -> "NY").
 */
export const normalizeStateCode = (state: string): string => {
  if (!state) return "";
  const trimmed = state.trim();
  if (trimmed.length === 2) return trimmed.toUpperCase();
  try {
    const states = State.getStatesOfCountry("US");
    const found = states.find(
      s => s.name.toLowerCase() === trimmed.toLowerCase(),
    );
    return found ? found.isoCode : trimmed;
  } catch {
    return trimmed;
  }
};

/**
 * Formats an address into standard USPS format: Street, City, ST, ZIP, US
 */
export const formatStandardAddress = ({
  street,
  unit,
  city,
  state,
  zip,
  country = "US",
}: {
  street?: string;
  unit?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}): string => {
  const normState = normalizeStateCode(state || "");
  const normCountry = country === "United States" || !country ? "US" : country;
  return [street, unit, city, normState, zip, normCountry]
    .filter(Boolean)
    .join(", ");
};

/**
 * Strips apartment, suite, unit, building, floor, room numbers and hashtags
 * which frequently cause Google Geocoding API to return ZERO_RESULTS.
 */
export const stripUnitFromAddress = (address: string): string => {
  return address
    .replace(
      /(?:(?:apt\.?|apartment|suite|ste\.?|unit|bldg\.?|building|floor|fl\.?|rm\.?|room|#)\s*[\w#.-]+)/gi,
      "",
    )
    .replace(/,\s*,+/g, ",")
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s,]+|[\s,]+$/g, "")
    .trim();
};

const queryGoogleGeocode = async (
  addressStr: string,
): Promise<{ lat: number; lng: number } | null> => {
  if (!API_KEY) {
    console.error(
      "Google Maps API key is missing (NEXT_PUBLIC_GOOGLE_MAP_API_KEY).",
    );
    return null;
  }

  const cleanQuery = addressStr.replace(/\s+/g, " ").trim();
  if (!cleanQuery) return null;

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      cleanQuery,
    )}&region=us&key=${API_KEY}`;

    const res = await fetch(url);
    const json = await res.json();

    if (json?.status === "OK" && json?.results?.length > 0) {
      const loc = json.results[0]?.geometry?.location;
      if (
        loc &&
        typeof loc.lat === "number" &&
        typeof loc.lng === "number" &&
        Number.isFinite(loc.lat) &&
        Number.isFinite(loc.lng)
      ) {
        return { lat: loc.lat, lng: loc.lng };
      }
    }
    return null;
  } catch (err) {
    console.error("Geocoding request failed:", err);
    return null;
  }
};

/**
 * Accurately geocodes an address to latitude and longitude.
 * Supports structured address objects or address strings.
 * Applies intelligent fallbacks:
 * 1. Primary full street address
 * 2. Address with unit / apt / suite stripped (Google Maps matches building)
 * 3. Street + City + State (without zip if zip was invalid)
 * 4. City + State + Zip (centroid fallback)
 */
export const getLatLng = async (
  input: string | StructuredAddress,
): Promise<{ lat: number | null; lng: number | null }> => {
  let fullAddress = "";
  let street = "";
  let city = "";
  let state = "";
  let zip = "";
  let country = "US";

  if (typeof input === "string") {
    fullAddress = input.trim();
  } else if (input && typeof input === "object") {
    street = (input.street_address || input.address_line_1 || input.address || "").trim();
    city = (input.city || "").trim();
    state = normalizeStateCode(input.state || "");
    zip = (input.postal_code || input.zip_code || "").trim();
    country = (input.country === "United States" || !input.country) ? "US" : input.country.trim();

    // Primary: street without unit for optimal Google Maps rooftop accuracy
    fullAddress = [street, city, state, zip, country].filter(Boolean).join(", ");
  }

  if (!fullAddress) {
    return { lat: null, lng: null };
  }

  // 1. Try full address query
  let result = await queryGoogleGeocode(fullAddress);
  if (result) return result;

  // 2. Try stripping unit/apt/suite designators
  const cleanedAddress = stripUnitFromAddress(fullAddress);
  if (cleanedAddress && cleanedAddress !== fullAddress) {
    result = await queryGoogleGeocode(cleanedAddress);
    if (result) return result;
  }

  // 3. If structured fields available, try street + city + state (without zip in case zip was wrong)
  if (street && city && state) {
    const withoutZip = [street, city, state, country].filter(Boolean).join(", ");
    result = await queryGoogleGeocode(withoutZip);
    if (result) return result;

    const cleanedWithoutZip = stripUnitFromAddress(withoutZip);
    if (cleanedWithoutZip && cleanedWithoutZip !== withoutZip) {
      result = await queryGoogleGeocode(cleanedWithoutZip);
      if (result) return result;
    }
  }

  // 4. Try city, state, zip fallback (ensures coordinates for distance calculation)
  if (city && state) {
    const cityStateZip = [city, state, zip, country].filter(Boolean).join(", ");
    result = await queryGoogleGeocode(cityStateZip);
    if (result) return result;
  }

  return { lat: null, lng: null };
};

