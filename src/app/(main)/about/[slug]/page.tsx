import Banner from "@/Components/Common/Banner";
import Container from "@/Components/Common/Container";
import { getDynamicPages, getSingleDynamicPage } from "@/Hooks/api/cms_api";
import AboutUsTab from "@/Components/Common/AboutUsTab";

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

      <section className="mb-10 lg:mb-40 mt-10 lg:mt-20">
        <Container>
          <div className="flex flex-col lg:flex-row items-start gap-5 lg:gap-14">
            {/* Left - Tabs */}
            <AboutUsTab dynamicPage={dynamicPage?.data} />

            {/* Right - Content */}
            <div className="grow">
              {/* Page Title */}
              <h2 className="text-xl md:text-3xl font-semibold text-secondary-black mb-2.5 md:mb-5">
                {pageData?.data?.page_title}
              </h2>

              {/* Page Content */}
              <div
                dangerouslySetInnerHTML={{
                  __html: pageData?.data?.page_content,
                }}
                className="text-secondary-gray leading-8 max-w-[900px] [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:pl-5 [&_ol]:list-decimal"
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default page;
