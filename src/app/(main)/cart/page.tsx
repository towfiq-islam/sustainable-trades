import Container from "@/Components/Common/Container";
import PaymentOptions from "@/Components/cart/PaymentOptions";

const page = () => {
  return (
    <section className="mt-7 mb-10">
      <Container>
        <PaymentOptions />
      </Container>
    </section>
  );
};

export default page;
