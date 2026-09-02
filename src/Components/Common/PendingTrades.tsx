"use client";
import TradesTabs from "./TradesTabs";

const PendingTrades = ({ pendingTradeData, isLoading }: any) => {
  const PendingtradesData = pendingTradeData?.filter(
    (data: any) => data.status === "pending"
  );

  return (
    <>
      <TradesTabs tradeRequests={PendingtradesData} isLoading={isLoading} />
    </>
  );
};

export default PendingTrades;
