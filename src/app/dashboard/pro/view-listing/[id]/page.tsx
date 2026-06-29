import UpdateListing from "@/Components/PageComponents/dashboardPages/createListingComponents/UpdateListing";

const page = ({ params }: { params: Promise<{ id: string }> }) => {
  return <UpdateListing variant="pro" params={params} />;
};

export default page;
