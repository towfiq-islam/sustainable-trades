"use client";
import moment from "moment";
import Image from "next/image";
import { useState } from "react";
import { NotificationSkeleton } from "@/Components/Loader/Loader";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  useDeleteAllNotificationsMutation,
  useGetNotificationsQuery,
} from "@/redux/api/vendorApi";
import { FiInbox } from "react-icons/fi";
import EmptyState from "@/Components/Common/EmptyState";
import PaginationControl from "./PaginationControl";

type notificationItem = {
  id: number;
  created_at: string;
  data: {
    message: string;
    subject: string;
  };
  user: {
    name: string;
    avatar: string;
  };
};

const ReuseableNotification = () => {
  const [page, setPage] = useState<number>(1);
  const { data: notificationsData, isLoading } = useGetNotificationsQuery(page);
  const [deleteAllNotifications, { isLoading: isPending }] =
    useDeleteAllNotificationsMutation();

  return (
    <div className="">
      <div className="border-b border-[#E5E5E5] flex gap-3 items-center justify-between pb-2">
        <h3 className="text-[30px] md:text-[36px] font-semibold text-secondary-black flex items-center gap-x-2">
          Notifications
        </h3>

        {notificationsData?.data?.notifications?.data?.length !== 0 && (
          <button
            disabled={isPending}
            onClick={() => deleteAllNotifications().unwrap()}
            className="size-10 grid place-items-center rounded-lg cursor-pointer bg-primary-red disabled:cursor-not-allowed disabled:opacity-85"
          >
            {isPending ? (
              <span className="inline-block animate-spin">⏳</span>
            ) : (
              <RiDeleteBin6Line className="text-xl text-white" />
            )}
          </button>
        )}
      </div>

      {isLoading ? (
        Array.from({ length: 3 }).map((_, idx) => (
          <NotificationSkeleton key={idx} />
        ))
      ) : notificationsData?.data?.notifications?.data?.length === 0 ? (
        <EmptyState
          icon={FiInbox}
          title="You're all caught up"
          description="New orders, trades, and messages will show up here as they happen."
        />
      ) : (
        notificationsData?.data?.notifications?.data?.map(
          (notification: notificationItem) => {
            return (
              <div
                key={notification?.id}
                className="border-b last:border-b-0 border-[#E5E5E5] flex justify-between py-2.5 md:py-5 items-center"
              >
                <div className="flex gap-2.5 md:gap-x-4 items-center">
                  <figure className="rounded-full size-12 grid place-items-center bg-accent-red text-white font-semibold relative">
                    {notification?.user?.avatar ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_SITE_URL}/${notification?.user?.avatar}`}
                        alt="profile"
                        fill
                        className="rounded-full size-full object-cover"
                      />
                    ) : (
                      <h3>{notification?.user?.name?.at(0)}</h3>
                    )}
                  </figure>

                  <div>
                    <h3 className="text-[15px] font-semibold text-secondary-black/85 mb-1">
                      {notification?.data?.subject}
                    </h3>

                    <h4 className="text-sm font-normal text-secondary-black/80">
                      {notification?.data?.message}
                    </h4>
                  </div>
                </div>
                <p className="text-[#969696] text-sm font-semibold">
                  {moment(notification?.created_at).fromNow()}
                </p>
              </div>
            );
          },
        )
      )}

      {/* Pagination */}
      <div className="pt-2">
        <PaginationControl
          currentPage={notificationsData?.data?.notifications?.current_page}
          lastPage={notificationsData?.data?.notifications?.last_page}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default ReuseableNotification;
