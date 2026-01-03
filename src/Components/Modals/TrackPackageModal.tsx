import { getOrderHistory } from "@/Hooks/api/dashboard_api";
import { OrderTrackSkeleton } from "@/Components/Loader/Loader";

type OrderItem = {
  id: number;
  content: string;
  created_at: string;
};

const TrackPackageModal = ({ order_id }: { order_id: number | null }) => {
  const { data: orderHistory, isLoading } = getOrderHistory(order_id);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-primary-green mb-7 text-center">
        📦 Order Tracking
      </h2>

      {isLoading ? (
        Array.from({ length: 3 })?.map((_, idx) => (
          <OrderTrackSkeleton key={idx} />
        ))
      ) : orderHistory?.data?.length === 0 ? (
        <p className="text-center text-primary-red">
          No tracking history available
        </p>
      ) : (
        <ol className="relative border-l border-gray-300">
          {orderHistory?.data?.map((item: OrderItem) => (
            <li key={item.id} className="mb-4 ml-4">
              {/* Dot */}
              <span className="absolute -left-1.5 flex items-center justify-center size-3 bg-accent-red rounded-full ring-4 ring-white" />

              {/* Content */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-300">
                <p className="font-medium text-gray-800">{item.content}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(item?.created_at).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default TrackPackageModal;
