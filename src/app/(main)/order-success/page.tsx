"use client";
import Container from "@/Components/Common/Container";
import { useGetOrderDetailsQuery } from "@/redux/api/ordersApi";
import { use } from "react";

type Props = {
  searchParams: Promise<{ order_id: number; shop_id: number }>;
};

export default function Page({ searchParams }: Props) {
  const { order_id } = use(searchParams);
  const { data: singleOrder, isLoading } = useGetOrderDetailsQuery(order_id);
  console.log(singleOrder);

  return (
    <section className="py-12">
      <Container>Order confirm page</Container>
    </section>
  );
}
