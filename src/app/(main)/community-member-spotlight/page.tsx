import Link from "next/link";
import Image from "next/image";
import Container from "@/Components/Common/Container";
import { RightSvg } from "@/Components/Svg/SvgContainer";
import { getSpotlightData } from "@/Hooks/api/cms_api";

type SpotlightItem = {
  id: number;
  shop_name: string;
  image: string;
  created_at: string;
  name: string;
  shop_description: string;
  user: {
    shop_info: {
      id: number;
      user_id: number;
    };
  };
};

const Community = async () => {
  const spotlightData = await getSpotlightData();

  return (
    <section className="py-5 md:py-10">
      <Container>
        <div className="space-y-6">
          {spotlightData?.data?.map((item: SpotlightItem) => (
            <div
              key={item?.id}
              className="rounded-xl flex flex-col lg:flex-row lg:items-center border border-gray-300"
            >
              {/* Left - Spotlight Image */}
              <figure className="w-full lg:w-[229px] h-[300px] lg:h-[230px] shrink-0 rounded-l-xl relative">
                <Image
                  src={`${process.env.NEXT_PUBLIC_SITE_URL}/${item?.image}`}
                  alt={item?.shop_name}
                  fill
                  unoptimized
                  className="w-full h-full rounded-tl-xl rounded-tr-xl lg:rounded-tr-none lg:rounded-l-xl object-cover"
                />
              </figure>

              {/* Right */}
              <div className="lg:grow px-4 py-2">
                <div className="flex flex-col sm:flex-row md:justify-between md:items-center">
                  {/* Shop Name */}
                  <h3 className="tracking-[0.2px] font-semibold text-secondary-gray text-xl mb-1">
                    {item.shop_name}
                  </h3>

                  {/* Date */}
                  <p className="text-secondary-gray text-sm">
                    <span className="font-semibold">Feature Date: </span>
                    <span>
                      {new Date(item?.created_at).toLocaleDateString()}
                    </span>
                  </p>
                </div>

                {/* Shop Owner */}
                <p className="mb-3 text-[14px] md:text-base text-gray-500">
                  Owner: {item?.name}
                </p>

                {/* Shop Description */}
                <p className="text-gray-600 text-[13px] md:text-base max-w-[800px] mb-4">
                  {item?.shop_description}
                </p>

                {/* View Shop Btn */}
                <Link
                  href={`/shop-details?view=${"customer"}&id=${
                    item?.user?.shop_info?.user_id
                  }&listing_id=${item?.user?.shop_info?.id}`}
                  className="px-4 text-[12px] py-2 rounded-lg font-semibold flex gap-2 items-center bg-[#D4E2CB] text-primary-green w-fit cursor-pointer duration-500 transition-transform hover:scale-105"
                >
                  View Shop
                  <RightSvg />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Community;
