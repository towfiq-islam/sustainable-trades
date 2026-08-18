"use client";
import Image from "next/image";
import moment from "moment";
import { useDownloadInvoiceMutation } from "@/redux/api/ordersApi";

type OrderLineItem = {
  id: number;
  product_id: number;
  product_name: string;
  product_image: string;
  quantity: number;
  unit_price: number;
  tax_amount: number;
  discount_amount: number;
  total_price: number;
};

type OrderProps = {
  data: {
    order_number: string;
    order_date: string;
    items: OrderLineItem[];
  };
  order_id: number;
};

const OrderedProducts = ({ data, order_id }: OrderProps) => {
  const [downloadInvoicePdf, { isLoading: isPending }] =
    useDownloadInvoiceMutation();

  const handleDownloadInvoice = (orderId: number) => {
    downloadInvoicePdf(orderId)
      .unwrap()
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "invoice.pdf");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  };

  return (
    <div className="pt-10 pb-6">
      <div className="flex flex-col-reverse md:flex-row justify-between">
        <div className="flex gap-x-1 items-center">
          <h5 className="text-[16px] font-bold text-[#67645F]">Order ID</h5>
          <p className="text-[14px] font-normal text-secondary-black">
            {data?.order_number}
          </p>
        </div>
        <div className="flex gap-x-1 items-center">
          <h5 className="text-[16px] font-bold text-[#67645F]">Date Ordered</h5>
          <p className="text-[14px] font-normal text-secondary-black">
            {moment(data?.order_date).format("ll")}
          </p>
        </div>
        <div className="flex gap-x-1 items-center w-full md:w-fit mb-3.5 md:mb-0">
          <button
            disabled={isPending}
            onClick={() => {
              handleDownloadInvoice(order_id);
            }}
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

      <div className="mt-6 border border-[#CCCED0] rounded-xl">
        <div className="flex flex-col">
          {data?.items?.map(item => (
            <div
              key={item?.id}
              className="flex flex-col md:flex-row gap-5 justify-between md:items-center border-b border-gray-300 last:border-b-0 p-4"
            >
              <div className="flex flex-col md:flex-row gap-x-6 md:items-center">
                <figure className="w-30 h-24 rounded border border-gray-100 relative shrink-0">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SITE_URL}/${item?.product_image}`}
                    alt="Thumbnail"
                    unoptimized
                    fill
                    className="w-full h-full object-cover rounded"
                  />
                </figure>

                <h3 className="text-lg font-semibold text-secondary-black">
                  {item?.product_name}
                </h3>
              </div>

              <div className="shrink-0">
                <h3 className="text-xl font-semibold text-secondary-black pb-1">
                  ${item?.total_price}
                </h3>
                <h4 className="text-lg font-semibold text-secondary-black">
                  Qty: {item?.quantity}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderedProducts;
