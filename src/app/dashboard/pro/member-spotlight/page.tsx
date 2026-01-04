import Community from "@/app/(main)/community-member-spotlight/page";
import SpotlightButton from "./_Components/SpotlightButton";

const page = () => {
  return (
    <>
      <SpotlightButton isPro={true} />
      <Community />
    </>
  );
};

export default page;
