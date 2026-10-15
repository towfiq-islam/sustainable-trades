"use client";
import { useState } from "react";
import Container from "@/Components/Common/Container";
import { UpperArrowSvg } from "@/Components/Svg/SvgContainer";

type faqItem = {
  id: number;
  question: string;
  answer: string;
};

interface FaqProps {
  data: faqItem[];
}

const ShopFAQ = ({ data }: FaqProps) => {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(1);

  const toggleAccordion = (id: number) => {
    setActiveAccordion(prev => (prev === id ? null : id));
  };

  return (
    <section className="pt-4 md:pt-6 lg:pt-12 pb-8 md:pb-12 lg:pb-20">
      <Container>
        <h2 className="section_sub_title !mb-2 md:!mb-4">FAQs</h2>

        <div className="divide-y-2 divide-gray-200">
          {data?.map(item => {
            const isOpen = activeAccordion === item.id;

            return (
              <div
                key={item.id}
                className="py-3 sm:py-4 cursor-pointer select-none"
                onClick={() => toggleAccordion(item?.id)}
              >
                {/* Question */}
                <div className="flex justify-between items-center gap-3">
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-primary-green">
                    {item?.question}
                  </h3>
                  <span
                    className={`text-xs sm:text-sm md:text-base text-secondary-black shrink-0 transition-transform duration-300 ease-in-out ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <UpperArrowSvg />
                  </span>
                </div>

                {/* Answer */}
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100 mt-2 sm:mt-3"
                      : "grid-rows-[0fr] opacity-0 mt-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-secondary-gray text-xs sm:text-sm md:text-base leading-relaxed">
                      {item?.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default ShopFAQ;
