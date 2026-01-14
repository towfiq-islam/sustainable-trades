"use client";
import moment from "moment";
import Image from "next/image";
import echo from "@/lib/echo";
import toast from "react-hot-toast";
import useAuth from "@/Hooks/useAuth";
import { ImSpinner9 } from "react-icons/im";
import { useParams, useRouter } from "next/navigation";
import { PuffLoader } from "react-spinners";
import { useQueryClient } from "@tanstack/react-query";
import { GoBackSvg } from "@/Components/Svg/SvgContainer";
import React, { useEffect, useRef, useState } from "react";
import { getSingleConversation, useSendMessage } from "@/Hooks/api/chat_api";

type messageItem = {
  id: number;
  sender_id: number;
  message: string;
  created_at: string;
  status: string;
  sender: {
    first_name: string;
    last_name: string;
    avatar: string;
  };
};

const page = () => {
  // Hooks
  const params = useParams();
  const id = Number(params.id);
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  // States
  const [chats, setChats] = useState<messageItem[]>([]);
  const [message, setMessage] = useState<string>("");
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // Mutation & Query
  const { mutate: sendMessageMutation, isPending } = useSendMessage();
  const { data: singleConversation, isLoading: chatLoading } =
    getSingleConversation(id, "private");

  // Set Initial Chat
  useEffect(() => {
    if (singleConversation?.data?.messages) {
      setChats(singleConversation?.data?.messages);
    }
  }, [singleConversation?.data?.messages]);

  // Auth Scroll to bottom
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [chats]);

  // Pusher Config
  useEffect(() => {
    if (!echo || !user?.id) return;

    echo
      .private(`chat-channel.${user?.id}`)
      .listen("MessageSentEvent", (e: any) => {
        console.log("🔔 New message event received:", e);

        if (e?.data?.receiver_id === +user?.id) {
          setChats(prev => {
            const exists = prev.some(msg => msg?.id === e?.data?.id);
            if (exists) return prev;
            return [...prev, e.data];
          });
        }
        queryClient.invalidateQueries(["get-all-conversation"] as any);
      });
  }, [echo, user?.id]);

  // Handle send message
  const handleSend = (e: any) => {
    e.preventDefault();
    if (!message) {
      return toast.error("Please enter your message");
    }

    const tempId = Date.now();

    const tempMessage = {
      id: tempId,
      sender_id: user?.id,
      message: message?.trim(),
      created_at: new Date().toISOString(),
      status: "sending",
    };

    setChats((prev: any) => [...prev, tempMessage]);
    setMessage("");
    e.target.reset();
    const data = { receiver_id: id, message };

    sendMessageMutation(data, {
      onSuccess: (res: any) => {
        setChats(prev =>
          prev?.map(msg =>
            msg?.id === tempId
              ? { ...msg, ...res.message, status: "sent" }
              : msg
          )
        );
      },
      onError: () => {
        setChats(prev =>
          prev?.map(msg =>
            msg?.id === tempId ? { ...msg, status: "failed" } : msg
          )
        );
      },
    });
  };

  return (
    <section className="h-full flex flex-col justify-between">
      {/* Chat Header */}
      <div>
        {/* Back Btn */}
        <button
          onClick={() => router.back()}
          className="flex gap-1 items-center cursor-pointer font-semibold text-primary-green mb-2 group"
        >
          <span className="group-hover:-translate-x-1 duration-300 transition-transform">
            <GoBackSvg />
          </span>
          <span>Back</span>
        </button>

        <div className="border-t-2 border-b-2 py-2.5 border-gray-200 flex gap-5 items-center">
          {/* Author Image */}
          <figure
            className={`size-14 rounded-full border border-gray-100 grid place-items-center relative ${
              chatLoading ? "bg-gray-200 animate-pulse" : "bg-accent-red"
            }`}
          >
            {singleConversation?.data?.conversation?.participants[0]
              ?.participant?.avatar ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_SITE_URL}/${singleConversation?.data?.conversation?.participants[0]?.participant?.avatar}`}
                fill
                alt="author_img"
                className="size-full rounded-full"
              />
            ) : (
              <span className="text-xl font-bold text-white">
                {singleConversation?.data?.conversation?.participants[0]?.participant?.first_name?.at(
                  0
                )}
              </span>
            )}
          </figure>

          {/* Author Name */}
          {chatLoading ? (
            <h3 className="animate-pulse w-40 h-5 rounded bg-gray-200"></h3>
          ) : (
            <h3 className="text-xl font-bold text-secondary-black flex gap-1 items-center">
              <span>
                {
                  singleConversation?.data?.conversation?.participants[0]
                    ?.participant?.first_name
                }
              </span>

              <span>
                {
                  singleConversation?.data?.conversation?.participants[0]
                    ?.participant?.last_name
                }
              </span>
            </h3>
          )}
        </div>
      </div>

      {/* Chat Body */}
      <div
        ref={chatContainerRef}
        className="grow bg-[#eff4ebd3] my-4 p-5 rounded space-y-3 overflow-y-auto chat-scrollbar"
      >
        {chatLoading ? (
          <div className="h-full flex justify-center items-center">
            <PuffLoader color="#274f45" />
          </div>
        ) : (
          chats?.map((msg: messageItem) => (
            <div
              key={msg?.id}
              className={`flex gap-3 ${
                user?.id === msg?.sender_id ? "justify-end" : "justify-start"
              }`}
            >
              {user?.id !== msg?.sender_id && (
                <figure className="size-11 rounded-full relative shrink-0 grid place-items-center bg-accent-red text-sm">
                  {msg?.sender?.avatar ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_SITE_URL}/${msg?.sender?.avatar}`}
                      alt="author"
                      fill
                      className="size-full rounded-full"
                    />
                  ) : (
                    <span className="text-xl font-bold text-white">
                      {msg?.sender?.first_name?.at(0)}
                    </span>
                  )}
                </figure>
              )}

              <div
                className={`relative text-[15px] font-lato leading-[160%] py-3 px-3.5 rounded-[6px] max-w-[550px] shadow ${
                  msg?.status === "sending"
                    ? "bg-gray-50 opacity-80"
                    : msg?.status === "failed"
                    ? "bg-red-100 border border-red-400 text-red-700"
                    : "bg-accent-white"
                }
                `}
              >
                <p
                  dangerouslySetInnerHTML={{
                    __html: (msg?.message).replace(/\n/g, "<br />"),
                  }}
                />

                {/* Time */}
                <span className="text-xs text-gray-500 text-end block mt-1">
                  {moment(msg?.created_at).format("LT")}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Chat Footer */}
      <form onSubmit={handleSend} className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Type your message...."
          disabled={isPending}
          onChange={e => setMessage(e.target.value)}
          className={`border border-gray-300 px-5 py-3 text-sm text-[#071431] w-full outline-0 rounded-lg ${
            isPending && "cursor-not-allowed opacity-80"
          }`}
        />

        <button
          type="submit"
          disabled={isPending}
          className={`bg-primary-green text-white px-7 py-3 font-semibold rounded-lg shrink-0 ${
            isPending ? "cursor-not-allowed opacity-90" : "cursor-pointer"
          }`}
        >
          {isPending ? (
            <ImSpinner9 className="text-white text-lg animate-spin" />
          ) : (
            "Send"
          )}
        </button>
      </form>
    </section>
  );
};

export default page;
