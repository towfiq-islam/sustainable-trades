"use client";
import SingleOrder from "@/Components/order/SingleOrder";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const orderId = Number(params?.id);
  return <SingleOrder orderId={orderId} />;
};

export default Page;
