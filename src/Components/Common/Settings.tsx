"use client";
import { useUpdateUser } from "@/Hooks/api/auth_api";
import { useDeleteAccount } from "@/Hooks/api/dashboard_api";
import useAuth from "@/Hooks/useAuth";
import { useLogoutMutation } from "@/redux/api/authApi";
import { useAppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaRegEdit } from "react-icons/fa";

type SettingsFormValues = {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  street_address: string;
  apt: string;
  city: string;
  state: string;
  postal_code: string;
  avatar: FileList;
};

const Settings = () => {
  const router = useRouter();
  const { user, clearAuthorization } = useAuth();
  const dispatch = useAppDispatch();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [modalType, setModalType] = useState<"logout" | "delete" | null>(null);
  const hiddenFileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingsFormValues>();

  const [logout, { isLoading }] = useLogoutMutation();
  const { mutate: deleteMutation, isPending: isDeleting } = useDeleteAccount();
  const { mutate: updateUser, isPending } = useUpdateUser();

  useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        username: user.username || "",
        street_address: user.street_address || "",
        apt: user?.apt || "",
        city: user?.city || "",
        state: user?.state || "",
        postal_code: user?.postal_code || "",
      });
    }
  }, [user, reset]);

  const onSubmit = (data: SettingsFormValues) => {
    const formData = new FormData();
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("username", data.username);
    formData.append("street_address", data.street_address);
    formData.append("apt", data.apt);
    formData.append("city", data.city);
    formData.append("state", data.state);
    formData.append("postal_code", data.postal_code);
    if (data.avatar?.[0]) {
      formData.append("avatar", data.avatar[0]);
    }
    updateUser(formData);
  };

  const handleConfirm = () => {
    if (modalType === "logout") {
      logout()
        .unwrap()
        .then(() => {
          toast.success("Logged out successfully");
          router.replace("/auth/login");
          dispatch(clearAuthorization());
        });
    } else if (modalType === "delete") {
      deleteMutation(undefined, {
        onSuccess: () => {
          toast.success("Account deleted successfully");
          setModalType(null);
          router.replace("/auth/login");
        },
      });
    }
  };

  return (
    <>
      <h2 className="text-[30px] md:text-[40px] font-lato font-semibold text-black">
        Settings
      </h2>

      <div className="lg:mt-6 flex flex-col-reverse lg:flex-row gap-x-[72.5px] xl:gap-x-[145px]">
        <div className="mt-5 lg:mt-0 lg:w-1/2">
          <form
            id="settings-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            {/* Avatar */}
            <div className="w-full">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                {...register("avatar", {
                  onChange: e => {
                    const file = e.target.files?.[0];
                    if (file) setAvatarPreview(URL.createObjectURL(file));
                  },
                })}
                ref={e => {
                  register("avatar").ref(e);
                  hiddenFileInputRef.current = e;
                }}
              />

              <div
                onClick={() => hiddenFileInputRef.current?.click()}
                className="relative size-20 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 cursor-pointer group"
              >
                {/* Image or initials */}
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : user?.avatar ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_SITE_URL}/${user.avatar}`}
                    alt="Current avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl font-semibold">
                    {user?.first_name?.charAt(0)?.toUpperCase() ?? "?"}
                  </div>
                )}

                {/* Edit overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xl">
                  <FaRegEdit />
                </div>
              </div>
            </div>

            {/* First / Last Name */}
            <div className="flex gap-5 items-center">
              <div className="flex-1">
                <p className="form-label font-bold">First Name</p>
                <input
                  type="text"
                  className="form-input w-full"
                  placeholder="First Name"
                  {...register("first_name", {
                    required: "First name is required",
                  })}
                />
                {errors.first_name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.first_name.message}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <p className="form-label font-bold">Last Name</p>
                <input
                  type="text"
                  className="form-input w-full"
                  placeholder="Last Name"
                  {...register("last_name", {
                    required: "Last name is required",
                  })}
                />
                {errors.last_name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.last_name.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email (read-only) */}
            <div className="w-full">
              <p className="form-label font-bold">Email</p>
              <input
                type="email"
                className="form-input w-full opacity-60 cursor-not-allowed"
                placeholder="name@email.com"
                disabled
                {...register("email")}
              />
            </div>

            {/* Username */}
            <div className="w-full">
              <p className="form-label font-bold">Username</p>
              <input
                type="text"
                className="form-input w-full"
                placeholder="username"
                {...register("username", { required: "Username is required" })}
              />
              {errors.username && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Street Address */}
            <div className="w-full">
              <p className="form-label font-bold">Street Address</p>
              <input
                type="text"
                className="form-input w-full"
                placeholder="Street Name"
                {...register("street_address")}
              />
            </div>

            {/* Apt */}
            <div className="w-full">
              <p className="form-label font-bold">Apt/Unit #</p>
              <input
                type="text"
                className="form-input w-full"
                placeholder="1234"
                {...register("apt")}
              />
            </div>

            {/* City */}
            <div className="w-full">
              <p className="form-label font-bold">City</p>
              <input
                type="text"
                className="form-input w-full"
                placeholder="City"
                {...register("city")}
              />
            </div>

            {/* State */}
            <div className="w-full">
              <p className="form-label font-bold">State</p>
              <input
                type="text"
                className="form-input w-full"
                placeholder="State"
                {...register("state")}
              />
            </div>

            {/* Zip Code */}
            <div className="w-full">
              <p className="form-label font-bold">Zip Code</p>
              <input
                type="text"
                className="form-input w-full"
                placeholder="123456"
                {...register("postal_code")}
              />
              {errors.postal_code && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.postal_code.message}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-x-3 mt-10">
        <button
          type="submit"
          form="settings-form"
          disabled={isPending}
          className="auth-secondary-btn disabled:cursor-not-allowed disabled:opacity-70 disabled:animate-pulse"
        >
          {isPending ? "Saving..." : "Update Settings"}
        </button>
        <button
          type="button"
          className="auth-secondary-btn"
          onClick={() => setModalType("logout")}
        >
          Logout
        </button>
        <button
          type="button"
          className="auth-secondary-btn !bg-accent-red !border-accent-red"
          onClick={() => setModalType("delete")}
        >
          Delete Account
        </button>
      </div>

      {/* Confirmation Modal */}
      {modalType && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 bg-opacity-40 z-999">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-md text-center">
            <h3 className="text-xl font-semibold mb-4">
              {modalType === "logout"
                ? "Are you sure you want to log out?"
                : "Are you sure you want to delete your account?"}
            </h3>
            <p className="text-gray-600 mb-6">
              {modalType === "logout"
                ? "You will need to log in again to access your dashboard."
                : "This action cannot be undone. All your data will be permanently deleted."}
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-gray-200 px-4 py-2 rounded-lg cursor-pointer"
                onClick={() => setModalType(null)}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isDeleting || isLoading}
                className={`px-4 py-2 rounded-lg text-white cursor-pointer disabled:cursor-not-allowed disabled:animate-pulse disabled:opacity-70 ${
                  modalType === "logout" ? "bg-primary-green" : "bg-primary-red"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;
