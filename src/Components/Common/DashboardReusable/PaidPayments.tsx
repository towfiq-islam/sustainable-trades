import { paymentData } from "@/Components/Data/data";
import PaymentTableReusable from "./PaymentTableReusable";

const PaidPayments = () => {
  const paidpayementsdata = paymentData.filter(paid => paid.status === "Paid");
  return <PaymentTableReusable data={paidpayementsdata} itemsPerPage={5} />;
};

export default PaidPayments;
