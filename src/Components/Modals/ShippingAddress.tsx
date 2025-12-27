"use client";
import { useForm } from "react-hook-form";

type FormData = {
  email: string;
  country: string;
  fullName: string;
  street: string;
  apt?: string;
  zip: string;
  city: string;
  state: string;
  phone?: string;
};

const ShippingAddress = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log("Submitted Data:", data);
  };

  return (
    <>
      <h3 className="text-light-green font-semibold text-lg mb-3">
        Shipping Options
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <div>
          <label className="form-label">Email *</label>
          <input
            type="email"
            className="form-input"
            {...register("email", { required: "Email is required" })}
            placeholder="example@mail.com"
          />
          {errors.email && <p className="form-error">{errors.email.message}</p>}
        </div>

        {/* Country */}
        <div>
          <label className="form-label">Country *</label>
          <input
            type="text"
            className="form-input"
            {...register("country", { required: "Country is required" })}
            placeholder="Texas, Austin"
          />
          {errors.country && (
            <p className="form-error">{errors.country.message}</p>
          )}
        </div>

        {/* Full Name */}
        <div>
          <label className="form-label">Full Name *</label>
          <input
            type="text"
            className="form-input"
            {...register("fullName", { required: "Full name is required" })}
            placeholder="John Doe"
          />
          {errors.fullName && (
            <p className="form-error">{errors.fullName.message}</p>
          )}
        </div>

        {/* Street Address */}
        <div>
          <label className="form-label">Street Address *</label>
          <input
            type="text"
            className="form-input"
            {...register("street", { required: "Street address is required" })}
            placeholder="123 Main St"
          />
          {errors.street && (
            <p className="form-error">{errors.street.message}</p>
          )}
        </div>

        {/* Apt / Suite (Optional) */}
        <div>
          <label className="form-label">Apt / Suite (optional)</label>
          <input
            type="text"
            className="form-input"
            {...register("apt")}
            placeholder="Apartment / Suite"
          />
        </div>

        {/* Zip + City */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Zip Code *</label>
            <input
              type="text"
              className="form-input"
              {...register("zip", { required: "Zip code is required" })}
            />
            {errors.zip && <p className="form-error">{errors.zip.message}</p>}
          </div>
          <div>
            <label className="form-label">City *</label>
            <input
              type="text"
              className="form-input"
              {...register("city", { required: "City is required" })}
            />
            {errors.city && <p className="form-error">{errors.city.message}</p>}
          </div>
        </div>

        {/* State */}
        <div>
          <label className="form-label">State *</label>
          <input
            type="text"
            className="form-input"
            {...register("state", { required: "State is required" })}
          />
          {errors.state && <p className="form-error">{errors.state.message}</p>}
        </div>

        {/* Phone (Optional) */}
        <div>
          <label className="form-label">Phone (optional)</label>
          <input
            type="tel"
            className="form-input"
            {...register("phone")}
            placeholder="+1 (000) 000-0000"
          />
        </div>

        {/* Button */}
        <button type="submit" className="primary_btn w-full">
          Continue to Payment
        </button>
      </form>
    </>
  );
};

export default ShippingAddress;
