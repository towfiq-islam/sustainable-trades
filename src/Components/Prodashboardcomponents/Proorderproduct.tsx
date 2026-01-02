import Thumbnail from "../../Assets/Thumbnail.png";
import Image from "next/image";
import moment from "moment";

type orderItem = {
  order_id: number;
  quantity: number;
  product: {
    product_name: string;
    product_price: number;
  };
};

type OrderProps = {
  data: {
    order_number: number;
    created_at: string;
    order_items: orderItem[];
  };
};

const Proorderproduct = ({ data }: OrderProps) => {
  return (
    <div className="pt-10 pb-6">
      <div className="flex flex-col-reverse md:flex-row justify-between">
        <div className="flex gap-x-1 items-center">
          <h5 className="text-[16px] font-bold text-[#67645F]">Order ID</h5>
          <p className="text-[14px] font-normal text-[#000]">
            {data?.order_number}
          </p>
        </div>
        <div className="flex gap-x-1 items-center">
          <h5 className="text-[16px] font-bold text-[#67645F]">Date Ordered</h5>
          <p className="text-[14px] font-normal text-[#000]">
            {moment(data?.created_at).format("ll")}
          </p>
        </div>
        <div className="flex gap-x-1 items-center w-full md:w-fit mb-3.5 md:mb-0">
          <button className="py-2 px-4 rounded-[8px] w-full md:w-fit border border-[#77978F] text-[16px] font-semibold text-[#13141D] cursor-pointer hover:border-green-500 duration-300 ease-in-out">
            View Invoice
          </button>
        </div>
      </div>

      <div className="mt-6 border border-[#CCCED0] rounded">
        <div className="flex flex-col">
          {data?.order_items?.map(order => (
            <div
              key={order?.order_id}
              className="flex flex-col md:flex-row justify-between md:items-center border-b border-gray-300 px-6 py-4"
            >
              <div className="flex flex-col md:flex-row gap-x-6 md:items-center">
                <figure>
                  <Image src={Thumbnail} alt="Thumbnail" unoptimized />
                </figure>
                <h3 className="text-[20px] font-semibold text-[#13141D] truncate">
                  {order?.product?.product_name}
                </h3>
              </div>

              <div>
                <h3 className="text-[20px] font-semibold text-[#13141D] pb-1">
                  ${order?.product?.product_price}
                </h3>
                <h4 className="text-[18px] font-semibold text-[#13141D]">
                  Qty: {order?.quantity}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Proorderproduct;
