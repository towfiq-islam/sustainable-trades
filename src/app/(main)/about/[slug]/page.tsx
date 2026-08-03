import Banner from "@/Components/Common/Banner";
import Container from "@/Components/Common/Container";
import AboutUsTab from "@/Components/Common/AboutUsTab";
import { getDynamicPages, getSingleDynamicPage } from "@/lib/cms.api";

const page = async ({ params }: any) => {
  const { slug } = await params;
  const dynamicPage = await getDynamicPages();
  const pageData = await getSingleDynamicPage(slug);

  return (
    <>
      <Banner
        title={pageData?.data?.page_title}
        bgImg={`${process.env.NEXT_PUBLIC_SITE_URL}/${pageData?.data?.page_image}`}
      />

      <section className="lg:mb-40 lg:mt-20">
        <Container>
          <div className="flex flex-col lg:flex-row items-start gap-5 lg:gap-10 2xl:gap-14">
            {/* Left - Tabs */}
            <AboutUsTab dynamicPage={dynamicPage?.data} />

            {/* Right - Content */}
            <div className="grow">
              {/* Page Title */}
              <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold text-secondary-black mb-2.5 md:mb-5">
                {pageData?.data?.page_title}
              </h2>

              {/* Page Content */}
              <div
                dangerouslySetInnerHTML={{
                  __html: pageData?.data?.page_content,
                }}
                className="text-secondary-gray text-sm lg:text-base leading-8 max-w-[900px] [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:pl-5 [&_ol]:list-decimal"
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default page;
