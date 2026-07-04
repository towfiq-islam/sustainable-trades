import Image from "next/image";
import moment from "moment";
import Container from "@/Components/Common/Container";
import { getSingleBlog } from "@/Hooks/cms.api";

const page = async ({ params }: any) => {
  const { id } = await params;
  const blogDetailsData = await getSingleBlog(id);

  return (
    <section className="pb-10 xl:pb-20 pt-3 xl:pt-5">
      <Container>
        <div className="max-w-6xl mx-auto">
          <span className="bg-primary-green text-white text-sm font-semibold px-5 py-2 rounded-full block w-fit mx-auto">
            Blog details
          </span>

          <h1 className="mt-4 mb-3 md:mb-4 text-lg md:text-2xl xl:text-3xl font-semibold text-[#333] text-center leading-[150%] max-w-4xl mx-auto">
            {blogDetailsData?.data?.title}
          </h1>

          <p className="text-sm text-secondary-gray text-center mb-7 lg:mb-10">
            {moment(blogDetailsData?.data?.created_at).format("LL")}
          </p>

          <figure className="h-70 md:h-85 lg:h-100 rounded-2xl md:rounded-3xl relative mb-5 md:mb-7 xl:mb-10">
            <Image
              src={`${process.env.NEXT_PUBLIC_SITE_URL}/${blogDetailsData?.data?.image}`}
              alt="blog"
              fill
              className="w-full h-full object-cover rounded-2xl md:rounded-3xl"
            />
          </figure>

          <p
            dangerouslySetInnerHTML={{
              __html: blogDetailsData?.data?.content,
            }}
            className="text-primary-gray text-[15px] md:text-base leading-[150%] sm:leading-[170%]"
          />
        </div>
      </Container>
    </section>
  );
};

export default page;
