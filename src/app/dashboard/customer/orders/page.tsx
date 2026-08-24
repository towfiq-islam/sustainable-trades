import OrdersList from "@/Components/order/OrdersList";

const page = () => {
  return (
    <OrdersList
      role="customer"
      showHeader={true}
      showTabs={true}
      orderBasePath="/dashboard/customer/orders"
    />
  );
};

export default page;
