import { getFAQ } from "@/Hooks/cms.api";
import Faq from "./_Components/Faq";

const page = async () => {
  const faqData = await getFAQ();
  return <Faq data={faqData?.data} />;
};

export default page;
