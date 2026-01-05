"use client";
import TradesTabs from "./TradesTabs";

const PendingTrades = ({ pendingTradeData }: any) => {
  const PendingtradesData = pendingTradeData?.filter(
    (data: any) => data.status === "pending"
  );

  return (
    <>
      <TradesTabs tradeRequests={PendingtradesData} />
    </>
  );
};

export default PendingTrades;
