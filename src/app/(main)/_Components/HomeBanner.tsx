import { getBannerData } from "@/lib/cms.api";
import BannerSlider from "./BannerSlider";

const HomeBanner = async () => {
  const bannerData = await getBannerData();
  return <BannerSlider data={bannerData?.data} />;
};

export default HomeBanner;
