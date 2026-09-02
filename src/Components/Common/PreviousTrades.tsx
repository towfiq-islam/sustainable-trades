"use client";
import React from "react";
import TradesTabs from "./TradesTabs";

const ApprovedTrades = ({ approveTradeData, isLoading }: any) => {
  const approvedTrades = approveTradeData?.filter(
    (trade: any) => trade.status === "accepted"
  );

  return (
    <>
      <TradesTabs tradeRequests={approvedTrades} isLoading={isLoading} />
    </>
  );
};

export default ApprovedTrades;
