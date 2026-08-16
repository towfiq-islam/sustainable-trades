import { useBasicVendorOrderMutation } from "@/redux/api/ordersApi";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
type formData = {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  message: string;
};
type Props = {
  onClose: () => void;
  productId: number;
};

const LocalPickupModal = ({ onClose, productId }: Props) => {
  const [localPickup, { isLoading }] = useBasicVendorOrderMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>();

  const onSubmit = async (data: formData) => {
    const payload = {
      product_id: productId,
      quantity: 1,
      ...data,
    };
    try {
      const res = await localPickup(payload).unwrap();
      toast.success(res?.message);
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-secondary-black mb-1">
        Contact seller
      </h3>
      <h4 className="text-[15px] font-semibold text-primary-green mb-1">
        Purchase directly from the seller
      </h4>
      <p className="text-sm text-secondary-gray mb-3">
        This item is not available through online checkout. Contact the seller
        to arrange payment and coordinate pickup, delivery, or shipping directly
        with them (if applicable)
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="form-label">Name</label>
          <input
            className="form-input"
            placeholder="Your name"
            {...register("customer_name", { required: "Name is required" })}
          />
          {errors.customer_name && (
            <span className="form-error">{errors.customer_name.message}</span>
          )}
        </div>

        <div>
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            placeholder="Your email"
            {...register("customer_email", { required: "Email is required" })}
          />
          {errors.customer_email && (
            <span className="form-error">{errors.customer_email.message}</span>
          )}
        </div>

        <div>
          <label className="form-label">Phone</label>
          <input
            type="number"
            className="form-input"
            placeholder="Your phone number"
            {...register("customer_phone", {
              required: "Phone number is required",
            })}
          />
          {errors.customer_phone && (
            <span className="form-error">{errors.customer_phone.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="message" className="form-label">
            Message to Seller
          </label>
          <textarea
            id="message"
            rows={3}
            placeholder="Type message here..."
            className="form-input"
            {...register("message", { required: "Message is required" })}
          />
          {errors.message && (
            <span className="form-error">{errors.message.message}</span>
          )}
        </div>

        <button disabled={isLoading} className={`primary_btn`}>
          Send Message to Seller
        </button>
      </form>
    </div>
  );
};

export default LocalPickupModal;
