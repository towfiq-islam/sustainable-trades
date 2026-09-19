"use client";
import Link from "next/link";
import Image from "next/image";
import useAuth from "@/Hooks/useAuth";
import setupBg from "@/Assets/shop_frame.png";
import Container from "@/Components/Common/Container";

const page = () => {
  const { user } = useAuth();

  return (
    <div className="pt-10 pb-20">
      <Container>

        <Image src={setupBg} alt="setup" unoptimized className="mx-auto my-9" />

        <p className="text-lg text-secondary-gray font-medium text-center max-w-[700px] w-full mx-auto">
          Now that we have your preferences all sorted out, it's time to unveil
          your amazing selection of products!
        </p>

        <div className="lg:flex justify-center gap-x-10 items-center mt-9">
          <Link
            href={`${
              user?.membership?.membership_type === "basic"
                ? "/dashboard/basic/home"
                : "/dashboard/pro/home"
            }`}
            className="auth-primary-btn w-full md:w-fit"
          >
            Go to Dashboard
          </Link>

          <Link
            href={`${
              user?.membership?.membership_type === "basic"
                ? "/dashboard/basic/create-listing"
                : "/dashboard/pro/create-listing"
            }`}
            className="auth-secondary-btn md:mt-0 mt-3 w-full md:w-fit"
          >
            Add First Listing
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default page;
