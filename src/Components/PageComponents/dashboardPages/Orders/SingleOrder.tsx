import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Again, GoBackSvg } from "@/Components/Svg/SvgContainer";
import moment from "moment";
import { PuffLoader } from "react-spinners";
import Modal from "@/Components/Common/Modal";
import TrackPackageModal from "@/Components/Modals/TrackPackageModal";
import { useState } from "react";
import CheckoutPaypalModal from "@/Components/Modals/CheckoutPaypalModal";
import ConversationPage from "@/Components/PageComponents/dashboardPages/messageComponents/ConversationPage";
import { useDownloadInvoice } from "@/Hooks/api/cms_api";
import { useGetOrderDetailsQuery } from "@/redux/api/OrderApi";

const SingleOrder = ({ orderId }: { orderId: number }) => {
  const router = useRouter();
  const [open, isOpen] = useState<boolean>(false);
  const [paypalOpen, setPaypalOpen] = useState<boolean>(false);
  const { data: getSingleOrder, isLoading } = useGetOrderDetailsQuery(orderId);
  const { mutate: downloadInvoicePdf, isPending } = useDownloadInvoice();

  // Func for download Invoice pdf
  const handleDownloadInvoice = () => {
    downloadInvoicePdf(
      { endpoint: `/api/invoice-generate/${orderId}` },
      {
        onSuccess: async (res: any) => {
          const url = window.URL.createObjectURL(res);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "invoice.pdf");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="h-[80vh] flex justify-center items-center">
        <PuffLoader color="#274f45" />
      </div>
    );
  }

  return (
    <>
      {/* Back Btn */}
      <button
        onClick={() => router.back()}
        className="flex gap-1 items-center cursor-pointer font-semibold text-primary-green mb-2 group"
      >
        <span className="group-hover:-translate-x-1 duration-300 transition-transform">
          <GoBackSvg />
        </span>
        <span>Back</span>
      </button>

      <h2 className="text-[30px] font-lato font-semibold text-secondary-black">
        Order Details
      </h2>

      <div className="flex flex-col lg:flex-row justify-between gap-5 mt-5">
        {/* Left */}
        <div className="w-full lg:w-[65%] 2xl:w-[75%]">
          <div className="border border-[#BFBEBE] rounded-lg mb-5">
            <div className="px-3 md:px-6 py-4">
              <div className="flex flex-col md:flex-row md:justify-between">
                <div className="flex flex-col md:flex-row md:gap-x-10">
                  <div>
                    <h3 className="text-[#67645F] font-sans font-semibold">
                      Order Placed
                    </h3>
                    <p className="font-sans  text-secondary-black">
                      {moment(getSingleOrder?.data?.created_at).format("LL")}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-[#67645F] font-sans font-semibold">
                      Total
                    </h3>
                    <p className="font-sans text-secondary-black">
                      ${getSingleOrder?.data?.total_amount}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:gap-x-10">
                  <div>
                    <h3 className="text-[#67645F] font-sans font-semibold">
                      Order Number
                    </h3>

                    <p className="font-sans text-secondary-black">
                      {getSingleOrder?.data?.order_number}
                    </p>
                  </div>

                  <button
                    disabled={isPending}
                    onClick={handleDownloadInvoice}
                    className={`text-primary-green font-sans font-bold ${
                      isPending
                        ? "cursor-not-allowed"
                        : "cursor-pointer underline"
                    }`}
                  >
                    {isPending ? (
                      <>
                        <span className="inline-block animate-spin">⏳</span>{" "}
                        Downloading
                      </>
                    ) : (
                      "View Invoice"
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full bg-[#BFBEBE] h-[1px]" />

            <div className="px-3 md:px-6 py-4">
              <ul className="flex flex-col md:flex-row justify-between">
                <div className="">
                  <li className="text-secondary-black font-sans font-semibold mb-1">
                    Shipping Address
                  </li>

                  <ul className="flex flex-col gap-2">
                    <li className="text-secondary-black font-sans font-normal flex gap-1 items-center">
                      <span>
                        {getSingleOrder?.data?.shipping_address?.first_name}
                      </span>
                      <span>
                        {getSingleOrder?.data?.shipping_address?.last_name}
                      </span>
                    </li>

                    <li className="text-secondary-black font-sans font-normal">
                      {getSingleOrder?.data?.shipping_address?.address}
                    </li>
                    <li className="text-secondary-black font-sans font-normal flex gap-1 items-center">
                      <span>
                        {getSingleOrder?.data?.shipping_address?.postal_code},
                      </span>
                      <span>
                        {getSingleOrder?.data?.shipping_address?.city},
                      </span>
                      <span>
                        {getSingleOrder?.data?.shipping_address?.state}
                      </span>
                    </li>
                    <li className="text-secondary-black font-sans">
                      {getSingleOrder?.data?.shipping_address?.country}
                    </li>
                  </ul>
                </div>

                <div className="">
                  <li className="text-secondary-black font-sans font-semibold mb-1">
                    Payment Status
                  </li>
                  <ul className="flex flex-col gap-2">
                    <li className="text-secondary-black font-sans capitalize">
                      {getSingleOrder?.data?.payment_status}
                    </li>
                  </ul>
                </div>
                <div className="">
                  <li className="text-secondary-black font-sans font-semibold text-start mb-1">
                    Order Summary
                  </li>

                  <ul className="flex flex-col gap-2 w-full">
                    <li className="text-secondary-black font-sans flex justify-between gap-10">
                      Items Subtotal:
                      <span>${getSingleOrder?.data?.sub_total}</span>
                    </li>
                    <li className="text-secondary-black font-sans flex justify-between gap-10">
                      Shipping and Handling:
                      <span> ${getSingleOrder?.data?.shipping_amount}</span>
                    </li>
                    <li className="text-secondary-black font-sans flex justify-between gap-10">
                      Total before tax
                      <span> ${getSingleOrder?.data?.tax_amount}</span>
                    </li>
                    <li className="text-secondary-black font-sans text-start flex justify-between gap-10">
                      Grand Total
                      <span> ${getSingleOrder?.data?.total_amount}</span>
                    </li>
                  </ul>
                </div>
              </ul>
            </div>
          </div>

          <div className="pt-3 px-4 pb-6 border border-[#BFBEBE] rounded-[8px]">
            <div className="flex flex-col gap-3.5 md:flex-row md:justify-between md:items-center">
              <div>
                <h4 className="text-xl font-semibold text-secondary-black">
                  {getSingleOrder?.data?.shop?.shop_name}
                </h4>

                <p className="font-sans text-secondary-black text-[16px] pt-1 pb-3">
                  {getSingleOrder?.data?.latest_order_status?.content}
                </p>

                <div className="space-y-5">
                  {getSingleOrder?.data?.order_items?.map((item: any) => (
                    <div className="flex gap-x-3">
                      <figure className="rounded size-28">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_SITE_URL}/${item?.product?.images[0]?.image}`}
                          alt="order_img"
                          height={117}
                          width={115}
                          unoptimized
                          className="rounded size-full object-cover"
                        />
                      </figure>

                      <div className="flex flex-col gap-0.5">
                        <h5 className="text-[16px] font-semibold text-secondary-black">
                          {item?.product?.product_name}
                        </h5>
                        <h5 className="text-[#222] text-sm">
                          Price: ${item?.total_price}
                        </h5>
                        <h5 className="text-[#222] text-sm">
                          Qty: {item?.quantity}
                        </h5>

                        <Link
                          href={`/product-details/${item?.product_id}`}
                          className="text-sm px-2 mt-1 py-1.5 rounded-[8px] w-fit bg-off-green flex gap-2 cursor-pointer group"
                        >
                          <Again className="transition-transform duration-500 group-hover:rotate-[260deg]" />
                          Buy it again
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {/* {(getSingleOrder?.data?.status === "awaiting_payment" ||
                  getSingleOrder?.data?.status === "pending") && (
                  <button
                    onClick={() => setPaypalOpen(true)}
                    className="p-2 rounded-[8px] border border-[#BFBEBE] text-[14px] md:text-[16px]  font-normal cursor-pointer w-full md:w-[250px] hover:scale-105 duration-500 ease-in-out bg-primary-green text-white disabled:cursor-not-allowed disabled:opacity-70 disabled:animate-pulse"
                  >
                    Do payment
                  </button>
                )} */}
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="w-full lg:w-[35%] 2xl:w-[25%]">
          {/* Chat */}
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="px-4 pt-4 pb-2 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-secondary-black">
                Chat with Buyer
              </h2>
            </div>

            <div className="h-[480px] flex flex-col p-3">
              <ConversationPage
                conversationId={getSingleOrder?.data?.shop?.user_id}
                type="private"
                compact={true}
              />
            </div>
          </div>

          <button
            onClick={() => isOpen(true)}
            className="font-semibold border border-gray-300 rounded-lg overflow-hidden w-full p-3 cursor-pointer hover:bg-accent-red hover:text-white duration-300 transition-all my-4"
          >
            Track Package
          </button>

          <Link
            className="primary_btn"
            href={`/dashboard/${
              getSingleOrder?.data?.user?.role === "vendor" &&
              getSingleOrder?.data?.user?.membership?.membership_type === "pro"
                ? "pro"
                : getSingleOrder?.data?.user?.role === "vendor" &&
                    getSingleOrder?.data?.user?.membership?.membership_type ===
                      "basic"
                  ? "basic"
                  : "customer"
            }/messages/inbox/${getSingleOrder?.data?.user_id}`}
          >
            Go to Messages Board
          </Link>
        </div>
      </div>

      <Modal open={open} onClose={() => isOpen(false)}>
        <TrackPackageModal order_id={orderId} />
      </Modal>

      <Modal open={paypalOpen} onClose={() => setPaypalOpen(false)}>
        <CheckoutPaypalModal
          isLocalPayment={true}
          onClose={() => setPaypalOpen(false)}
          cart_id={getSingleOrder?.data?.local_pickup_checkout_token}
        />
      </Modal>
    </>
  );
};

export default SingleOrder;
