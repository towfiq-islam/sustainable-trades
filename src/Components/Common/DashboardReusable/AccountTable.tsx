"use client";

type titleProps = {
  title: string;
  data: any;
  isLoading: any;
};

type orderItem = {
  order_number: string;
  date: string;
  profit: number;
  revenue: number;
  sales_tax: number;
  shipping: number;
  expenses: number;
};

const AccountTable: React.FC<titleProps> = ({ title, data, isLoading }) => {
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 border-b border-gray-400 pb-2">
        <h4 className="text-[20px] sm:text-[24px] font-semibold text-[#000]">
          {title}
        </h4>

        <select className="w-full sm:w-[150px] border rounded-lg p-2 text-sm sm:text-base">
          <option value="30 Days">30 Days</option>
          <option value="07 Days">07 Days</option>
          <option value="10 Days">10 Days</option>
        </select>
      </div>

      {/* Desktop Table */}
      <div className="overflow-x-auto mt-5">
        <table className="w-full min-w-[800px] border-collapse">
          <thead>
            <tr className="bg-[#274F45] text-[#fff] text-[14px] sm:text-[16px] font-semibold">
              <th className="py-2 px-4 text-left">Order #</th>
              <th className="py-2 px-4 text-left">Revenue</th>
              <th className="py-2 px-4 text-left">Profit</th>
              <th className="py-2 px-4 text-left">Expenses</th>
              <th className="py-2 px-4 text-left">Shipping</th>
              <th className="py-2 px-4 text-left">Sales Tax</th>
              <th className="py-2 px-4 text-center">Date</th>
            </tr>
          </thead>

          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, idx) => (
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
                    <td className="py-3 px-4 text-center">
                      <div className="h-4 w-24 bg-gray-200 rounded mx-auto" />
                    </td>
                  </tr>
                ))
              : data?.length > 0
                ? data?.map((row: orderItem, idx: number) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-300 text-[#13141D] text-[14px] font-medium"
                    >
                      <td className="py-3 px-4 text-[#3470E5]">
                        {row?.order_number}
                      </td>
                      <td className="py-3 px-4">{row?.revenue.toFixed(2)}</td>
                      <td className="py-3 px-4">{row?.profit.toFixed(2)}</td>
                      <td className="py-3 px-4">{row.expenses.toFixed(2)}</td>
                      <td className="py-3 px-4">{row?.shipping.toFixed(2)}</td>
                      <td className="py-3 px-4">{row.sales_tax.toFixed(2)}</td>
                      <td className="py-3 px-4 text-center">{row?.date}</td>
                    </tr>
                  ))
                : "No data found"}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountTable;
