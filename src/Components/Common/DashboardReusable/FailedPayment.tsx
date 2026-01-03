import { paymentData } from "@/Components/Data/data";
import PaymentTableReusable from "./PaymentTableReusable";

const FailedPayment = () => {
  const failedpaymentdata = paymentData.filter(
    failed => failed.status === "Failed"
  );
  return <PaymentTableReusable data={failedpaymentdata} itemsPerPage={5} />;
};

export default FailedPayment;
