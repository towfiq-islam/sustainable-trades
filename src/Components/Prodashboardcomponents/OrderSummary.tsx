interface OrderSummaryData {
  payment_status: string;
  fulfillment_type?: "delivery" | "shipping" | "pickup" | string;
  sub_total: number;
  tax_amount: number;
  shipping_amount: number;
  delivery_amount?: number;
  discount_amount?: number;
  total_amount: number;
}

interface OrderItem {
  data?: OrderSummaryData;
}

const OrderSummary = ({ data }: OrderItem) => {
  const isDelivery = data?.fulfillment_type === "delivery";
  const shippingLabel = isDelivery ? "Delivery Fee:" : "Shipping and Handling:";
  const shippingValue = isDelivery
    ? (data?.delivery_amount ?? 0)
    : (data?.shipping_amount ?? 0);
  const hasDiscount = !!data?.discount_amount && data.discount_amount > 0;

  return (
    <div className="mt-10 flex flex-col gap-[20px] sm:flex-row justify-between">
      <div className="flex flex-row sm:flex-col justify-between sm:justify-normal">
        <h3 className="text-[16px] font-bold text-secondary-black">
          Payment Status
        </h3>
        <h4 className="text-[16px] font-normal text-secondary-black capitalize">
          {data?.payment_status}
        </h4>
      </div>
      <div className="">
        <h3 className="text-[16px] font-bold text-secondary-black">
          Order Summary
        </h3>
        <div className="flex gap-x-10 justify-between sm:justify-normal">
          <ul className="flex flex-col gap-y-3 font-sans">
            <li className="text-[16px] font-normal text-secondary-black">
              Items Subtotal:
            </li>
            <li className="text-[16px] font-normal text-secondary-black">
              {shippingLabel}
            </li>
            {hasDiscount && (
              <li className="text-[16px] font-normal text-secondary-black">
                Discount:
              </li>
            )}
            <li className="text-[16px] font-normal text-secondary-black">
              Estimated tax:
            </li>
            <li className="text-[16px] font-bold text-secondary-black">
              Grand Total
            </li>
          </ul>

          <ul className="flex flex-col gap-y-3 font-sans">
            <li className="text-[16px] font-normal text-secondary-black">
              ${data?.sub_total ?? 0}
            </li>
            <li className="text-[16px] font-normal text-secondary-black">
              ${shippingValue}
            </li>
            {hasDiscount && (
              <li className="text-[16px] font-normal text-secondary-black">
                -${data?.discount_amount}
              </li>
            )}
            <li className="text-[16px] font-normal text-secondary-black">
              ${data?.tax_amount ?? 0}
            </li>
            <li className="text-[16px] font-bold text-secondary-black">
              ${data?.total_amount ?? 0}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
