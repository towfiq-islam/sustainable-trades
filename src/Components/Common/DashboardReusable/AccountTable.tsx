"use client";
import Link from "next/link";

type DateRange = {
  from: string;
  to: string;
};

type Props = {
  title: string;
  data: orderItem[];
  isLoading: boolean;
  filter: string;
  setFilter: (val: string) => void;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
  year: number;
  setYear: (val: number) => void;
};

type orderItem = {
  id: number;
  order_number: string;
  date: string;
  profit: number;
  revenue: number;
  sales_tax: number;
  shipping: number;
  expenses: number;
  payment_method: string;
  total: number;
  discount: number;
};

const AccountTable = ({
  title,
  data,
  isLoading,
  filter,
  setFilter,
  setDateRange,
  year,
  setYear,
}: Props) => {
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 border-b border-gray-400 pb-2">
        <h4 className="text-[20px] sm:text-[24px] font-semibold text-[#000]">
          {title}
        </h4>

        <select
          className="w-full sm:w-[200px] border rounded-lg p-2"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="last_30_days">Last 30 Days</option>
          <option value="year_to_date">Year to Date</option>
          <option value="custom_date_range">Custom Date Range</option>
          <option value="specific_year">Specific Year</option>
        </select>
      </div>

      {/* Date range */}
      {filter === "custom_date_range" && (
        <div className="flex gap-2 mt-2">
          <input
            type="date"
            onChange={e => setDateRange({ from: e.target.value, to: "" })}
            className="border p-2 rounded"
          />

          <input
            type="date"
            onChange={e =>
              setDateRange(prev => ({ ...prev, to: e.target.value }))
            }
            className="border p-2 rounded"
          />
        </div>
      )}

      {/* Year */}
      {filter === "specific_year" && (
        <input
          type="number"
          value={year}
          onChange={e => setYear(Number(e.target.value))}
          className="border p-2 rounded mt-2"
          placeholder="Enter year (e.g. 2024)"
        />
      )}

      {/* Desktop Table */}
      <div className="overflow-x-auto mt-5">
        <table className="w-full min-w-[800px] border-collapse">
          <thead>
            <tr className="bg-[#274F45] text-[#fff] text-[14px] sm:text-[16px] font-semibold">
              <th className="py-2 px-4 text-left"># Order</th>
              <th className="py-2 px-4 text-left">Revenue</th>
              <th className="py-2 px-4 text-left">Profit</th>
              <th className="py-2 px-4 text-left">Expenses</th>
              <th className="py-2 px-4 text-left">Shipping</th>
              <th className="py-2 px-4 text-left">Sales Tax</th>
              <th className="py-2 px-4 text-left">Discount</th>
              <th className="py-2 px-4 text-left">Payment Method</th>
              <th className="py-2 px-4 text-left">Total</th>
              <th className="py-2 px-4 text-center">Date</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-300 animate-pulse"
                >
                  <td className="py-3 px-4">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="h-4 w-24 bg-gray-200 rounded mx-auto" />
                  </td>
                </tr>
              ))
            ) : data?.length > 0 ? (
              data?.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-300 text-[#13141D] text-[14px] font-medium"
                >
                  <td className="text-[#3470E5]">
                    <Link
                      href={`/dashboard/pro/orders/${row?.id}`}
                      className="py-3 px-4 hover:underline cursor-pointer"
                    >
                      #{row?.order_number}
                    </Link>
                  </td>
                  <td className="py-3 px-4">{row?.revenue.toFixed(2)}</td>
                  <td className="py-3 px-4">{row?.profit.toFixed(2)}</td>
                  <td className="py-3 px-4">{row.expenses.toFixed(2)}</td>
                  <td className="py-3 px-4">{row?.shipping.toFixed(2)}</td>
                  <td className="py-3 px-4">{row.sales_tax.toFixed(2)}</td>
                  <td className="py-3 px-4">{row.discount}</td>
                  <td className="py-3 px-4">{row.payment_method}</td>
                  <td className="py-3 px-4">{row.total}</td>
                  <td className="py-3 px-4 text-center">{row?.date}</td>
                </tr>
              ))
            ) : (
              <p className="text-red-500 pt-5">"No data found"</p>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountTable;
