"use client";
import AccountTable from "@/Components/Common/DashboardReusable/AccountTable";
import { Download } from "@/Components/Svg/SvgContainer";
import { FaAngleRight } from "react-icons/fa";
import { CSVLink } from "react-csv";
import { getAccountingData } from "@/Hooks/api/dashboard_api";
import { useState } from "react";

const headers = [
  { label: "Order#", key: "order_number" },
  { label: "Revenue", key: "revenue" },
  { label: "Profit", key: "profit" },
  { label: "Expenses", key: "expenses" },
  { label: "Shipping", key: "shipping" },
  { label: "Sales Tax", key: "sales_tax" },
  { label: "Date", key: "date" },
];

const page = () => {
  const [filter, setFilter] = useState("last_30_days");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [year, setYear] = useState(2024);
  const { data: accountingData, isLoading } = getAccountingData({
    filter,
    date_from: filter === "custom_date_range" ? dateRange.from : undefined,
    date_to: filter === "custom_date_range" ? dateRange.to : undefined,
    year: filter === "specific_year" ? year : undefined,
  });

  return (
    <>
      <div className="flex flex-wrap w-full justify-between">
        <h3 className="text-[30px] lg:text-4xl font-semibold text-[#000] flex items-center gap-x-2">
          Accounting <FaAngleRight className="mt-2" /> Sales
        </h3>
        <div className="flex flex-wrap gap-3 md:gap-6 items-center w-full md:w-fit ">
          <CSVLink
            data={accountingData?.data?.orders || []}
            headers={headers}
            filename={"sales-report.csv"}
            className="w-full md:w-fit px-6 rounded-[8px] border border-[#77978F] text-[16px] font-semibold text-[#13141D] cursor-pointer duration-300 ease-in-out flex gap-x-2 items-center h-[50px] justify-center hover:translate-y-1"
          >
            <Download />
            Download File
          </CSVLink>
        </div>
      </div>

      <div className="mt-10">
        <AccountTable
          title="Sales"
          data={accountingData?.data?.orders}
          isLoading={isLoading}
          filter={filter}
          setFilter={setFilter}
          setDateRange={setDateRange}
          year={year}
          setYear={setYear}
        />
      </div>

      {/* <div className="mt-10">
        <AccountTable title="Barters and Trades" />
      </div> */}
    </>
  );
};

export default page;
