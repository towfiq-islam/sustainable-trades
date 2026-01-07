"use client";
import { useTradesdata } from "@/Hooks/api/dashboard_api";
import TradesTabs from "./TradesTabs";

const SentTrades = () => {
  const { data: tradeData, isLoading } = useTradesdata("sent");

  return (
    <>
      <TradesTabs tradeRequests={tradeData?.data} isLoading={isLoading} />
    </>
  );
};

export default SentTrades;
