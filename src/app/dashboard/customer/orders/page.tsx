import OrdersList from "@/Components/PageComponents/dashboardPages/Orders/OrdersList";

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
