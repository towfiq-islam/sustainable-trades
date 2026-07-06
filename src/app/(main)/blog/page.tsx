import Container from "@/Components/Common/Container";
import { getBlogs } from "@/lib/cms.api";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";

type blogItem = {
  id: number;
  image: string;
  title: string;
  created_at: string;
};

const page = async () => {
  const blogs = await getBlogs();

  return (
    <section className="py-10 lg:py-14">
      <Container>
        <h3 className="section_title text-center">All Blogs</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 2xl:gap-6 w-full">
          {blogs?.data?.map((blog: blogItem, idx: number) => (
            <div
              key={idx}
              className="group rounded-2xl sm:rounded-3xl bg-white group"
            >
              <figure className="rounded-2xl sm:rounded-3xl w-full h-32 sm:h-50 lg:h-63 2xl:h-85 overflow-hidden mb-3 sm:mb-4 relative">
                <Image
                  src={`${process.env.NEXT_PUBLIC_SITE_URL}/${blog.image}`}
                  alt={blog?.title}
                  fill
                  className="w-full h-full object-cover group-hover:scale-105 duration-500 transition-transform"
                />
              </figure>

              <div className="sm:px-2 pb-3 sm:pb-4">
                <h3 className="font-semibold text-[#333] text-[15px] sm:text-base xl:text-lg line-clamp-2 mb-2 sm:mb-4">
                  {blog?.title}
                </h3>

                <div className="flex justify-between items-center text-xs sm:text-sm text-secondary-gray font-medium">
                  <span>{moment(blog?.created_at).format("LL")}</span>

                  <Link
                    href={`/blog-details/${blog?.id}`}
                    className="text-primary-pink capitalize font-semibold underline"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default page;
