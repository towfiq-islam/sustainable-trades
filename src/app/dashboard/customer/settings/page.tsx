"use client";

import { useLogout } from "@/Hooks/api/auth_api";
import { useDeleteAccount } from "@/Hooks/api/dashboard_api";
import useAuth from "@/Hooks/useAuth";
import React, { useState, useEffect } from "react";

const Settings = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(false);
  const [language, setLanguage] = useState(false);
  const [cookies, setCookies] = useState(false);
  const [modalType, setModalType] = useState<"logout" | "delete" | null>(null);

  // API hooks
  const logoutMutation = useLogout();
  const deleteMutation = useDeleteAccount();

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
          window.location.href = "/auth/login";
        },
      });
    } else if (modalType === "delete") {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          window.location.href = "/auth/login";
        },
      });
    }
    setModalType(null);
  };

  return (
    <>
      <h2 className="text-[30px] md:text-[40px] font-lato font-semibold text-[#000]">
        Settings
      </h2>

      <div className="lg:mt-6 flex flex-col-reverse lg:flex-row gap-x-[72.5px] xl:gap-x-[145px]">
        {/* Left Form */}
        <div className="mt-5 lg:mt-0 lg:w-1/2">
          <form className="flex flex-col gap-3">
            <div className="w-full">
              <p className="form-label font-bold">Name</p>
              <input
                type="text"
                className="form-input w-full"
                placeholder="Name"
                defaultValue={`${user?.first_name || ""} ${
                  user?.last_name || ""
                }`}
              />
            </div>
            <div className="w-full">
              <p className="form-label font-bold">Username</p>
              <input
                type="text"
                className="form-input w-full"
                placeholder="Name1234"
                defaultValue={user?.username || ""}
              />
            </div>
            <div className="w-full">
              <p className="form-label font-bold">Email</p>
              <input
                type="text"
                className="form-input w-full"
                placeholder="name@email.com"
                defaultValue={user?.email || ""}
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
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-x-10 mt-10">
        <button
          className="auth-secondary-btn sm:w-[150px]"
          onClick={() => setModalType("logout")}
        >
          Logout
        </button>
        <button
          className="auth-secondary-btn"
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
                  modalType === "logout" ? "bg-green-600" : "bg-red-600"
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

// Toggle Component (for reuse)
const Toggle = ({
  label,
  left,
  right,
  enabled,
  onToggle,
}: {
  label: string;
  left: string;
  right: string;
  enabled: boolean;
  onToggle: () => void;
}) => (
  <div className="flex items-center justify-between">
    <h3 className="text-[16px] font-semibold">{label}</h3>
    <div className="flex items-center gap-x-5">
      <span className="text-[16px] font-bold">{left}</span>
      <button
        type="button"
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition cursor-pointer ${
          enabled ? "bg-[#D4E2CB]" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      <span className="text-[16px] font-bold">{right}</span>
    </div>
  </div>
);
