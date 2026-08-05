"use client";
import Container from "@/Components/Common/Container";
import PaymentOptions from "@/Components/PageComponents/mainPages/cartPageComponents/PaymentOptions";
import ShopLocation from "@/Components/PageComponents/mainPages/cartPageComponents/ShopLocation";

const page = () => {
  return (
    <section className="my-10">
      <Container>
        <PaymentOptions />
        {/* {cartData?.data?.total_cart_items && (
          <ShopLocation cartData={cartData?.data} />
        )} */}
      </Container>
    </section>
  );
};

export default page;
