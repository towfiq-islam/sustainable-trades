import { paymentData } from "@/Components/Data/data";
import PaymentTableReusable from "./PaymentTableReusable";

const PendingPaymnet = () => {
  const pendingpayment = paymentData.filter(data => data.status === "Pending");

  return <PaymentTableReusable data={pendingpayment} itemsPerPage={5} />;
};

export default PendingPaymnet;
