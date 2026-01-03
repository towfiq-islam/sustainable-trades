import PaymentTableReusable from "./PaymentTableReusable";
import { paymentData } from "@/Components/Data/data";

const AllPaymentTable = () => {
  return <PaymentTableReusable data={paymentData} itemsPerPage={5} />;
};

export default AllPaymentTable;
