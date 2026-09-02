"use client";
import { useGetTradesQuery } from "@/redux/api/tradeApi";
import TradesTabs from "./TradesTabs";

const SentTrades = () => {
  const { data: tradeData, isLoading } = useGetTradesQuery({});

  return (
    <>
      <TradesTabs tradeRequests={tradeData?.data} isLoading={isLoading} />
    </>
  );
};

export default SentTrades;
