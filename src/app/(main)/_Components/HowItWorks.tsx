import Link from "next/link";
import Image from "next/image";
import Container from "@/Components/Common/Container";
import { getHowItWorksData } from "@/lib/cms.api";

type workItem = {
  id: number;
  title: string;
  description: string;
  image: string;
};

const HowItWorks = async () => {
  const howItWorksData = await getHowItWorksData();

  return (
    <section id="how-it-works" className="pb-10 lg:py-10 xl:py-20">
      <Container>
        <h2 className="section_title text-center">How It Works</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 text-center mb-10">
          {howItWorksData?.data?.map((item: workItem) => (
            <div key={item?.id} className="space-y-3 md:space-y-5">
              <figure className="size-15 lg:size-24 xl:size-40 mx-auto relative">
                <Image
                  src={`${process.env.NEXT_PUBLIC_SITE_URL}/${item?.image}`}
                  alt="logo"
                  className="size-full object-cover"
                  fill
                />
              </figure>

              <h3 className="text-xl md:text-2xl 2xl:text-3xl font-semibold text-primary-green">
                {item?.title}
              </h3>

              <p className="2xl:text-lg text-primary-green">
                {item?.description}
              </p>
            </div>
          ))}
        </div>

        <Link
          href="#membership_plan"
          className="md:w-[416px] text-center hover:bg-primary-green hover:text-white duration-500 transition-all mx-auto block border border-gray-500 2xl:text-lg text-secondary-black cursor-pointer py-2 md:py-4 rounded-lg shadow-lg hover:scale-105"
        >
          View Membership Plans
        </Link>
      </Container>
    </section>
  );
};

export default HowItWorks;
