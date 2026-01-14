"use client";
import Link from "next/link";
import { use, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import Container from "@/Components/Common/Container";
import { getProductDetails, getProductReviews } from "@/Hooks/api/cms_api";
import { ProductDetailsSkeleton } from "@/Components/Loader/Loader";
import ProductGallery from "@/Components/PageComponents/mainPages/productDetailsComponents/ProductGallery";
import ProductReviews from "@/Components/PageComponents/mainPages/productDetailsComponents/ProductReviews";
import MoreProduct from "@/Components/PageComponents/mainPages/productDetailsComponents/MoreProduct";
import Subscribe from "@/Components/PageComponents/mainPages/homePageComponents/Subscribe";
import ShopInfo from "@/Components/PageComponents/mainPages/productDetailsComponents/ShopInfo";
import ProductDescription from "@/Components/PageComponents/mainPages/productDetailsComponents/ProductDescription";
import { GoBackSvg } from "@/Components/Svg/SvgContainer";
import { useRouter } from "next/navigation";
import useAuth from "@/Hooks/useAuth";

interface Props {
  params: Promise<{ id: number }>;
}

const page = ({ params }: Props) => {
  const { latitude, longitude } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState<string>("");
  const { id } = use(params);
  const { data: productDetailsData, isLoading } = getProductDetails(
    id,
    latitude,
    longitude
  );

  const { data: productReviews, isLoading: reviewLoading } = getProductReviews(
    id,
    page
  );
  console.log(productDetailsData?.data);

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  return (
    <section className="py-5 md:py-10">
      <Container>
        {/* Back Btn */}
        <button
          onClick={() => router.back()}
          className="flex gap-1 items-center cursor-pointer font-semibold text-primary-green mb-3 group"
        >
          <span className="group-hover:-translate-x-1 duration-300 transition-transform">
            <GoBackSvg />
          </span>
          <span>Back</span>
        </button>

        {/* Breadcrumbs */}
        <div className="flex gap-2 items-center text-gray-600 font-semibold mb-5">
          <Link href="/">Home</Link>
          <MdKeyboardArrowRight className="text-lg" />
          <button>{productDetailsData?.data?.product_name}</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-12 lg:mb-16">
          {/* Left */}
          <div className="space-y-10 md:space-y-16">
            {/* Thumbnail Gallery */}
            <ProductGallery data={productDetailsData?.data?.images} />

            {/* Reviews */}
            <ProductReviews
              reviewCount={
                productDetailsData?.data?.reviews_count
                  ? productDetailsData?.data?.reviews_count
                  : 0
              }
              reviewAvg={productDetailsData?.data?.reviews_avg_rating}
              data={productReviews?.data}
              reviewLoading={reviewLoading}
              setPage={setPage}
            />
          </div>

          {/* Right */}
          <div className="space-y-10 md:space-y-16">
            {/* Product Description */}
            <ProductDescription data={productDetailsData?.data} />

            {/* Shop Info */}
            <ShopInfo data={productDetailsData?.data} />
          </div>
        </div>

        <MoreProduct data={productDetailsData?.data} />
        <Subscribe />
      </Container>
    </section>
  );
};

export default page;
