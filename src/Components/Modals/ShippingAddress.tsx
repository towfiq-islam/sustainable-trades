"use client";
import { useCheckout } from "@/Hooks/api/cms_api";
import { useForm } from "react-hook-form";
import { CgSpinnerTwo } from "react-icons/cg";

type FormData = {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address: string;
  country: string;
  apt?: string;
  city: string;
  state: string;
  postal_code: string;
  payment_method: string;
  shipping_option: string;
};

const ShippingAddress = ({
  cart_id,
  onClose,
}: {
  cart_id: number | null;
  onClose: () => void;
}) => {
  const { mutateAsync: checkoutMutation, isPending } = useCheckout(cart_id);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    await checkoutMutation(data, {
      onSuccess: (data: any) => {
        console.log(data);
        if (data?.status || data?.success) {
          onClose();
        }
      },
    });
  };

  return (
    <>
      <h3 className="text-light-green font-semibold text-lg mb-3">
        Shipping Options
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* First Name + Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">First Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Jon"
              {...register("first_name", {
                required: "First name is required",
              })}
            />
            {errors.first_name && (
              <p className="form-error">{errors.first_name.message}</p>
            )}
          </div>
          <div>
            <label className="form-label">Last Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Doe"
              {...register("last_name", { required: "Last name is required" })}
            />
            {errors.last_name && (
              <p className="form-error">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Email *</label>
            <input
              type="email"
              className="form-input"
              {...register("email", { required: "Email is required" })}
              placeholder="example@mail.com"
            />
            {errors.email && (
              <p className="form-error">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">Phone</label>
            <input
              type="tel"
              className="form-input"
              {...register("phone", { required: "Phone is required" })}
              placeholder="+1 (000) 000-0000"
            />
            {errors.phone && (
              <p className="form-error">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Country + Address */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Country *</label>
            <input
              type="text"
              className="form-input"
              {...register("country", { required: "Country is required" })}
              placeholder="USA"
            />
            {errors.country && (
              <p className="form-error">{errors.country.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">Address *</label>
            <input
              type="text"
              className="form-input"
              {...register("address", { required: "Address is required" })}
              placeholder="Texas, Austin"
            />
            {errors.address && (
              <p className="form-error">{errors.address.message}</p>
            )}
          </div>
        </div>

        {/* State + City */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">State *</label>
            <input
              type="text"
              className="form-input"
              placeholder="State"
              {...register("state", { required: "State is required" })}
            />
            {errors.state && (
              <p className="form-error">{errors.state.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">City *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Austin"
              {...register("city", { required: "City is required" })}
            />
            {errors.city && <p className="form-error">{errors.city.message}</p>}
          </div>
        </div>

        {/* Apt/Suite + Postal Code  */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">Zip Code *</label>
            <input
              type="text"
              className="form-input"
              placeholder="12345"
              {...register("postal_code", { required: "Zip code is required" })}
            />
            {errors.postal_code && (
              <p className="form-error">{errors.postal_code.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">Apt / Suite (Optional)</label>
            <input
              type="text"
              className="form-input"
              {...register("apt")}
              placeholder="Apartment / Suite"
            />
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <label className="form-label">Payment Method *</label>
          <select
            className="form-input"
            {...register("payment_method", {
              required: "Payment method is required",
            })}
          >
            <option value="">Select payment method</option>
            <option value="paypal">Paypal</option>
            <option value="cash_on_delivery">Cash on delivery</option>
          </select>
          {errors.payment_method && (
            <p className="form-error">{errors.payment_method.message}</p>
          )}
        </div>

        {/* Shipping Option */}
        <div>
          <label className="form-label">Shipping Option *</label>
          <select
            className="form-input"
            {...register("shipping_option", {
              required: "Payment method is required",
            })}
          >
            <option value="">Select pickup option</option>
            <option value="pickup">Pickup</option>
            <option value="delivery">Delivery</option>
          </select>
          {errors.shipping_option && (
            <p className="form-error">{errors.shipping_option.message}</p>
          )}
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={isPending}
          className={`primary_btn ${
            isPending
              ? "!cursor-not-allowed opacity-85 hover:!bg-primary-green hover:!text-white"
              : "cursor-pointer"
          } `}
        >
          {isPending ? (
            <span className="flex gap-2 items-center justify-center">
              <CgSpinnerTwo className="animate-spin text-xl" />
              <span>Please wait....</span>
            </span>
          ) : (
            "Continue to Payment"
          )}
        </button>
      </form>
    </>
  );
};

export default ShippingAddress;
