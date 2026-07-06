import Banner from "@/Components/Common/Banner";
import HelpUsTab from "@/Components/Common/HelpUsTab";
import Container from "@/Components/Common/Container";
import { getContactData } from "@/lib/cms.api";

const Page = async () => {
  const contactData = await getContactData();

  return (
    <>
      <Banner
        title="Contact"
        bgImg={`${process.env.NEXT_PUBLIC_SITE_URL}/${contactData?.data?.image}`}
      />

      <section className="mb-5 md:mb-10 lg:mb-40 mt-10 lg:mt-20">
        <Container>
          <div className="flex flex-col lg:flex-row items-start gap-5 lg:gap-14">
            {/* Left - Tabs */}
            <HelpUsTab />

            {/* Right */}
            <div className="grow px-2.5 sm:px-0">
              <div
                dangerouslySetInnerHTML={{
                  __html: contactData?.data?.description,
                }}
                className="text-secondary-gray leading-8 text-sm lg:text-base  xl:max-w-[900px] [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:pl-5 [&_ol]:list-decimal"
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default Page;
