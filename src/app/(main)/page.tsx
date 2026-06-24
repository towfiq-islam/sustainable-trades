import { Suspense } from "react";
import HomeBanner from "./_Components/HomeBanner";
import HowItWorks from "./_Components/HowItWorks";
import MagicMarkers from "./_Components/MagicMarkers";
import FeaturedShops from "./_Components/FeaturedShop";
import ExploreProduct from "./_Components/ExploreProduct";
import OurMission from "./_Components/OurMission";
import CommunityMember from "./_Components/CommunityMember";
import Pricing from "./_Components/Pricing";
import Subscribe from "./_Components/Subscribe";
import { getSpotlightData } from "@/Hooks/api/cms_api";
import GetUserLocation from "@/lib/GetUserLocation";

const Page = async () => {
  const spotlightData = await getSpotlightData();

  return (
    <>
      <HomeBanner />

      <Suspense fallback={"Loading...."}>
        <HowItWorks />
      </Suspense>

      <Suspense fallback={"Loading...."}>
        <MagicMarkers />
      </Suspense>

      <FeaturedShops />

      <Suspense fallback={"Loading...."}>
        <ExploreProduct />
      </Suspense>

      <Suspense fallback={"Loading...."}>
        <OurMission />
      </Suspense>

      <Suspense fallback={"Loading...."}>
        <CommunityMember data={spotlightData?.data} has_community={true} />
      </Suspense>

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
