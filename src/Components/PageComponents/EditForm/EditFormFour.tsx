"use client";
import { useFormContext } from "react-hook-form";
import React, { useEffect, useState } from "react";

type FormValues = {
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  postal_code: string;
  display_my_address: number;
  address_10_mile: number;
  do_not_display: number;
  latitude?: string;
  longitude?: string;
};

const EditFormFour = ({ data }: any) => {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext<FormValues>();

  const [selectedOption, setSelectedOption] = useState<string>("");

  useEffect(() => {
    if (!data) return;

    const addressLine1 = data?.shop_info?.address?.address_line_1 || "";
    const addressLine2 = data?.shop_info?.address?.address_line_2 || "";
    const postalCode = data?.shop_info?.address?.postal_code || "";
    const city = data?.shop_info?.address?.city || "";
    const state = data?.shop_info?.address?.state || "";
    const lat = data?.shop_info?.address?.latitude || "";
    const lng = data?.shop_info?.address?.longitude || "";

    const displayMyAddress = data?.shop_info?.address?.display_my_address
      ? 1
      : 0;
    const addressRadius = data?.shop_info?.address?.address_10_mile ? 1 : 0;
    const doNotDisplay = data?.shop_info?.address?.do_not_display ? 1 : 0;

    setValue("address_line_1", addressLine1);
    setValue("address_line_2", addressLine2);
    setValue("postal_code", postalCode);
    setValue("city", city);
    setValue("state", state);
    setValue("latitude", lat);
    setValue("longitude", lng);
    setValue("display_my_address", displayMyAddress);
    setValue("address_10_mile", addressRadius);
    setValue("do_not_display", doNotDisplay);

    if (displayMyAddress === 1) setSelectedOption("display_my_address");
    else if (addressRadius === 1) setSelectedOption("address_10_mile");
    else if (doNotDisplay === 1) setSelectedOption("do_not_display");
  }, [data, setValue]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedOption(value);

    setValue("display_my_address", 0);
    setValue("address_10_mile", 0);
    setValue("do_not_display", 0);

    if (value === "display_my_address") setValue("display_my_address", 1);
    if (value === "address_10_mile") setValue("address_10_mile", 1);
    if (value === "do_not_display") setValue("do_not_display", 1);
  };

  return (
    <>
      <h4 className="mt-12 mb-7 text-primary-green text-[20px] font-semibold">
        Geo-Locator
      </h4>

      <div className="space-y-5 p-7 rounded border">
        {/* Location Visibility */}
        <div>
          <p className="form-label">Location Visibility *</p>
          <select
            value={selectedOption}
            onChange={handleSelectChange}
            className="form-input"
          >
            <option value="">Select visibility option</option>
            <option value="display_my_address">
              Show my exact business address
            </option>
            <option value="address_10_mile">
              Show my location within a 0.5-mile radius
            </option>
            <option value="do_not_display">
              Keep my exact location private
            </option>
          </select>
        </div>

        {/* Address */}
        <div>
          <p className="form-label">Address Line One *</p>
          <input
            type="text"
            {...register("address_line_1", { required: "Address is required" })}
            className="form-input"
            placeholder="Address"
          />
          {errors.address_line_1 && (
            <p className="text-red-600">{errors.address_line_1.message}</p>
          )}
        </div>

        <div>
          <p className="form-label">Address Line 2 (optional)</p>
          <input
            type="text"
            className="form-input"
            placeholder="Apartment, suite, unit, etc."
            {...register("address_line_2")}
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <p className="form-label">City *</p>
            <input
              type="text"
              {...register("city", { required: "City is required" })}
              className="form-input"
              placeholder="City"
            />
            {errors.city && (
              <p className="text-red-600">{errors.city.message}</p>
            )}
          </div>

          <div className="flex-1">
            <p className="form-label">State *</p>
            <input
              type="text"
              {...register("state", { required: "State is required" })}
              className="form-input"
              placeholder="State"
            />
            {errors.state && (
              <p className="text-red-600">{errors.state.message}</p>
            )}
          </div>

          <div className="flex-1">
            <p className="form-label">Zipcode *</p>
            <input
              type="text"
              {...register("postal_code", { required: "Zipcode is required" })}
              className="form-input"
              placeholder="Zipcode"
            />
            {errors.postal_code && (
              <p className="text-red-600">{errors.postal_code.message}</p>
            )}
          </div>
        </div>

        {/* Hidden Fields */}
        <input type="hidden" {...register("display_my_address")} />
        <input type="hidden" {...register("address_10_mile")} />
        <input type="hidden" {...register("do_not_display")} />
      </div>
    </>
  );
};

export default EditFormFour;
