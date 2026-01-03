"use client";
import {
  GoogleMap,
  Marker,
  Circle,
  useJsApiLoader,
} from "@react-google-maps/api";
import toast from "react-hot-toast";
import React, { useState } from "react";
import { CgSpinnerTwo } from "react-icons/cg";
import { useFormContext } from "react-hook-form";
import AddressForm from "@/Components/Modals/LocatorModal";

const containerStyle = {
  width: "100%",
  height: "550px",
  borderRadius: "12px",
};

const StepFour = ({ setStep, step, isPending }: any) => {
  const { setValue, trigger, getValues, resetField } = useFormContext();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: API_KEY || "" });

  // Reset all location-related form fields and state
  const resetLocationState = () => {
    setSelectedLocation(null);
    setValue("latitude", "");
    setValue("longitude", "");
    resetField("address_line_1");
    resetField("address_line_2");
    resetField("city");
    resetField("state");
    resetField("zip_code");
  };

  //  Handle switching options
  const handleCheckboxClick = (option: number) => {
    if (selectedOption === option) return;

    resetLocationState();
    setSelectedOption(option);

    setValue("address_10_mile", 0);
    setValue("display_my_address", 0);
    setValue("do_not_display", 0);

    if (option === 1) setValue("display_my_address", 1);
    if (option === 2) setValue("address_10_mile", 1);
    if (option === 3) setValue("do_not_display", 1);

    setIsModalOpen(true);
  };

  // Geocode function
  const fetchLatLngFromAddress = async (address: string) => {
    if (!API_KEY) {
      toast.error("Google Maps API key is missing.");
      return null;
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === "OK" && data.results.length > 0) {
        return data.results[0].geometry.location;
      } else {
        toast.error("Address not found. Please enter a valid address.");
        return null;
      }
    } catch {
      toast.error("Failed to fetch location. Try again.");
      return null;
    }
  };

  // Save button logic
  const handleSave = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!selectedOption) return;

    const isValid = await trigger([
      "address_line_1",
      "city",
      "state",
      "zip_code",
    ]);
    if (!isValid) {
      toast.error("Please fill all required address fields.");
      return;
    }

    const { address_line_1, address_line_2, city, state, zip_code, country } =
      getValues();
    let address = `${address_line_1} ${
      address_line_2 ?? ""
    }, ${city}, ${state} ${zip_code}, ${country ?? "USA"}`;

    if (selectedOption === 3) {
      address = `${city}, ${state}, ${country ?? "USA"}`;
    }

    const location = await fetchLatLngFromAddress(address);
    if (!location) return;

    setSelectedLocation(location);
    setValue("latitude", location.lat);
    setValue("longitude", location.lng);
    setIsModalOpen(false);
  };

  return (
    <section className="lg:px-12">
      <div className="lg:my-16 my-8 text-center lg:text-left">
        <h2 className="auth_title text-2xl sm:text-3xl lg:text-4xl">
          Geo-Locator
        </h2>
        <p className="auth_description mt-2 sm:mt-4 text-sm sm:text-base lg:text-lg">
          Let’s decide how you want to show up on the map.
        </p>
      </div>

      {/* Map Section */}
      <div className="relative w-full">
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={selectedLocation || { lat: 37.7749, lng: -122.4194 }}
            zoom={selectedLocation ? 14 : 10}
          >
            {selectedLocation && selectedOption === 1 && (
              <Marker position={selectedLocation} />
            )}

            {selectedLocation && selectedOption === 2 && (
              <Circle
                center={selectedLocation}
                radius={804.672}
                options={{
                  strokeColor: "#41695a",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: selectedOption === 2 ? "#41695a" : "#bac7b1",
                  fillOpacity: 0.25,
                }}
              />
            )}

            {selectedLocation && selectedOption === 3 && (
              <Marker position={selectedLocation} label="City Center" />
            )}
          </GoogleMap>
        )}

        {/* Options Panel */}
        <div className="absolute top-8 right-10 z-10 py-6 max-w-[528px] overflow-y-auto">
          <div className="bg-[#FFFDF8] px-6 py-10 rounded-lg flex flex-col gap-y-6">
            {[1, 2, 3].map(opt => (
              <div key={opt} className="flex gap-x-4 items-start">
                <input
                  type="radio"
                  name="location_option"
                  checked={selectedOption === opt}
                  onChange={() => handleCheckboxClick(opt)}
                  className="mt-2 size-5 shrink-0"
                />

                <div>
                  <h3 className="text-[#13141D] font-semibold text-[22px]">
                    {opt === 1 && "Display my business’ exact address."}
                    {opt === 2 &&
                      "Display my location within a 0.5-mile radius of my address."}
                    {opt === 3 && "Do not display my address."}
                  </h3>
                  <p className="text-[#13141D] mt-1">
                    {opt === 1 && "Anyone can view your exact address."}
                    {opt === 2 && "Your exact location remains private."}
                    {opt === 3 &&
                      "Only your city/state will be shown. You can share exact location when a trade or sale occurs."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          className="auth-primary-btn w-full sm:w-auto"
        >
          Back
        </button>

        <button
          type={
            getValues("latitude") && getValues("longitude")
              ? "submit"
              : "button"
          }
          disabled={isPending}
          onClick={() => {
            const lat = getValues("latitude");
            const lng = getValues("longitude");
            if (!lat || !lng) {
              toast.error("Please save your location before continuing.");
            }
          }}
          className={`auth-secondary-btn w-full sm:w-auto ${
            isPending && "!cursor-not-allowed"
          }`}
        >
          {isPending ? (
            <p className="flex gap-2 items-center justify-center">
              <CgSpinnerTwo className="animate-spin text-xl" />
              <span>Submitting...</span>
            </p>
          ) : (
            "Submit"
          )}
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-[#f7f7f7] rounded-lg p-6 max-w-lg w-full pt-[52px] relative">
            <p className="mb-4 text-sm">
              {selectedOption === 1 &&
                "Enter the exact address you want to display."}
              {selectedOption === 2 &&
                "Enter your address to display your 0.5 mile radius."}
              {selectedOption === 3 &&
                "Enter city/state to only display general location."}
            </p>

            <AddressForm />

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-3xl text-gray-500 cursor-pointer"
              aria-label="Close modal"
            >
              ×
            </button>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={handleSave}
                className="auth-secondary-btn max-w-[150px] w-full"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default StepFour;
