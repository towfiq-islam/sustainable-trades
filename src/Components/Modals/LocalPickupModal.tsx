import { useForm } from "react-hook-form";
type formData = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const LocalPickupModal = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>();

  const onSubmit = async (data: formData) => {
    console.log(data);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-secondary-black mb-1">
        Contact seller
      </h3>
      <p className="text-sm text-secondary-gray mb-4">
        This item is sold directly by the seller, not through online checkout.
        Send a message to arrange purchase or pickup.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <div>
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            placeholder="Your email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <span className="form-error">{errors.email.message}</span>
          )}
        </div>

        <div>
          <label className="form-label">Phone</label>
          <input
            type="number"
            className="form-input"
            placeholder="Your phone number"
            {...register("phone", { required: "Phone number is required" })}
          />
          {errors.phone && (
            <span className="form-error">{errors.phone.message}</span>
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

        <button className={`primary_btn`}>Send Message to Seller</button>
      </form>
    </div>
  );
};

export default LocalPickupModal;
