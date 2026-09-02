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
    <section id="Shop_policies" className="mt-4 md:mt-8 lg:mt-16">
      <Container>
        <h2 className="section_sub_title !mb-5">Shop Policies</h2>

        <h3 className="text-sm sm:text-base md:text-lg  font-semibold text-secondary-black mb-2">
          Accepted Payment Methods
        </h3>

        <div className="flex gap-3 items-center">
          <ul className="list-disc capitalize list-inside font-semibold space-y-1">
            {data?.payment_methods?.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-secondary-black mt-5 mb-1">
          Returns/Exchanges
        </h3>

        <div className="text-secondary-gray text-xs sm:text-sm md:text-base">
          {data?.return_policy}
        </div>
      </Container>
    </section>
  );
};

export default ShopPolicies;
