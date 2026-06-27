"use client";
import Link from "next/link";
import { MdArrowOutward } from "react-icons/md";

const Header = ({ isBasicMember }: { isBasicMember: boolean }) => {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div>
        <h3 className="text-[30px] md:text-[40px] font-semibold text-secondary-black">
          Create New Listing
        </h3>
        <div className="flex gap-x-2 items-center pt-2 cursor-pointer">
          <h4 className="text-[16px] text-secondary-black">Listings</h4>
          <span className="mt-1 inline-block w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-secondary-black rotate-90"></span>
          <h5 className="text-[16px] text-secondary-black">Add a Listing</h5>
        </div>
      </div>

      <Link
        href={
          isBasicMember
            ? "/dashboard/basic/listing"
            : "/dashboard/pro/view-listing"
        }
      >
        <button className="text-secondary-black font-semibold flex gap-x-1 items-center border-2 border-secondary-black rounded-lg py-3 px-6 hover:bg-accent-red hover:text-white duration-300 cursor-pointer hover:border-accent-red">
          <MdArrowOutward />
          View Listings
        </button>
      </Link>
    </div>
  );
};

export default Header;
