"use client";
import { useState } from "react";
import Banner from "@/Components/Common/Banner";
import Container from "@/Components/Common/Container";
import HelpUsTab from "@/Components/Common/HelpUsTab";
import { SearchSvg } from "@/Components/Svg/SvgContainer";
import { useGetTutorialsQuery } from "@/redux/api/shopApi";

type videoItem = {
  id: number;
  video: string;
  name: string;
  description: string;
};

const page = () => {
  // States
  const [search, setSearch] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("owner");

  // Queries
  const { data: tutorialsData, isLoading } = useGetTutorialsQuery({
    search,
    type: activeTab,
  });

  return (
    <>
      <Banner
        title="How-To Tutorials"
        bgImg={`${process.env.NEXT_PUBLIC_SITE_URL}/${tutorialsData?.data?.banner?.image}`}
      />

      <section className="mb-15 lg:mb-40 mt-10 lg:mt-20">
        <Container>
          <div className="flex flex-col lg:flex-row items-start gap-5 md:gap-14">
            {/* Left - Tabs */}
            <HelpUsTab />

            {/* Right */}
            <div className="w-full md:grow">
              {/* Upper Part */}
              <div className="flex flex-col sm:flex-row lg:justify-between items-center gap-4 sm:gap-0 mb-5 md:mb-10 ">
                {/* Title */}
                <h2 className="text-primary-green text-xl md:text-2xl lg:text-3xl  xl:text-4xl font-semibold w-full">
                  How-To Tutorials
                </h2>

                {/* Search bar */}
                <div className="flex justify-end gap-1 items-center border border-gray-400 px-2 py-1 md:py-2 rounded-[6px] w-full md:w-[280px]">
                  <SearchSvg />
                  <input
                    type="text"
                    placeholder="Search Tutorials..."
                    className="w-full border-none outline-none"
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Video Tabs */}
              <div className="flex gap-5 items-center mb-12">
                <button
                  onClick={() => setActiveTab("owner")}
                  className={`text-sm md:text-lg cursor-pointer px-10 pb-1${
                    activeTab === "owner"
                      ? "text-primary-green font-semibold border-b-2 border-primary-green"
                      : "text-gray-500"
                  }`}
                >
                  Shop Owners
                </button>

                <button
                  onClick={() => setActiveTab("buyer")}
                  className={`text-sm md:text-lg cursor-pointer px-10 pb-1  ${
                    activeTab === "buyer"
                      ? "text-primary-green font-semibold border-b-2 border-primary-green"
                      : "text-gray-500"
                  }`}
                >
                  Buyers
                </button>
              </div>

              {/* Maps */}
              <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="border border-[#CBC8C2] rounded-lg animate-pulse"
                    >
                      <div className="w-full h-[200px] bg-gray-300 rounded-t-lg"></div>
                      <div className="p-5 space-y-3">
                        <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  ))
                ) : tutorialsData?.data?.tutorials?.length === 0 ? (
                  <p className="text-lg font-medium text-red-500">
                    No Data found!!
                  </p>
                ) : (
                  tutorialsData?.data?.tutorials?.map((item: videoItem) => (
                    <div
                      key={item?.id}
                      className="border border-[#CBC8C2] rounded-lg"
                    >
                      <video
                        controls
                        src={`${process.env.NEXT_PUBLIC_SITE_URL}/${item?.video}`}
                        className="w-full h-[200px] rounded-t-lg object-cover"
                      ></video>

                      <div className="p-2.5 md:p-5">
                        <h3 className="text-secondary-gray md:text-lg lg:text-xl font-semibold md:mb-2">
                          {item?.name}
                        </h3>
                        <p className="text-[#595753] text-sm md:text-base">
                          {item?.description}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default page;
