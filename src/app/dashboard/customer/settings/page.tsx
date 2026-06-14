"use client";
import { useLogout, useUpdateUser } from "@/Hooks/api/auth_api";
import { useDeleteAccount } from "@/Hooks/api/dashboard_api";
import useAuth from "@/Hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const Settings = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(false);
  const [language, setLanguage] = useState(false);
  const [cookies, setCookies] = useState(false);
  const [modalType, setModalType] = useState<
    "logout" | "delete" | "update" | null
  >(null);
  console.log(user);

  // API hooks
  const logoutMutation = useLogout();
  const deleteMutation = useDeleteAccount();
  const { mutate: updateUser, isPending } = useUpdateUser();

  // Sync state with user data
  useEffect(() => {
    if (user) {
      setNotifications(user.is_push_notifications === 1);
      setLanguage(user.language?.toLowerCase() === "spanish");
      setCookies(user.is_cookies === 1);
    }
  }, [user]);

  const handleConfirm = () => {
    if (modalType === "logout") {
      logoutMutation.mutate(undefined, {
        onSuccess: () => {
          router.push("/auth/login");
        },
      });
    } else if (modalType === "delete") {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          router.push("/auth/login");
        },
      });
    }
    setModalType(null);
  };

  return (
    <>
      <h2 className="text-[30px] md:text-[40px] font-lato font-semibold text-black">
        Settings
      </h2>

      <div className="lg:mt-6 flex flex-col-reverse lg:flex-row gap-x-[72.5px] xl:gap-x-[145px]">
        {/* Left Form */}
        <div className="mt-5 lg:mt-0 lg:w-1/2">
          <form className="flex flex-col gap-3">
            <div className="flex gap-5 items-center">
              <div className="flex-1">
                <p className="form-label font-bold">First Name</p>
                <input
                  type="text"
                  className="form-input w-full"
                  placeholder="Name"
                  defaultValue={user?.first_name}
                />
              </div>
              <div className="flex-1">
                <p className="form-label font-bold">Last Name</p>
                <input
                  type="text"
                  className="form-input w-full"
                  placeholder="Name"
                  defaultValue={user?.last_name}
                />
              </div>
            </div>

            <div className="w-full">
              <p className="form-label font-bold">Email</p>
              <input
                type="text"
                className="form-input w-full"
                placeholder="name@email.com"
                defaultValue={user?.email}
              />
            </div>

            <div className="w-full">
              <p className="form-label font-bold">Street Name</p>
              <input
                type="text"
                className="form-input w-full"
                placeholder="Street Name"
                defaultValue={user?.shop_info?.shop_name || ""}
              />
            </div>
            <div className="w-full">
              <p className="form-label font-bold">Apt/Unit #</p>
              <input
                type="text"
                className="form-input w-full"
                placeholder="1234"
                defaultValue={user?.shop_info?.address?.address_line_1 || ""}
              />
            </div>
            <div className="w-full">
              <p className="form-label font-bold">City/State</p>
              <input
                type="text"
                className="form-input w-full"
                placeholder="City/State"
                defaultValue={user?.shop_info?.address?.state || ""}
              />
            </div>
            <div className="w-full">
              <p className="form-label font-bold">Zip Code</p>
              <input
                type="text"
                className="form-input w-full"
                placeholder="123456"
                defaultValue={user?.shop_info?.address?.postal_code || ""}
              />
            </div>
          </form>
        </div>

        {/* Right Toggles */}
        {/* <div className="flex justify-end shrink-0">
          <div className="w-full mt-5 lg:mt-20 flex flex-col gap-y-5 lg:gap-y-10">
            <Toggle
              label="Push Notifications"
              left="OFF"
              right="ON"
              enabled={notifications}
              onToggle={() => setNotifications(!notifications)}
            />

            <Toggle
              label="Language"
              left="English"
              right="Spanish"
              enabled={language}
              onToggle={() => setLanguage(!language)}
            />

            <Toggle
              label="Enable Cookies"
              left="OFF"
              right="ON"
              enabled={cookies}
              onToggle={() => setCookies(!cookies)}
            />
          </div>
        </div> */}
      </div>

      {/* Bottom Buttons */}
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-x-3 mt-10">
        <button
          disabled={isPending}
          className="auth-secondary-btn sm:w-[150px] disabled:cursor-not-allowed disabled:opacity-70 disabled:animate-pulse"
          onClick={() => updateUser()}
        >
          Update Settings
        </button>
        <button
          className="auth-secondary-btn"
          onClick={() => setModalType("logout")}
        >
          Logout
        </button>
        <button
          className="auth-secondary-btn !bg-accent-red !border-accent-red"
          onClick={() => setModalType("delete")}
        >
          Delete Account
        </button>
      </div>

      {/* Confirmation Modal */}
      {modalType && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 bg-opacity-40 z-50">
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
                className={`px-4 py-2 rounded-lg text-white cursor-pointer ${
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
