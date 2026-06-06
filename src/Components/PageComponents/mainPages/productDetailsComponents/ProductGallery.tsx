"use client";
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import Image from "next/image";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

type galleryItem = {
  id: number;
  image: string;
};

interface galleryProps {
  data: {
    out_of_stock: boolean;
    unlimited_stock: boolean;
    product_quantity: number;
    images: galleryItem[];
  };
}

const ProductGallery = ({ data }: galleryProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  return (
    <div className="flex flex-col md:flex-row gap-3 md:gap-4">
      {/* Thumbnails */}
      <Swiper
        onSwiper={setThumbsSwiper}
        direction="horizontal"
        breakpoints={{
          768: {
            direction: "vertical",
            slidesPerView: 4,
          },
        }}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="
          w-full 
          md:w-[120px] 
          h-[100px] 
          md:h-[450px] 
          rounded-xl 
          shrink-0
          order-2 md:order-1
        "
      >
        {data?.images?.map((img, index) => (
          <SwiperSlide key={index}>
            <figure className="w-full h-[90px] md:h-[100px] cursor-pointer rounded-lg border border-gray-100 relative">
              <Image
                src={`${process.env.NEXT_PUBLIC_SITE_URL}/${img?.image}`}
                alt="thumbnail"
                fill
                unoptimized
                className="object-cover rounded-lg"
              />
            </figure>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Main Image */}
      <Swiper
        spaceBetween={10}
        speed={800}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="
          w-full
          h-[250px] sm:h-[300px] md:h-[445px]
          rounded-xl relative 
          order-1 md:order-2
        "
      >
        {data?.images?.map((img, index) => (
          <SwiperSlide key={index}>
            <Image
              src={`${process.env.NEXT_PUBLIC_SITE_URL}/${img?.image}`}
              alt="main product"
              fill
              unoptimized
              className="object-cover rounded-xl"
            />

            {/* Stock Info */}
            {data?.unlimited_stock ? (
              <button className="absolute top-3 right-3 shadow-lg font-medium px-3 py-1 rounded-full bg-primary-green text-white z-10 text-sm">
                In Stock
              </button>
            ) : !data?.out_of_stock && Number(data?.product_quantity) > 0 ? (
              <button className="absolute top-3 right-3 shadow-lg font-medium px-3 py-1 rounded-full bg-primary-green text-white z-10 text-sm">
                In Stock
              </button>
            ) : (
              <button className="absolute top-3 right-3 shadow-lg font-medium px-3 py-1 rounded-full bg-accent-red text-white z-10 text-sm">
                Out of Stock
              </button>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductGallery;
