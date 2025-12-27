"use client";
import { getProductCart } from "@/Hooks/api/cms_api";
import PrivateLayout from "@/Private/PrivateLayout";
import Container from "@/Components/Common/Container";
import PaymentOptions from "@/Components/PageComponents/mainPages/cartPageComponents/PaymentOptions";
import ShopLocation from "@/Components/PageComponents/mainPages/cartPageComponents/ShopLocation";

const page = () => {
  const { data: cartData, isLoading } = getProductCart();

  return (
    <PrivateLayout>
      <section className="my-10">
        <Container>
          <PaymentOptions data={cartData?.data} isLoading={isLoading} />
          <ShopLocation cartData={cartData?.data} />
        </Container>
      </section>
    </PrivateLayout>
  );
};

export default page;
