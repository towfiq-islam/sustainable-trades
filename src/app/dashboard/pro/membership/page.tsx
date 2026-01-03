import Pricing from "@/Components/PageComponents/mainPages/homePageComponents/Pricing";

const page = () => {
  return (
    <Pricing
      description="No matter how you want to manage your shop, we got you covered!"
      button1="Annual Billing"
      button2="Monthly Billing"
      isCancel={true}
    />
  );
};

export default page;
