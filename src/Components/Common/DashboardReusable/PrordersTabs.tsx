"use client";
import AllOrders from "./AllOrders";
import { useState } from "react";
import PendingOrders from "./PendingOrders";
import ShippedOrders from "./ShippedOrders";
import DeliveredOrders from "./DeliveredOrders";
import Fullfillmentorder from "./Fullfillmentorder";
import { getOrders } from "@/Hooks/api/dashboard_api";

const ProordersTabs = () => {
  const [isActive, setIsActive] = useState("orders");
  const [status, setStatus] = useState<string>("");
  const tabs = ["orders", "pending", "confirmed", "delivered", "cancelled"];
  const { data: allOrders, isLoading } = getOrders(status);
  console.log(allOrders?.data);

  return (
    <>
      <div className="flex flex-wrap justify-center sm:justify-start sm:flex-nowrap gap-2.5 sm:gap-5  md:gap-x-10">
        {tabs?.map(tab => (
          <h3
            key={tab}
            onClick={() => {
              setIsActive(tab);
              setStatus(tab === "orders" ? "" : tab);
            }}
            className={`cursor-pointer capitalize text-[16px] md:text-[20px] font-semibold ${
              isActive === tab
                ? "border-b-2 border-[#13141D] text-[#13141D]"
                : "text-[#77978F]"
            }`}
          >
            {tab}
          </h3>
        ))}
      </div>

      <div className="pt-5 md:pt-12">
        {isActive === "All Orders" && <AllOrders />}
        {isActive === "Pending" && <PendingOrders />}
        {isActive === "Shipped" && <ShippedOrders />}
        {isActive === "Local Pickup" && <Fullfillmentorder />}
        {isActive === "Completed" && <DeliveredOrders />}
      </div>
    </>
  );
};

export default ProordersTabs;
