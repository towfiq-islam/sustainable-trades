import CounterTrades from "@/Components/Common/DashboardReusable/CounterTrades";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return <CounterTrades id={id} />;
};

export default page;
