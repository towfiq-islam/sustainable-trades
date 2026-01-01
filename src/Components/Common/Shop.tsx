import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { LocationTwoSvg } from "../Svg/SvgContainer";

type ShopData = {
  id: number;
  user_id: number;
  shop_image: string | StaticImageData;
  shop_name: string;
  address: {
    display_my_address: boolean;
    address_line_1: string;
    city: string;
    state: string;
  };
};

type ShopProps = {
  shop: {
    shop: ShopData;
  };
};

const Shop = ({ shop }: ShopProps) => {
  return (
    <Link
      href={`/shop-details?view=${"customer"}&id=${
        shop?.shop?.user_id
      }&listing_id=${shop?.shop?.id}`}
      className="rounded-t-lg relative block hover:-translate-y-2 duration-400 transition-transform"
    >
      {/* Shop Image */}
      <figure className="w-full h-[200px] md:h-[270px] rounded-lg border border-gray-100 relative">
        <div className="absolute inset-0 bg-black/20 rounded-lg" />
        <Image
          src={`${process.env.NEXT_PUBLIC_SITE_URL}/${shop?.shop?.shop_image}`}
          alt="product image"
          fill
          unoptimized
          className="w-full h-full object-cover rounded-lg"
        />
      </figure>

      {/* Shop Name */}
      <h3 className="text-primary-green text-xl font-semibold py-1 truncate">
        {shop?.shop?.shop_name}
      </h3>

      {/* Shop Price */}
      <div className="flex mt-2 gap-2 items-center">
        <LocationTwoSvg />
        <p className="text-secondary-black">
          {shop?.shop?.address?.display_my_address
            ? shop?.shop?.address?.address_line_1
            : `${shop?.shop?.address?.city}, ${shop?.shop?.address?.state}`}
        </p>
      </div>
    </Link>
  );
};

export default Shop;
