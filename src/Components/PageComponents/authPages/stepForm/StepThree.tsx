"use client";
import PaymentCardIcons, {
  Camera,
  Facebook,
  Instagram,
  Pinterest,
  Website,
} from "@/Components/Svg/SvgContainer";
import type React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { LiaExclamationCircleSolid } from "react-icons/lia";
import { useFormContext, useFieldArray } from "react-hook-form";

const StepThree = ({ step, totalSteps, setStep }: any) => {
  const {
    register,
    control,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "faqs",
  });

  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });
  const [editingFaqIndex, setEditingFaqIndex] = useState<number | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const profilePhotoPreview = watch("profilePhotoPreview");

  // Handle profile image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setProfileFile(file);
      setValue("about_image", file, { shouldValidate: true });

      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("profilePhotoPreview", reader.result as string, {
          shouldValidate: true,
        });
        trigger("about_image");
      };
      reader.readAsDataURL(file);
    }
  };

  // FAQ Handlers
  const handleSaveFaq = () => {
    if (newFaq.question.trim() && newFaq.answer.trim()) {
      if (editingFaqIndex !== null) {
        const currentFaqs = watch("faqs");
        currentFaqs[editingFaqIndex] = newFaq;
        setValue("faqs", currentFaqs);
        setEditingFaqIndex(null);
      } else {
        append(newFaq);
      }
      setNewFaq({ question: "", answer: "" });
    } else {
      toast("Please fill both question and answer");
    }
  };

  const handleEditFaq = (index: number) => {
    const faq = watch("faqs")[index];
    setNewFaq(faq);
    setEditingFaqIndex(index);
  };

  const handleDeleteFaq = (index: number) => {
    remove(index);
  };

  return (
    <>
      <h2 className="auth_title lg:mt-16 mt-8">About Your Shop</h2>

      <div className="border border-accent-gray rounded-[20px] lg:my-[56px] my-8 lg:p-20 px-5">
        {/* Profile Picture */}
        <div className="lg:mt-8 mt-5">
          <p className="form-label text-center lg:text-start">
            About Your Shop Photo *
          </p>

          <div className="relative inline-block group">
            <LiaExclamationCircleSolid className="cursor-pointer text-primary-green text-3xl lg:block hidden" />
            <p className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-64 bg-white text-primary-green text-[14px] p-3 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out z-10">
              This Photo will appear in your about shop section. Choose an image
              that best represents the goods or services you offer. You can
              change or update it anytime in my edit page.
            </p>
          </div>

          <div
            className="relative bg-[#F0EEE9] lg:mx-0 mx-auto h-[150px] w-[150px] rounded-full lg:mt-4 flex flex-col justify-center items-center cursor-pointer overflow-hidden border border-accent-gray"
            onClick={() =>
              document.getElementById("profilePhotoInput")?.click()
            }
          >
            {profilePhotoPreview ? (
              <>
                <img
                  src={profilePhotoPreview}
                  alt="Profile Preview"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full">
                  <Camera />
                </div>
              </>
            ) : (
              <>
                <Camera />
                <p>Add Photo</p>
              </>
            )}
          </div>

          <input
            type="file"
            id="profilePhotoInput"
            accept="image/*"
            className="hidden"
            {...register("about_image", {
              validate: value => value || "Profile picture is required",
            })}
            onChange={handleImageChange}
          />
          {errors.about_image && (
            <p className="text-red-600 lg:text-start text-center">
              {errors.about_image.message as string}
            </p>
          )}

          <h5 className="text-[#67645F] text-[14px] mt-2 lg:text-start text-center">
            Max file size: 10 MB
          </h5>
        </div>

        {/* About Your Shop */}
        <div className="my-8 border rounded-lg lg:p-8 p-4">
          <p className="text-[20px] font-normal text-secondary-black mb-4">
            About Shop
          </p>

          {/* Tagline */}
          <div className="mb-4">
            <label className="block text-secondary-gray font-semibold mb-1">
              Tagline
            </label>

            <input
              type="text"
              {...register("tagline", {
                required: "Write a tagline",
              })}
              placeholder="Write a short, memorable tagline that captures your business."
              className="form-input lg:h-fit h-32"
            />
            {errors.tagline && (
              <p className="text-red-600 mt-1">
                {errors.tagline.message as string}
              </p>
            )}
          </div>

          {/* Two-Sentence Statement */}
          <div className="mb-4">
            <label className="block text-secondary-gray font-semibold mb-1">
              Two-Sentence Statement
            </label>

            <textarea
              {...register("statement", {
                required: "Write a statement",
              })}
              placeholder="In two sentences, tell shoppers who you are and what you offer."
              className="form-input lg:h-fit h-32"
            />
            {errors.statement && (
              <p className="text-red-600 mt-1">
                {errors.statement.message as string}
              </p>
            )}
          </div>

          {/* Our Story */}
          <div className="mb-4">
            <label className="block text-secondary-gray font-semibold mb-1">
              Our Story
            </label>

            <textarea
              {...register("our_story", {
                required: "Write our story",
              })}
              placeholder="Tell the story behind your shop, your journey, values, and passion."
              className="form-input lg:h-fit h-32"
            />
            {errors.our_story && (
              <p className="text-red-600 mt-1">
                {errors.our_story.message as string}
              </p>
            )}
          </div>
        </div>

        {/* Shop Policies */}
        <div className="border rounded-lg lg:p-8 p-4">
          <p className="text-[20px] font-normal text-secondary-black mb-4">
            Shop Policies
          </p>

          {/* Payment Methods */}
          <div className="mb-4">
            <label className="block text-secondary-gray font-semibold mb-1">
              Accepted Payment Methods
            </label>

            <PaymentCardIcons />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              {["Cash", "PayPal", "Venmo", "Credit Card", "Bank Transfer"].map(
                method => (
                  <label
                    key={method}
                    className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      value={method}
                      {...register("payment_methods", {
                        validate: value =>
                          value.length > 0 ||
                          "Select at least one payment method",
                      })}
                      className="w-4 h-4 text-primary-green"
                    />
                    <span className="text-secondary-gray">{method}</span>
                  </label>
                ),
              )}
            </div>

            {errors.payment_methods && (
              <p className="text-red-600 mt-2">
                {errors.payment_methods.message as string}
              </p>
            )}
          </div>

          {/* Shipping Information */}
          <div className="mb-4">
            <label className="block text-secondary-gray font-semibold mb-1">
              Shipping Information
            </label>
            <textarea
              {...register("shipping_information", {
                required: "Write shipping information",
              })}
              placeholder="Example: Orders ship within 3 business days via USPS. Local pickup in Austin, TX available. Shipping to U.S. only."
              className="form-input lg:h-fit h-32"
            />
            {errors.shipping_information && (
              <p className="text-red-600 mt-1">
                {errors.shipping_information.message as string}
              </p>
            )}
          </div>

          {/* Return & Exchanges */}
          <div className="mb-4">
            <label className="block text-secondary-gray font-semibold mb-1">
              Returns & Exchanges
            </label>

            <textarea
              {...register("return_policy", {
                required: "Write return policy",
              })}
              placeholder="Example: Returns accepted within 14 days of delivery. Items must be unused and in original packaging."
              className="form-input lg:h-fit h-32"
            />
            {errors.return_policy && (
              <p className="text-red-600 mt-1">
                {errors.return_policy.message as string}
              </p>
            )}
          </div>
        </div>

        {/* FAQ Form */}
        <div className="border p-4 rounded mt-6">
          <h3 className="text-lg font-semibold mb-2">Add FAQ</h3>
          <input
            type="text"
            placeholder="Question"
            value={newFaq.question}
            onChange={e => setNewFaq({ ...newFaq, question: e.target.value })}
            className="border p-2 rounded w-full mb-2"
          />
          <textarea
            placeholder="Answer"
            value={newFaq.answer}
            onChange={e => setNewFaq({ ...newFaq, answer: e.target.value })}
            className="border p-2 rounded w-full mb-2"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSaveFaq}
              className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
            >
              {editingFaqIndex !== null ? "Update" : "Save"}
            </button>
            {editingFaqIndex !== null && (
              <button
                type="button"
                onClick={() => {
                  setNewFaq({ question: "", answer: "" });
                  setEditingFaqIndex(null);
                }}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </div>

        {/* FAQ List */}
        <div className="mt-4">
          {fields.length > 0 && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                  <div className="col-span-1">#</div>
                  <div className="col-span-4">Question</div>
                  <div className="col-span-5">Answer</div>
                  <div className="col-span-2">Actions</div>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {fields.map((field, index) => {
                  const faq = watch("faqs")[index];
                  return (
                    <div key={field.id} className="px-4 py-3">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-1 text-sm text-gray-600">
                          {index + 1}
                        </div>
                        <div className="col-span-4 text-sm text-gray-900">
                          {faq?.question}
                        </div>
                        <div className="col-span-5 text-sm text-gray-600 truncate">
                          {faq?.answer}
                        </div>
                        <div className="col-span-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditFaq(index)}
                            className="p-1 text-green-600 hover:bg-green-100 rounded cursor-pointer"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteFaq(index)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded cursor-pointer"
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* FAQ Required Error */}
          {fields.length === 0 && (
            <p className="text-red-600 text-sm mt-2">
              Please add at least one FAQ before continuing.
            </p>
          )}
        </div>

        <li className="text-[16px] text-secondary-gray font-semibold list-disc mt-2">
          You can add up to 10 FAQs ({fields.length}/10)
        </li>
      </div>

      {/* Link Your Shop Section */}
      <div>
        <p className="text-[20px] font-normal text-secondary-black pb-4 pt-2">
          Link Your Shop <span className="text-[#67645F]">(Optional)</span>
        </p>
        <div className="flex flex-col gap-4">
          <div className="flex gap-x-4 items-center">
            <Website />
            <input
              type="url"
              placeholder="Type Your Website link here"
              className="outline-0 underline w-fit text-[#67645F] font-bold"
              {...register("website_url")}
            />
          </div>
          <div className="flex gap-x-4 items-center">
            <Facebook />
            <input
              type="url"
              placeholder="Type Your Facebook link here"
              className="outline-0 underline w-fit text-[#67645F] font-bold"
              {...register("facebook_url")}
            />
          </div>
          <div className="flex gap-x-4 items-center">
            <Instagram />
            <input
              type="url"
              placeholder="Type Your Instagram link here"
              className="outline-0 underline w-fit text-[#67645F] font-bold"
              {...register("instagram_url")}
            />
          </div>
          <div className="flex gap-x-4 items-center">
            <Pinterest />
            <input
              type="url"
              placeholder="Type Your Pinterest link here"
              className="outline-0 underline w-fit text-[#67645F] font-bold"
              {...register("pinterest_url")}
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="md:flex justify-between items-center mt-8">
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          className="auth-primary-btn w-full md:w-fit"
        >
          Back
        </button>

        <button
          type="submit"
          className="auth-secondary-btn md:mt-0 mt-3 w-full md:w-fit"
        >
          {step < totalSteps ? "Save and Continue" : "Submit"}
        </button>
      </div>
    </>
  );
};

export default StepThree;
