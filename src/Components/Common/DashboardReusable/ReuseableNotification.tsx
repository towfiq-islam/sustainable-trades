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
  const [page, setPage] = useState<string>("");
  const { data: notificationsData, isLoading } = useGetNotificationsQuery(page);
  const [deleteAllNotifications, { isLoading: isPending }] =
    useDeleteAllNotificationsMutation();

  return (
    <>
      <div className="bg-[#FFF] rounded-lg w-full mx-auto shadow-lg">
        <div className="border-b border-[#E5E5E5] flex gap-3 items-center justify-between p-3 md:p-5">
          <h3 className="text-[30px] md:text-[36px] font-semibold text-secondary-black flex items-center gap-x-2">
            Notifications
          </h3>

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
        </div>

        {isLoading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <NotificationSkeleton key={idx} />
          ))
        ) : notificationsData?.data?.notifications?.data?.length === 0 ? (
          <div className="p-5 text-center text-red-500">
            No notifications found
          </div>
        ) : (
          notificationsData?.data?.notifications?.data?.map(
            (notification: notificationItem) => {
              return (
                <div
                  key={notification?.id}
                  className="border-b border-[#E5E5E5] flex justify-between p-2.5 md:p-5 items-center"
                >
                  <div className="flex gap-2.5 md:gap-x-5 items-center">
                    <figure className="rounded-full size-[50px] md:size-[65px] grid place-items-center bg-accent-red text-white font-semibold relative">
                      {notification?.user?.avatar ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_SITE_URL}/${notification?.user?.avatar}`}
                          alt="profile"
                          fill
                          className="rounded-full size-full object-cover"
                        />
                      ) : (
                        <h3 className="text-xl">
                          {notification?.user?.name?.at(0)}
                        </h3>
                      )}
                    </figure>

                    <div>
                      <h3 className="text-[16px] font-bold text-secondary-black mb-1">
                        {notification?.data?.subject}
                      </h3>

                      <h4 className="text-[16px] font-normal text-secondary-black">
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
        {!isLoading && (
          <div className="py-8 flex justify-center items-center gap-2 flex-wrap">
            {notificationsData?.data?.notifications?.links?.map(
              (item: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => item.url && setPage(item.url.split("=")[1])}
                  className={`px-3 py-1 rounded border transition-all duration-200 
        ${
          item.active ? "bg-primary-green text-white" : "bg-white text-gray-700"
        } 
        ${!item.url ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  disabled={!item.url}
                  dangerouslySetInnerHTML={{ __html: item.label }}
                />
              ),
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ReuseableNotification;
