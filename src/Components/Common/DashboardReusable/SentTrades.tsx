"use client";
import { useTradesdata } from "@/Hooks/api/dashboard_api";
import TradesTabs from "./TradesTabs";

const SentTrades = () => {
  const { data: tradeData } = useTradesdata("sent");
  return (
    <>
      <TradesTabs tradeRequests={tradeData?.data} />
    </>
  );
};

export default SentTrades;
