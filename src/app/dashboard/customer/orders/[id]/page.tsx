"use client";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Again, GoBackSvg } from "@/Components/Svg/SvgContainer";
import {
  getMyOrderDetails,
  useDownloadInvoice,
} from "@/Hooks/api/dashboard_api";
import moment from "moment";
import { PuffLoader } from "react-spinners";
import Modal from "@/Components/Common/Modal";
import TrackPackageModal from "@/Components/Modals/TrackPackageModal";
import { useState } from "react";

const OrderDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = Number(params?.id);
  const [open, isOpen] = useState<boolean>(false);
  const { data: getSingleOrder, isLoading } = getMyOrderDetails(orderId);
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
      }
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

      <h2 className="text-[30px] md:text-[40px] font-lato font-semibold text-[#000]">
        Order Details
      </h2>
      <div className="border border-[#BFBEBE] rounded-[8px] my-5 md:my-10">
        <div className="px-3 md:px-6 py-4">
          <div className="flex flex-col md:flex-row md:justify-between">
            <div className="flex flex-col md:flex-row md:gap-x-10">
              <div>
                <h3 className="text-[#67645F] font-sans font-bold">
                  Order Placed
                </h3>
                <p className="font-sans font-normal text-[#000] text-[16px]">
                  {moment(getSingleOrder?.data?.created_at).format("LL")}
                </p>
              </div>
              <div>
                <h3 className="text-[#67645F] font-sans font-bold">Total</h3>
                <p className="font-sans font-normal text-[#000] text-[16px]">
                  ${getSingleOrder?.data?.total_amount}
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:gap-x-10">
              <div>
                <h3 className="text-[#67645F] font-sans font-bold">
                  Order Number
                </h3>
                <p className="font-sans font-normal text-[#000] text-[16px]">
                  {getSingleOrder?.data?.order_number}
                </p>
              </div>

              <button
                disabled={isPending}
                onClick={handleDownloadInvoice}
                className={`text-[#1F4038] font-sans font-bold ${
                  isPending ? "cursor-not-allowed" : "cursor-pointer underline"
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

        <div className="w-full bg-[#BFBEBE] h-[1px]"></div>
        <div className="px-3 md:px-6 py-4">
          <ul className="flex flex-col md:flex-row justify-between">
            <div className="">
              <li className="text-[#000] font-sans font-bold text-[16px]">
                Shipping Address
              </li>
              <ul className="flex flex-col gap-2">
                <li className="text-[#000] font-sans font-normal text-[16px] flex gap-1 items-center">
                  <span>
                    {getSingleOrder?.data?.shipping_address?.first_name}
                  </span>
                  <span>
                    {getSingleOrder?.data?.shipping_address?.last_name}
                  </span>
                </li>
                <li className="text-[#000] font-sans font-normal text-[16px]">
                  {getSingleOrder?.data?.shipping_address?.address}
                </li>
                <li className="text-[#000] font-sans font-normal text-[16px] flex gap-1 items-center">
                  <span>
                    {getSingleOrder?.data?.shipping_address?.postal_code},
                  </span>
                  <span>{getSingleOrder?.data?.shipping_address?.city},</span>
                  <span>{getSingleOrder?.data?.shipping_address?.state}</span>
                </li>
                <li className="text-[#000] font-sans font-normal text-[16px]">
                  {getSingleOrder?.data?.shipping_address?.country}
                </li>
              </ul>
            </div>
            <div className="">
              <li className="text-[#000] font-sans font-bold text-[16px]">
                Payment Status
              </li>
              <ul className="flex flex-col gap-2">
                <li className="text-[#000] font-sans capitalize">
                  {getSingleOrder?.data?.payment_status}
                </li>
              </ul>
            </div>
            <div className="">
              <li className="text-[#000] font-sans font-bold text-[16px] text-start">
                Order Summary
              </li>
              <ul className="flex flex-col gap-2 w-full">
                <li className="text-[#000] font-sans font-normal text-[16px] flex justify-between gap-10">
                  Items Subtotal:
                  <span>${getSingleOrder?.data?.sub_total}</span>
                </li>
                <li className="text-[#000] font-sans font-normal text-[16px] flex justify-between gap-10">
                  Shipping and Handling:
                  <span> ${getSingleOrder?.data?.shipping_amount}</span>
                </li>
                <li className="text-[#000] font-sans font-normal text-[16px] flex justify-between gap-10">
                  Total before tax
                  <span> ${getSingleOrder?.data?.tax_amount}</span>
                </li>
                <li className="text-[#000] font-sans font-bold text-[16px] text-start flex justify-between gap-10">
                  Grand Total
                  <span> ${getSingleOrder?.data?.total_amount}</span>
                </li>
              </ul>
            </div>
          </ul>
        </div>
      </div>

      <div className="pt-2 px-4 pb-6 border border-[#BFBEBE] rounded-[8px]">
        <div className="flex flex-col gap-3.5 md:flex-row md:justify-between md:items-center">
          <div>
            <h4 className="text-[20px] font-bold text-[#000]">
              {getSingleOrder?.data?.shop?.shop_name}
            </h4>
            <p className="font-sans font-normal text-[#000] text-[16px] pt-2 pb-3">
              {getSingleOrder?.data?.latest_order_status?.content}
            </p>

            <div className="space-y-5">
              {getSingleOrder?.data?.order_items?.map((item: any) => (
                <div className="flex gap-x-3">
                  <figure className="rounded size-[120px]">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_SITE_URL}/${item?.product?.images[0]?.image}`}
                      alt="order_img"
                      height={117}
                      width={115}
                      unoptimized
                      className="rounded size-full object-cover"
                    />
                  </figure>
                  <div className="flex flex-col gap-1.5">
                    <h5 className="text-[16px] sm:text-[20px] font-bold text-[#000]">
                      {item?.product?.product_name}
                    </h5>
                    <h5 className="text-[#222]">
                      Price: ${item?.product?.product_price}
                    </h5>

                    <Link
                      href={`/product-details/${item?.product_id}`}
                      className="px-2 mt-1 py-1.5 rounded-[8px] w-fit bg-[#D4E2CB] flex gap-2 cursor-pointer group"
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
            <button
              onClick={() => isOpen(true)}
              className="p-2 rounded-[8px] border border-[#BFBEBE] text-[14px] md:text-[16px]  font-normal text-[#000] cursor-pointer w-full md:w-[250px] hover:scale-105 duration-500 ease-in-out"
            >
              Track Package
            </button>

            <Link
              href={`/dashboard/${getSingleOrder?.data?.shop?.user?.membership?.membership_type}/messages/inbox/${getSingleOrder?.data?.shop?.user_id}`}
              className="p-2 rounded-[8px] border border-[#BFBEBE] text-[13px] md:text-[16px] font-normal text-[#000] cursor-pointer w-full sm:w-[250px] text-center hover:scale-105 duration-500 ease-in-out"
            >
              Get Help
            </Link>
          </div>
        </div>
      </div>

      <Modal open={open} onClose={() => isOpen(false)}>
        <TrackPackageModal order_id={orderId} />
      </Modal>
    </>
  );
};

export default OrderDetailsPage;
