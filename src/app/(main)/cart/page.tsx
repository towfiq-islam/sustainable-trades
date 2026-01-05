"use client";
import { getProductCart } from "@/Hooks/api/cms_api";
import PrivateLayout from "@/Private/PrivateLayout";
import Container from "@/Components/Common/Container";
import PaymentOptions from "@/Components/PageComponents/mainPages/cartPageComponents/PaymentOptions";
import ShopLocation from "@/Components/PageComponents/mainPages/cartPageComponents/ShopLocation";


const page = () => {
  const { data: cartData } = getProductCart();

  return (
    <PrivateLayout>
      <section className="my-10">
        <Container>
          <PaymentOptions />
          <ShopLocation cartData={cartData?.data} />
        </Container>
      </section>
    </PrivateLayout>
  );
};

export default page;
