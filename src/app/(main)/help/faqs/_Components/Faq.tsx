"use client";
import { useState } from "react";
import Banner from "@/Components/Common/Banner";
import Container from "@/Components/Common/Container";
import HelpUsTab from "@/Components/Common/HelpUsTab";

type faqItem = {
  id: number;
  question: string;
  answer: string;
};

interface Props {
  data: {
    banner: {
      image: string;
    };
    faqs: faqItem[];
  };
}

const Faq = ({ data }: Props) => {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(1);

  const toggleAccordion = (id: number) => {
    setActiveAccordion(prev => (prev === id ? null : id));
  };

  return (
    <>
      <Banner
        title="FAQs"
        bgImg={`${process.env.NEXT_PUBLIC_SITE_URL}/${data?.banner?.image}`}
      />

      <section className="mb-14 lg:mb-40 mt-10 lg:mt-20">
        <Container>
          <div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-14">
            {/* Left - Tabs */}
            <HelpUsTab />

            {/* Right */}
            <div className="grow px-2.5 sm:px-0">
              {data?.faqs?.map((item: faqItem) => (
                <div
                  key={item?.id}
                  className="border-b-2 border-gray-200 py-4 cursor-pointer"
                  onClick={() => toggleAccordion(item?.id)}
                >
                  {/* Question */}
                  <div className="flex justify-between items-center">
                    <h3 className=" sm:text-lg lg:text-xl font-semibold text-secondary-black">
                      {item?.question}
                    </h3>
                    <span className="text-lg md:text-xl lg:text-2xl text-secondary-black">
                      {activeAccordion === item.id ? "⨯" : "+"}
                    </span>
                  </div>

                  {/* Answer */}
                  <div
                    className={`px-3 transition-all duration-300 overflow-hidden ${
                      activeAccordion === item.id
                        ? "max-h-96 opacity-100 mt-2"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-secondary-gray md:text-base text-sm lg:text-[17px]">
                      {item?.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default Faq;
