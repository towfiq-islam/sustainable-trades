import Image from "next/image";
import Container from "@/Components/Common/Container";
import { getMissionData } from "@/Hooks/api/cms_api";

type missionItem = {
  id: number;
  name: string;
  image: string;
  description: string;
};

const OurMission = async () => {
  const missionData = await getMissionData();

  return (
    <section className="py-10 lg:py-20">
      <Container>
        {/* Title */}
        <h2 className="section_title text-center">Our Mission</h2>

        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-6">
          {missionData?.data?.map(
            ({ id, name, image, description }: missionItem, idx: number) => (
              <div
                key={id}
                className="bg-white shadow-[0_3px_8px_0_rgba(0,0,0,0.09),_0_3px_12px_0_rgba(0,0,0,0.10)] px-3 py-5 lg:px-5 lg:py-10 rounded-xl group relative overflow-hidden"
              >
                {/* Overlay */}
                <div className="absolute bg-[#F0EEE9] leading-[150%] w-full h-full inset-0 duration-800 transition-transform rounded-xl text-xs lg:sm xl:text-[17px] text-primary-green flex justify-center items-center px-1 xl:px-6 py-2 xl:py-5 text-center -translate-x-full group-hover:translate-x-0 z-10">
                  {description}
                </div>

                {/* Mission Image */}
                <figure className="mb-14 size-10 md:size-15 lg:size-24 xl:size-36 mx-auto relative">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SITE_URL}/${image}`}
                    alt="image"
                    fill
                    className="size-full"
                  />
                </figure>

                {/* Index */}
                <div className="flex gap-5 items-center">
                  <p className="text-base md:text-lg lg:text-3xl font-semibold text-primary-green">
                    {idx + 1}.
                  </p>

                  {/* Mission Name */}
                  <p className="text-primary-green text-sm md:text-base lg:text-xl font-semibold">
                    {name}
                  </p>
                </div>
              </div>
            ),
          )}
        </div>
      </Container>
    </section>
  );
};

export default OurMission;
