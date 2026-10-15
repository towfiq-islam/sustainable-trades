import React from "react";
import Container from "@/Components/Common/Container";

interface PolicyProps {
  data: {
    return_policy: string;
    payment_methods: string[];
  };
}

const ShopPolicies = ({ data }: PolicyProps) => {
  return (
    <section id="Shop_policies" className="mt-6 md:mt-10 lg:mt-16">
      <Container>
        <h2 className="section_sub_title !mb-3 sm:!mb-5">Shop Policies</h2>

        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-secondary-black mb-2">
          Accepted Payment Methods
        </h3>

        <div className="flex gap-3 items-center">
          <ul className="list-disc capitalize list-inside font-semibold space-y-1 text-xs sm:text-sm md:text-base text-secondary-black">
            {data?.payment_methods?.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-secondary-black mt-4 sm:mt-5 mb-1.5 sm:mb-2">
          Returns/Exchanges
        </h3>

        <div className="text-secondary-gray text-xs sm:text-sm md:text-base leading-relaxed">
          {data?.return_policy}
        </div>
      </Container>
    </section>
  );
};

export default ShopPolicies;
