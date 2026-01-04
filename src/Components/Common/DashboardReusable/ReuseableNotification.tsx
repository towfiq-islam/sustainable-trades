"use client";
import moment from "moment";
import Image from "next/image";
import { useNotification } from "@/Hooks/api/dashboard_api";
import { NotificationSkeleton } from "@/Components/Loader/Loader";

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
  const { data: notificationsData, isLoading } = useNotification();

  return (
    <>
      <div className="bg-[#FFF] rounded-lg w-full mx-auto shadow-lg">
        <div className="border-b border-[#E5E5E5]">
          <h3 className="text-[30px] md:text-[36px] font-semibold text-[#000] flex items-center gap-x-2 p-3 md:p-5">
            Notifications
          </h3>
        </div>

        {isLoading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <NotificationSkeleton key={idx} />
          ))
        ) : notificationsData?.data?.notifications?.length === 0 ? (
          <div className="p-5 text-center text-red-500">
            No notifications found
          </div>
        ) : (
          notificationsData?.data?.notifications?.map(
            (notification: notificationItem) => {
              return (
                <div
                  key={notification?.id}
                  className="border-b border-[#E5E5E5] flex justify-between p-2.5 md:p-5 items-center"
                >
                  <div className="flex gap-2.5 md:gap-x-5 items-center">
                    <figure className="rounded-full size-[50px] md:size-[65px] grid place-items-center bg-accent-red text-white text-xl font-semibold">
                      {notification?.user?.avatar ? (
                        <Image
                          src={notification?.user?.avatar}
                          alt="profile"
                          height={500}
                          width={500}
                          className="rounded-full size-full object-cover"
                        />
                      ) : (
                        <h3>{notification?.user?.name?.at(0)}</h3>
                      )}
                    </figure>

                    <div>
                      <h3 className="text-[16px] font-bold text-[#000] mb-1">
                        {notification?.data?.subject}
                      </h3>

                      <h4 className="text-[16px] font-normal text-[#000]">
                        {notification?.data?.message}
                      </h4>
                    </div>
                  </div>
                  <p className="text-[#969696] text-sm font-semibold">
                    {moment(notification?.created_at).fromNow()}
                  </p>
                </div>
              );
            }
          )
        )}
      </div>
    </>
  );
};

export default ReuseableNotification;
