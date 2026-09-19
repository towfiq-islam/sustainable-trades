"use client";
import Link from "next/link";
import Image from "next/image";
import useAuth from "@/Hooks/useAuth";
import setupBg from "@/Assets/shop_frame.png";
import Container from "@/Components/Common/Container";
import { FiArrowRight } from "react-icons/fi";

const page = () => {
  const { user } = useAuth();

  const dashboardUrl =
    user?.membership?.membership_type === "basic"
      ? "/dashboard/basic/home?shopCreated=true"
      : "/dashboard/pro/home?shopCreated=true";

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
            href={dashboardUrl}
            className="primary_btn !w-fit px-7 !inline-flex items-center justify-center gap-2 group"
          >
            <span>Go to Dashboard</span>
            <FiArrowRight className="text-lg group-hover:translate-x-1 duration-300 ease-in-out" />
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default page;
