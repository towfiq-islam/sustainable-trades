import Spotlight from "./_Components/Spotlight";
import SpotlightButton from "./_Components/SpotlightButton";

const page = () => {
  return (
    <>
      <SpotlightButton isPro={true} />
      <Spotlight />
    </>
  );
};

export default page;
