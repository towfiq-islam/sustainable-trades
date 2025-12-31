"use client";
import { RxCross2 } from "react-icons/rx";
import React, { ReactNode, useEffect } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

const Modal = ({ open, onClose, children }: ModalProps) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);
  if (!open) return null;

  return (
    <div className="fixed h-screen inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-[1px] mx-4 md:mx-0">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="relative z-10 w-full max-w-2xl max-h-[calc(100vh-50px)] overflow-y-auto side-scrollbar p-3 md:p-5 bg-white rounded-lg shadow-lg">
        {/* Modal Content */}
        {children}

        {/* Close btn */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 cursor-pointer grid place-items-center"
        >
          <RxCross2 className="text-xl text-black" />
        </button>
      </div>
    </div>
  );
};

export default Modal;
