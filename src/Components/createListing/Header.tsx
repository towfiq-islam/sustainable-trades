"use client";
import { GoBackSvg } from "@/Components/Svg/SvgContainer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdArrowOutward } from "react-icons/md";

const Header = ({ isBasicMember }: { isBasicMember: boolean }) => {
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => router.back()}
        className="flex gap-1 items-center cursor-pointer font-semibold text-primary-green mb-1 group"
      >
        <span className="group-hover:-translate-x-1 duration-300 transition-transform">
          <GoBackSvg />
        </span>
        <span>Back</span>
      </button>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className="text-3xl font-semibold text-secondary-black">
          Create New Listing
        </h3>

        <Link
          href={
            isBasicMember
              ? "/dashboard/basic/listing"
              : "/dashboard/pro/listing"
          }
        >
          <button className="text-accent-red font-semibold flex gap-x-1 items-center border-2 border-accent-red rounded-lg py-1.5 md:py-3 px-6 hover:bg-accent-red hover:text-white duration-300 cursor-pointer">
            <MdArrowOutward />
            View Listings
          </button>
        </Link>
      </div>
    </>
  );
};

export default Header;
