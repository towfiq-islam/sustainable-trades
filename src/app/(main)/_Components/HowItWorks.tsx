import Link from "next/link";
import Image from "next/image";
import Container from "@/Components/Common/Container";
import { getHowItWorksData } from "@/Hooks/cms.api";

type workItem = {
  id: number;
  title: string;
  description: string;
  image: string;
};

const HowItWorks = async () => {
  const howItWorksData = await getHowItWorksData();

  return (
    <section id="how-it-works" className="py-10 md:py-20">
      <Container>
        <h2 className="section_title text-center">How It Works</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2  xl:grid-cols-3 gap-10 text-center mb-10">
          {howItWorksData?.data?.map((item: workItem) => (
            <div key={item?.id} className="space-y-3">
              <figure className="size-15 lg:size-24 xl:size-40 mx-auto relative">
                <Image
                  src={`${process.env.NEXT_PUBLIC_SITE_URL}/${item?.image}`}
                  alt="logo"
                  className="size-full object-cover"
                  fill
                />
              </figure>

              <h3 className="text-xl md:text-3xl font-semibold text-primary-green">
                {item?.title}
              </h3>

              <p className="md:text-lg text-primary-green">
                {item?.description}
              </p>
            </div>
          ))}
        </div>

        <Link
          href="#membership_plan"
          className="md:w-[416px] text-center hover:bg-primary-green hover:text-white duration-500 transition-all mx-auto block border text-lg text-secondary-black cursor-pointer py-2 md:py-4 rounded-lg shadow-lg hover:scale-105"
        >
          View Membership Plans
        </Link>
      </Container>
    </section>
  );
};

export default HowItWorks;
