interface OrderItem {
  data: {
    payment_status: string;
    sub_total: string;
    tax_amount: string;
    total_amount: string;
    shipping_amount: string;
  };
}

const OrderSummary = ({ data }: OrderItem) => {
  return (
    <div className="mt-10 flex flex-col gap-[20px] sm:flex-row justify-between">
      <div className="flex flex-row sm:flex-col justify-between sm:justify-normal">
        <h3 className="text-[16px] font-bold text-[#13141D]">Payment Status</h3>
        <h4 className="text-[16px] font-normal text-[#13141D] capitalize">
          {data?.payment_status}
        </h4>
      </div>
      <div className="">
        <h3 className="text-[16px] font-bold text-[#13141D]">Order Summary</h3>
        <div className="flex gap-x-10  justify-between sm:justify-normal">
          <ul className="flex flex-col gap-y-3 font-sans">
            <li className="text-[16px] font-normal text-[#13141D]">
              Items Subtotal:
            </li>
            <li className="text-[16px] font-normal text-[#13141D]">
              Shipping and Handling:
            </li>
            <li className="text-[16px] font-normal text-[#13141D]">
              Total before tax:
            </li>
            {/* <li className="text-[16px] font-normal text-[#13141D]">
              Estimated tax to be collected:
            </li> */}
            <li className="text-[16px] font-bold text-[#13141D]">
              Grand Total
            </li>
          </ul>

          <ul className="flex flex-col gap-y-3 font-sans">
            <li className="text-[16px] font-normal text-[#13141D]">
              ${data?.sub_total}
            </li>
            <li className="text-[16px] font-normal text-[#13141D]">
              ${data?.shipping_amount}
            </li>
            <li className="text-[16px] font-normal text-[#13141D]">
              ${data?.tax_amount}
            </li>
            {/* <li className="text-[16px] font-normal text-[#13141D]"> $37.82</li> */}
            <li className="text-[16px] font-bold text-[#13141D]">
              ${data?.total_amount}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
