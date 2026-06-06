"use client";
import React from "react";

interface OrderNoteProps {
  isOpen?: boolean;
  onClose: () => void;
  note?: string;
}

const EditOrderModal: React.FC<OrderNoteProps> = ({
  isOpen,
  onClose,
  note,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999]  bg-black/40 bg-opacity-50 px-5">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="flex items-center justify-center min-h-screen ">
        <div className="bg-white rounded-lg w-full max-w-xl p-3 md:p-6 relative">
          {/* Close Button */}
          <div className="flex justify-between py-1.5 md:py-3 border-b border-gray-300">
            <h3 className="text-[24px] font-normal text-[#000]">
              Shipping Details
            </h3>
            <button
              onClick={onClose}
              className=" text-gray-500 hover:text-gray-800 font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>

          <form className="space-y-1.5 md:space-y-3 mt-2.5 md:mt-5">
            {/* Full Name */}
            <div>
              <p className="form-label font-bold">
                Full Name <span className="text-primary-red">*</span>
              </p>
              <input
                type="text"
                className="form-input"
                placeholder="Amy Woods"
              />
            </div>
            <div>
              <p className="form-label font-bold">
                Country Name <span className="text-primary-red">*</span>
              </p>
              <select className="form-input">
                <option value="Country">Country</option>
                <option value="Bangladesh">Bangladesh</option>
                <option value="Paris">Paris</option>
                <option value="Australia">Australia</option>
              </select>
            </div>
            <div>
              <p className="form-label font-bold">
                Street Address <span className="text-primary-red">*</span>
              </p>
              <input
                type="text"
                className="form-input"
                placeholder="123 Hollywood Avenue"
              />
            </div>
            <div>
              <p className="form-label font-bold">
                Apt / Suite / Other (Optional)
              </p>
              <input
                type="text"
                className="form-input"
                placeholder="Apt / Suite / Other (Optional)"
              />
            </div>
            <div className="flex md:gap-5 flex-col md:flex-row md:justify-between ">
              <div className="w-full">
                <p className="form-label font-bold">
                  City <span className="text-primary-red">*</span>
                </p>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Los Angeles"
                />
              </div>
              <div className="w-full">
                <p className="form-label font-bold">
                  Zip Code <span className="text-primary-red">*</span>
                </p>
                <input type="text" className="form-input" placeholder="1205" />
              </div>
            </div>
            <div>
              <p className="form-label font-bold">
                State <span className="text-primary-red">*</span>
              </p>
              <select className="form-input">
                <option value="State">State</option>
                <option value="Bangladesh">Dhaka Highway</option>
                <option value="Paris">Avenue des Champs-Élysées</option>
                <option value="Australia">George Street</option>
              </select>
            </div>
          </form>
          <div className="mt-2.5 md:mt-5">
            <button className="auth-secondary-btn w-full" onClick={onClose}>
              Save and Continue
            </button>
          </div>
        </div>
      </div>

      <div className="text-gray-700 text-sm">
        {note ? <p>{note}</p> : <p>No order note available.</p>}
      </div>
    </div>
  );
};

export default EditOrderModal;
