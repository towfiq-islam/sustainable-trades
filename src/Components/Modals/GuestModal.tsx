import useAuth from "@/Hooks/useAuth";
import { useGuestOrderMutation } from "@/redux/api/orderApi";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CgSpinnerTwo } from "react-icons/cg";

type FormData = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};

const GuestModal = ({ id, onClose }: any) => {
  const { user } = useAuth();
  const product_link = `${window.location.origin}/product-details/${id}`;
  const [buyNowMutation, { isLoading: isBuying }] = useGuestOrderMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const payload = { quantity: 1, product_link, ...data };

    if (!user) {
      try {
        const res = await buyNowMutation({ id, payload }).unwrap();
        if (res?.success) {
          toast.success(res?.message);
          onClose();
        }
      } catch (err: any) {
        toast.error(err?.data?.message);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="form-label">Name</label>
          <input
            className="form-input"
            placeholder="Your name"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <span className="form-error">{errors.name.message}</span>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            placeholder="Your email"
            {...register("email", {
              required: "Email is required",
            })}
          />
          {errors.email && (
            <span className="form-error">{errors.email.message}</span>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="form-label">Phone</label>
          <input
            type="number"
            className="form-input"
            placeholder="Your phone number"
            {...register("phone", {
              required: "Phone number is required",
            })}
          />
          {errors.phone && (
            <span className="form-error">{errors.phone.message}</span>
          )}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="form-label">
            Message to Seller
          </label>
          <textarea
            id="message"
            rows={3}
            placeholder="Type message here..."
            className="form-input"
            {...register("message")}
          ></textarea>
        </div>

        {/* Submit btn */}
        <button
          disabled={isBuying}
          className={`primary_btn ${
            isBuying
              ? "!cursor-not-allowed opacity-85 hover:!bg-primary-green hover:!text-white"
              : "cursor-pointer"
          } `}
        >
          {isBuying ? (
            <span className="flex gap-2 items-center justify-center">
              <CgSpinnerTwo className="animate-spin text-xl" />
              <span>Please wait....</span>
            </span>
          ) : (
            "Continue"
          )}
        </button>
      </form>
    </div>
  );
};

export default GuestModal;
