import {
  getBannerData,
  getHowItWorksData,
  getMissionData,
  getProductCategories,
  getSpotlightData,
} from "@/Hooks/api/cms_api";
import GetUserLocation from "@/lib/GetUserLocation";
import ExploreProduct from "@/Components/PageComponents/mainPages/homePageComponents/ExploreProduct";
import FeaturedShops from "@/Components/PageComponents/mainPages/homePageComponents/FeaturedShop";
import Pricing from "@/Components/PageComponents/mainPages/homePageComponents/Pricing";
import HomeBanner from "@/Components/PageComponents/mainPages/homePageComponents/HomeBanner";
import HowItWorks from "@/Components/PageComponents/mainPages/homePageComponents/HowItWorks";
import OurMission from "@/Components/PageComponents/mainPages/homePageComponents/OurMission";
import Subscribe from "@/Components/PageComponents/mainPages/homePageComponents/Subscribe";
import MagicMarkers from "@/Components/PageComponents/mainPages/homePageComponents/MagicMarkers";
import CommunityMember from "@/Components/PageComponents/mainPages/homePageComponents/CommunityMember";

const Page = async () => {
  const bannerData = await getBannerData();
  const howItWorksData = await getHowItWorksData();
  const missionData = await getMissionData();
  const productCategories = await getProductCategories();
  const spotlightData = await getSpotlightData();

  return (
    <>
      <HomeBanner data={bannerData?.data} />
      <HowItWorks data={howItWorksData?.data} />
      <MagicMarkers />
      <FeaturedShops />
      <ExploreProduct data={productCategories?.data} />
      <OurMission data={missionData?.data} />
      <CommunityMember data={spotlightData?.data} has_community={true} />
      <Pricing
        description="No matter how you want to manage your shop, we got you covered!"
        button1="Annual Billing"
        button2="Monthly Billing"
      />
      <Subscribe />
      <GetUserLocation />
    </>
  );
};

export default Page;
