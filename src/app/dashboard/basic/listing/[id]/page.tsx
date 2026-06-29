import UpdateListing from "@/Components/PageComponents/dashboardPages/createListingComponents/UpdateListing";

const page = ({ params }: { params: Promise<{ id: string }> }) => {
  return <UpdateListing variant="basic" params={params} />;
};

export default page;
