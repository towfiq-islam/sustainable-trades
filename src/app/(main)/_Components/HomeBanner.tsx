import { getBannerData } from "@/Hooks/api/cms_api";
import BannerSlider from "./BannerSlider";

const HomeBanner = async () => {
  const bannerData = await getBannerData();
  return <BannerSlider data={bannerData?.data} />;
};

export default HomeBanner;
