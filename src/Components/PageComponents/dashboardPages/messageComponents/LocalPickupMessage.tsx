"use client";
import Link from "next/link";
import Image from "next/image";
import moment from "moment";
import echo from "@/lib/echo";
import useAuth from "@/Hooks/useAuth";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { getLocalPickupConversation } from "@/Hooks/api/chat_api";
import { ConversationCardSkeleton } from "@/Components/Loader/Loader";

type Participant = {
  id: number;
  participant_id: number;
  participant: {
    first_name: string;
    last_name: string;
    avatar: string;
  };
};

type conversationItem = {
  id: number;
  unread_messages_count: number;
  participants: Participant[];
  last_message: {
    message: string;
    message_type: string;
    created_at: string;
  };
};

const LocalPickupMessage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: localPickupConversation, isLoading } =
    getLocalPickupConversation();

  // Pusher Config
  useEffect(() => {
    if (!echo || !user?.id) return;

    echo
      .private(`local-pickup-conversation-channel.${user?.id}`)
      .listen("LocalPickupConversationEvent", (e: any) => {
        console.log("New message event received:", e);
        if (+e?.receiverId === +user?.id) {
          queryClient.invalidateQueries([
            "get-local-pickup-conversation",
          ] as any);
        }
      });
  }, [echo, user?.id]);

  return (
    <>
      {isLoading ? (
        Array.from({ length: 5 }).map((_, index) => (
          <ConversationCardSkeleton key={index} />
        ))
      ) : localPickupConversation?.data?.conversations.length > 0 ? (
        localPickupConversation?.data?.conversations.map(
          (conversation: conversationItem) => (
            <Link
              key={conversation?.id}
              href={`/dashboard/${
                user?.role === "vendor" &&
                user?.membership?.membership_type === "pro"
                  ? "pro"
                  : user?.role === "vendor" &&
                      user?.membership?.membership_type === "basic"
                    ? "basic"
                    : "customer"
              }/messages/order-box/${
                conversation?.participants[0]?.participant_id
              }`}
              className="border-b-2 border-gray-200 py-7 cursor-pointer duration-300 transition-all hover:bg-gray-100 px-5 flex justify-between items-center"
            >
              {/* Left Section */}
              <div className="flex gap-3 items-center">
                {/* Avatar */}
                <figure className="size-16 rounded-full border border-gray-100 grid place-items-center relative bg-accent-red">
                  {conversation?.participants[0]?.participant?.avatar ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_SITE_URL}/${conversation?.participants[0]?.participant?.avatar}`}
                      fill
                      alt="author_img"
                      className="size-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold text-white">
                      {conversation?.participants[0]?.participant?.first_name?.at(
                        0,
                      )}
                    </span>
                  )}
                </figure>

                {/* Info */}
                <div>
                  <h3 className="text-xl font-bold text-secondary-black mb-1">
                    {conversation?.participants[0]?.participant?.first_name}{" "}
                    {conversation?.participants[0]?.participant?.last_name}
                  </h3>

                  <p className="text-gray-500">
                    {conversation?.last_message?.message?.length > 100
                      ? conversation?.last_message?.message.slice(0, 100) +
                        "...."
                      : conversation?.last_message?.message}
                  </p>
                </div>
              </div>

              {/* Right Section */}
              <div className="shrink-0 flex flex-col items-end gap-2">
                <p className="font-semibold text-[#1AA884]">
                  {moment(conversation?.last_message?.created_at).format("ll")}
                </p>

                <p className="bg-[#1AA884] text-white font-bold px-2 text-sm py-1 rounded grid place-items-center">
                  {conversation?.unread_messages_count}
                </p>
              </div>
            </Link>
          ),
        )
      ) : (
        <div className="pt-20 flex justify-center items-center flex-col gap-1">
          <IoChatboxEllipsesOutline className="text-5xl text-gray-700" />
          <p className="text-gray-700 text-lg font-semibold">
            No Conversation Found!!
          </p>
        </div>
      )}
    </>
  );
};

export default LocalPickupMessage;
