import { getSpotlightData } from "@/lib/cms.api";
import MemberSpotlight from "./MemberSpotlight";

const CommunityMember = async () => {
  const spotlightData = await getSpotlightData();
  return <MemberSpotlight data={spotlightData?.data} has_community={true} />;
};

export default CommunityMember;
