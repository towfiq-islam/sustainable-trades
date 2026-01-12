import Link from "next/link";
import Product from "@/Components/Common/Product";
import { AiOutlineFileUnknown } from "react-icons/ai";

type productItem = {
  id: number;
  distance: number;
};

interface moreProductProps {
  data: {
    shop: {
      id: number;
      user_id: number;
    };
    more_products_from_shop: productItem[];
  };
}

const MoreProduct = ({ data }: moreProductProps) => {
  return (
    <section className="my-10 md:my-20">
      {/* Title */}
      <h3 className="text-3xl font-semibold text-secondary-black mb-7">
        More from this shop
      </h3>

      {/* Products */}
      {data?.more_products_from_shop?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-10">
          {data?.more_products_from_shop?.map(product => (
            <Product
              key={product?.id}
              product={product}
              has_wishlist={false}
              has_cart={false}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center gap-3 text-center py-5 md:py-20">
          <AiOutlineFileUnknown className="text-xl md:text-3xl lg:text-6xl text-gray-500" />
          <p className="text-gray-600 text-sm md:text-lg font-semibold">
            No product found!!
          </p>
        </div>
      )}

      {/* View All Btn */}
      {data?.more_products_from_shop?.length > 0 && (
        <div className="flex items-center justify-end mt-8">
          <Link
            href={`/shop-details?view=${"customer"}&id=${
              data?.shop?.user_id
            }&listing_id=${data?.shop?.id}`}
            className="text-primary-green font-semibold text-lg cursor-pointer"
          >
            View all....
          </Link>
        </div>
      )}
    </section>
  );
};

export default MoreProduct;
