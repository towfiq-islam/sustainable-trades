"use client";
import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import useAuth from "@/Hooks/useAuth";
import { CgSpinnerTwo } from "react-icons/cg";
import Container from "@/Components/Common/Container";
import { LocationSvg, StarSvg } from "@/Components/Svg/SvgContainer";
import Modal from "@/Components/Common/Modal";
import { useFollowShop } from "@/Hooks/useFollowShop";
import { ShopBannerData } from "@/Types";
import MessageToSellerModal from "@/Components/Modals/MessageToSellerModal";

interface BannerProps {
  id: number;
  data: ShopBannerData;
}

const ShopBanner = ({ id, data }: BannerProps) => {
  const [msgOpen, setMsgOpen] = useState<boolean>(false);
  const { user } = useAuth();
  const bannerUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${data?.shop_info?.shop_banner}`;
  const { handleFollowShop, isLoading: isPending } = useFollowShop();

  // Func for send message
  const handleMessage = () => {
    if (!user) {
      return toast.error("Please login first");
    }
    if (user?.shop_info?.user_id === id) {
      return toast.error("You can't message your own shop");
    }
    setMsgOpen(true);
  };

  return (
    <section className="relative min-h-[440px] md:h-[430px] lg:h-[470px] 2xl:h-[600px] py-8 sm:py-10 mb-8 sm:mb-10 overflow-hidden flex items-center">
      {/* Banner image */}
      <Image
        src={bannerUrl}
        alt={`${data?.shop_info?.shop_name ?? "Shop"} banner`}
        fill
        priority
        unoptimized
        sizes="100vw"
        className="object-cover object-center -z-20"
      />
      {/* Dark overlay (replaces bg-black/50 bg-blend-overlay) */}
      <div className="absolute inset-0 bg-black/50 -z-10" />

      <Container>
        <div className="flex flex-col md:flex-row justify-between w-full">
          {/* Left - Shop Info */}
          <div className="space-y-2 lg:space-y-3.5 2xl:space-y-4">
            {/* Shop Profile */}
            <div className="flex md:justify-start justify-start items-center">
              <figure className="size-20 sm:size-24 xl:size-25 2xl:size-[153px] rounded-full relative border-2 border-white/50 shadow-md">
                <Image
                  src={`${process.env.NEXT_PUBLIC_SITE_URL}/${data?.shop_info?.shop_image}`}
                  alt="profile image"
                  fill
                  unoptimized
                  className="size-full rounded-full object-cover"
                />
              </figure>
            </div>

            <h3 className="text-white text-xl sm:text-2xl lg:text-3xl 2xl:text-4xl font-semibold leading-tight">
              {data?.shop_info?.shop_name}
            </h3>

            {/* Description */}
            <p className="max-w-[420px] text-accent-white text-xs sm:text-sm 2xl:text-lg leading-relaxed">
              {data?.shop_info?.about?.statement?.length > 100
                ? data?.shop_info?.about?.statement?.slice(0, 100) + "...."
                : data?.shop_info?.about?.statement}
            </p>

            {/* Location */}
            <div className="flex gap-2 sm:gap-3 items-center pt-1 md:pt-2">
              <span className="shrink-0">
                <LocationSvg />
              </span>
              <p className="text-accent-white text-xs sm:text-sm xl:text-lg">
                {data?.shop_info?.address?.display_my_address
                  ? data?.shop_info?.address?.address_line_1
                  : `${data?.shop_info?.address?.city}, ${data?.shop_info?.address?.state}`}
              </p>
            </div>

            {/* Reviews */}
            <div className="flex gap-2 items-center flex-wrap">
              {Array.from({ length: +data?.rating_avg }).map((_, idx) => (
                <p
                  key={idx}
                  className="size-7 sm:size-8 shrink-0 shadow border border-gray-600 rounded-full bg-primary-green grid place-items-center"
                >
                  <StarSvg />
                </p>
              ))}

              <p className="font-semibold text-base sm:text-lg text-gray-200 ml-1">
                {data?.rating_avg ? Number(data.rating_avg).toFixed(1) : "0.0"}
              </p>
            </div>

            {/* Btns */}
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 items-stretch sm:items-center pt-3 sm:pt-5 w-full sm:w-auto">
              <button
                onClick={() => handleFollowShop(data?.shop_info?.id, id)}
                disabled={isPending}
                className="px-5 2xl:px-8 py-2.5 2xl:py-3.5 rounded-lg cursor-pointer shadow text-sm sm:text-base 2xl:text-lg font-semibold text-primary-green bg-off-green duration-300 transition-transform hover:scale-105 w-full sm:w-auto text-center"
              >
                {isPending ? (
                  <p className="flex gap-2 items-center justify-center">
                    <CgSpinnerTwo className="animate-spin text-xl" />
                    <span>Please wait...</span>
                  </p>
                ) : data?.is_followed ? (
                  "Unfollow Shop"
                ) : (
                  "Follow Shop"
                )}
              </button>

              <button
                onClick={handleMessage}
                className="px-5 2xl:px-8 py-2.5 2xl:py-3.5 rounded-lg cursor-pointer shadow text-sm sm:text-base 2xl:text-lg font-semibold text-accent-white bg-black/20 duration-300 transition-transform hover:scale-105 border border-accent-white w-full sm:w-auto text-center"
              >
                Message Seller
              </button>
            </div>
          </div>

          {/* Right - Shop Author Info */}
          <div className="hidden md:block mt-4 md:w-[300px] border border-gray-600 rounded-lg shadow-lg px-6 py-3 bg-black/30 md:self-end">
            <div className="flex gap-5 items-center justify-between mb-5">
              <div>
                <h3 className="text-white font-semibold text-xl mb-1">
                  {data?.first_name} {data?.last_name}
                </h3>
                <p className="text-accent-white">
                  {data?.shop_info?.shop_name}
                </p>
              </div>

              <figure className="size-14 shrink-0 rounded-full relative grid place-items-center text-xl text-white font-semibold bg-accent-red">
                {data?.avatar ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SITE_URL}/${data?.avatar}`}
                    alt="author"
                    fill
                    unoptimized
                    className="size-full rounded-full"
                  />
                ) : (
                  <span>{data?.first_name.at(0)}</span>
                )}
              </figure>
            </div>

            <div className="flex gap-2 items-center mb-2">
              <p className="size-5 rounded-full bg-off-green"></p>
              <p className="text-lg text-accent-gray font-semibold">
                {data?.trade_offers_count || 0} Trades
              </p>
            </div>

            <div className="flex gap-2 items-center">
              <p className="size-5 rounded-full bg-accent-red"></p>
              <p className="text-lg text-accent-gray font-semibold">
                {data?.shop_info?.order_count || 0} Sales
              </p>
            </div>
          </div>
        </div>
      </Container>

      <Modal
        open={msgOpen}
        onClose={() => setMsgOpen(false)}
        className="max-w-xl"
      >
        <MessageToSellerModal
          id={data?.shop_info?.user_id}
          setMsgOpen={setMsgOpen}
        />
      </Modal>
    </section>
  );
};

export default ShopBanner;
