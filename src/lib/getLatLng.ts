const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;

export const getLatLng = async (
  fullAddress: string,
): Promise<{ lat: number | null; lng: number | null }> => {
  if (!API_KEY) {
    console.error(
      "Google Maps API key is missing (NEXT_PUBLIC_GOOGLE_MAP_API_KEY).",
    );
    return { lat: null, lng: null };
  }

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        fullAddress,
      )}&key=${API_KEY}`,
    );
    const json = await res.json();

    if (json?.status === "OK" && json?.results?.length > 0) {
      const { lat, lng } = json.results[0].geometry.location;
      return { lat, lng };
    }

    console.warn("Geocoding returned no results:", json?.status);
    return { lat: null, lng: null };
  } catch (err) {
    console.error("Geocoding failed:", err);
    return { lat: null, lng: null };
  }
};
