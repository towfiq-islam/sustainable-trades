"use client";
import Container from "@/Components/Common/Container";
import PaymentOptions from "@/Components/PageComponents/mainPages/cartPageComponents/PaymentOptions";
import ShopLocation from "@/Components/PageComponents/mainPages/cartPageComponents/ShopLocation";
import { useGetProductCartQuery } from "@/redux/api/cartApi";

const page = () => {
  const { data: cartData } = useGetProductCartQuery();

  return (
      <section className="my-10">
        <Container>
          <PaymentOptions />
          <ShopLocation cartData={cartData?.data} />
        </Container>
      </section>
  );
};

export default page;
