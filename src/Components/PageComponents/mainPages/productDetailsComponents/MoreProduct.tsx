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
    <section className="my-10 xl:my-20">
      {/* Title */}
      <h3 className="text-xl md:text-2xl xl:text-3xl font-semibold text-secondary-black mb-4 xl:mb-7">
        More from this shop
      </h3>

      {/* Products */}
      {data?.more_products_from_shop?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-x-5 md:gap-y-10">
          {data?.more_products_from_shop?.map(product => (
            <Product
              key={product?.id}
              product={product}
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
    </section>
  );
};

export default MoreProduct;
