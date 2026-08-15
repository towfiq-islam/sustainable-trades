import Container from "@/Components/Common/Container";
import HelpUsTab from "@/Components/Common/HelpUsTab";
import { getInfringementData } from "@/lib/cms.api";

const Page = async () => {
  const infringementData = await getInfringementData();

  return (
    <>
      <section className="mb-15 lg:mb-40 mt-10 lg:mt-20">
        <Container>
          <div className="flex flex-col lg:flex-row items-start gap-5 md:gap-14">
            {/* Left - Tabs */}
            <HelpUsTab />

            {/* Right */}
            <div className="grow px-2.5 sm:px-0">
              <div
                dangerouslySetInnerHTML={{
                  __html: infringementData?.data?.description,
                }}
                className="parsed_content"
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default Page;
