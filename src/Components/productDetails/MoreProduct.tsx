import Product from "@/Components/Common/ProductWrapper";
import { FiShoppingBag } from "react-icons/fi";
import { EmptyState } from "@/Components/Common/EmptyState";

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
    <section className="my-10 xl:mb-20">
      {/* Title */}
      <h3 className="text-xl md:text-2xl xl:text-3xl font-semibold text-secondary-black mb-4 xl:mb-7">
        More from this shop
      </h3>

      {/* Products */}
      {data?.more_products_from_shop?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-x-5 md:gap-y-10">
          {data?.more_products_from_shop?.map(product => (
            <Product key={product?.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<FiShoppingBag />}
          title="Nothing else listed yet"
          description="This shop doesn't have any other products up right now. Check back later as they add more to their catalog."
        />
      )}
    </section>
  );
};

export default MoreProduct;
