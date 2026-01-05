"use client";
import Link from "next/link";
import useAuth from "@/Hooks/useAuth";
import { MdArrowOutward } from "react-icons/md";

const Header = () => {
  const { user } = useAuth();
  const membershipType = user?.membership?.membership_type || "basic";
  const isBasicMember = membershipType.toLowerCase() === "basic";
  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      {/* Left Section */}
      <div>
        <h3 className="text-[30px] md:text-[40px] font-semibold text-[#13141D]">
          Create New Listing
        </h3>
        <div className="flex gap-x-2 items-center pt-2 cursor-pointer">
          <h4 className="text-[16px] text-[#13141D]">Listings</h4>
          <span className="mt-1 inline-block w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#13141D] rotate-90"></span>
          <h5 className="text-[16px] text-[#13141D]">Add a Listing</h5>
        </div>
      </div>

      {/* Right Section - Conditional Button */}

      <Link
        href={
          isBasicMember
            ? "/dashboard/basic/listing"
            : "/dashboard/pro/view-listing"
        }
      >
        <button className="text-[#000] text-[16px] font-semibold flex gap-x-1 items-center border-2 border-[#13141D] rounded-lg py-3 px-6 hover:bg-[#E48872] hover:text-white duration-300 cursor-pointer">
          <MdArrowOutward />
          View Listings
        </button>
      </Link>
    </div>
  );
};

export default Header;
