"use client";
import { useState } from "react";
import Modal from "@/Components/Common/Modal";
import MembershipApplicationModal from "@/Components/Modals/MembershipApplicationModal";
import DashBoardHeader from "@/Components/Common/DashBoardHeader";

const SpotlightButton = ({ isPro }: { isPro: boolean }) => {
  const [isOpen, setOpen] = useState<boolean>(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
        <DashBoardHeader heading=" Member Spotlight" />

        {isPro && (
          <button
            onClick={() => setOpen(true)}
            className="py-2.5 2xl:py-4 px-4 2xl:px-6 bg-off-green rounded-[8px] border border-light-green text-sm 2xl:text-[16px] font-semibold text-secondary-black cursor-pointer hover:translate-y-1 duration-300 ease-in-out h-[45px] 2xl:h-[50px] w-full sm:w-fit flex items-center justify-center"
          >
            Apply for Community Member Spotlight
          </button>
        )}
      </div>

      {/* Modal */}
      <Modal open={isOpen} onClose={() => setOpen(false)}>
        <MembershipApplicationModal setOpen={setOpen} />
      </Modal>
    </>
  );
};

export default SpotlightButton;
