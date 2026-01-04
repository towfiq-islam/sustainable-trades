import Community from "@/app/(main)/community-member-spotlight/page";
import SpotlightButton from "../../pro/member-spotlight/_Components/SpotlightButton";

const page = () => {
  return (
    <>
      <SpotlightButton isPro={false} />
      <Community />
    </>
  );
};

export default page;
