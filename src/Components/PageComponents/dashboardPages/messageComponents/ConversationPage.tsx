"use client";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import echo from "@/lib/echo";
import toast from "react-hot-toast";
import useAuth from "@/Hooks/useAuth";
import { ImSpinner9 } from "react-icons/im";
import { useRouter } from "next/navigation";
import { PuffLoader } from "react-spinners";
import { useQueryClient } from "@tanstack/react-query";
import { GoBackSvg } from "@/Components/Svg/SvgContainer";
import { useEffect, useRef, useState } from "react";
import { getSingleConversation, useSendMessage } from "@/Hooks/api/chat_api";
import { FiPaperclip, FiSmile, FiSend } from "react-icons/fi";
import EmojiPicker from "emoji-picker-react";

// ---- Types ----

type Attachment = {
  id: number;
  file_name: string;
  file_path: string;
  isLocal: boolean;
  file_type: string;
};

type CartProductImage = { id: number; product_id: number; image: string };

type CartProduct = {
  id: number;
  product_name: string;
  product_price: number;
  images: CartProductImage[];
};

type CartItem = {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  product: CartProduct;
};

type OrderItem = CartItem & { order_id: number };

type Cart = {
  id: number;
  user_id: number;
  shop_id: number;
  cart_items: CartItem[];
};
type Order = { id: number; order_items: OrderItem[] };

export type MessageItem = {
  id: number;
  sender_id: number;
  receiver_id?: number;
  conversation_id?: number;
  message: string;
  message_type: string;
  created_at: string;
  status?: string;
  cart?: Cart | null;
  order?: Order | null;
  attachments?: Attachment[];
  sender?: {
    first_name: string;
    last_name: string | null;
    avatar: string | null;
  };
};

export type ConversationType = "private" | "order";

interface ConversationPageProps {
  conversationId: number;
  type: ConversationType;
  compact?: boolean;
}
// ---- Helpers ----

function getDashboardSegment(user: any): string {
  if (user?.role === "customer") return "customer";
  return user?.membership?.membership_type === "pro" ? "pro" : "basic";
}

// ---- Sub-components ----

function ProductCard({
  image,
  name,
  qty,
  price,
  href,
}: {
  image?: string;
  name: string;
  qty: number;
  price: number;
  href: string;
}) {
  return (
    <Link href={href} className="flex items-center gap-3 group">
      <figure className="size-16 rounded-lg overflow-hidden relative shrink-0 bg-gray-100">
        {image && (
          <Image
            src={`${process.env.NEXT_PUBLIC_SITE_URL}/${image}`}
            alt={name}
            fill
            unoptimized
            className="object-cover"
          />
        )}
      </figure>
      <div className="flex-1">
        <h4 className="font-semibold text-sm text-secondary-black group-hover:underline">
          {name}
        </h4>
        <p className="text-sm text-gray-500">Qty: {qty}</p>
        <p className="text-sm font-bold text-primary-green">${price}</p>
      </div>
    </Link>
  );
}

function AttachedItemCard({
  message,
  time,
  children,
}: {
  message: string;
  time: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <p className="text-sm text-gray-700">{message}</p>
      </div>
      <div className="p-4 space-y-4">{children}</div>
      <div className="px-4 pb-3 text-right">
        <span className="text-xs text-gray-500">{time}</span>
      </div>
    </div>
  );
}

// ---- Main Component ----

const ConversationPage = ({
  conversationId,
  type,
  compact,
}: ConversationPageProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const onEmojiClick = (emojiData: any) => {
    setMessage(prev => prev + emojiData.emoji);
  };
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    setSelectedFiles(prev => [...prev, ...files]);

    const imagePreviews = files
      .filter(file => file.type.startsWith("image/"))
      .map(file => URL.createObjectURL(file));

    setPreviewUrls(prev => [...prev, ...imagePreviews]);
  };

  const removeAttachment = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));

    setPreviewUrls(prev => {
      const url = prev[index];

      if (url) {
        URL.revokeObjectURL(url);
      }

      return prev.filter((_, i) => i !== index);
    });
  };

  const [chats, setChats] = useState<MessageItem[]>([]);
  const [message, setMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const { mutate: sendMessageMutation, isPending } = useSendMessage();
  const { data: singleConversation, isLoading: chatLoading } =
    getSingleConversation(conversationId, type);

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  useEffect(() => {
    if (singleConversation?.data?.messages) {
      setChats(singleConversation.data.messages);
    }
  }, [singleConversation?.data?.messages]);

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

    const echoInstance = echo;
    const channelName = `chat-channel.${user.id}`;

    const channel = echo.private(channelName);
    channel
      .listen("MessageSentEvent", (e: any) => {
        console.log("New message event received:", e);
        if (e?.data?.receiver_id === +user.id) {
          setChats(prev => {
            const exists = prev.some(msg => msg.id === e.data.id);
            return exists ? prev : [...prev, e.data];
          });
        }
        queryClient.invalidateQueries(["get-all-conversation"] as any);
      })
      .error((error: any) => {
        console.error("Channel subscription error:", error);
      });

    // Cleanup
    return () => {
      echoInstance.leave(`chat-channel.${user.id}`);
    };
  }, [user?.id]);

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const tempId = Date.now();

    const tempAttachments = selectedFiles.map((file, index) => ({
      id: -(index + 1),
      file_name: file.name,
      file_path: URL.createObjectURL(file),
      file_type: file.type,
      isLocal: true,
    }));

    setChats(prev => [
      ...prev,
      {
        id: tempId,
        sender_id: user?.id,
        message: message.trim(),
        created_at: new Date().toISOString(),
        status: "sending",
        message_type: selectedFiles?.length > 0 ? "file" : "text",
        attachments: tempAttachments,
      },
    ]);
    setMessage("");
    (e.target as HTMLFormElement).reset();

    const formData = new FormData();

    formData.append("receiver_id", String(conversationId));
    if (message) {
      formData.append("message", message);
    }

    if (type === "order") {
      formData.append("type", "order");
    }

    selectedFiles.forEach(file => {
      formData.append("file[]", file);
    });

    sendMessageMutation(formData, {
      onSuccess: (res: any) => {
        setSelectedFiles([]);

        setChats(prev =>
          prev.map(msg =>
            msg.id === tempId
              ? { ...msg, ...res.message, status: "sent" }
              : msg,
          ),
        );
      },
      onError: () => {
        setChats(prev =>
          prev.map(msg =>
            msg.id === tempId ? { ...msg, status: "failed" } : msg,
          ),
        );
      },
    });
  };

  const participant =
    singleConversation?.data?.conversation?.participants?.[0]?.participant;
  const dashboardSegment = getDashboardSegment(user);

  return (
    <section className="h-full flex flex-col justify-between">
      <div>
        {/* Header */}
        {!compact && (
          <button
            onClick={() => router.back()}
            className="flex gap-1 items-center cursor-pointer font-semibold text-primary-green mb-2 group"
          >
            <span className="group-hover:-translate-x-1 duration-300 transition-transform">
              <GoBackSvg />
            </span>
            <span>Back</span>
          </button>
        )}

        <div
          className={`border-t-2 border-b-2 py-2.5 border-gray-200 flex items-center  ${compact ? "gap-3" : "gap-5"}`}
        >
          <figure
            className={`rounded-full border border-gray-100 grid place-items-center relative
              ${compact ? "size-12" : "size-14"}
              ${chatLoading ? "bg-gray-200 animate-pulse" : "bg-accent-red"}`}
          >
            {participant?.avatar ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_SITE_URL}/${participant.avatar}`}
                fill
                unoptimized
                alt="author_img"
                className="size-full rounded-full"
              />
            ) : (
              <span className="text-xl font-bold text-white">
                {participant?.first_name?.at(0)}
              </span>
            )}
          </figure>

          {chatLoading ? (
            <h3 className="animate-pulse w-40 h-5 rounded bg-gray-200" />
          ) : (
            <h3
              className={`${compact ? "text-base" : "text-xl"} font-bold text-secondary-black flex gap-1 items-center`}
            >
              <span>{participant?.first_name}</span>
              <span>{participant?.last_name}</span>
            </h3>
          )}
        </div>
      </div>

      {/* Body */}
      <div
        ref={chatContainerRef}
        className={`grow bg-[#eff4ebd3] my-4 rounded space-y-3 overflow-y-auto chat-scrollbar  ${compact ? "p-3" : "p-5"}`}
      >
        {chatLoading ? (
          <div className="h-full flex justify-center items-center">
            <PuffLoader color="#274f45" />
          </div>
        ) : (
          chats.map(msg => {
            const time = moment(msg.created_at).format("LT");
            const isSender = user?.id === msg.sender_id;
            const bubbleClass =
              msg.status === "sending"
                ? "bg-gray-50 opacity-80"
                : msg.status === "failed"
                  ? "bg-red-100 border border-red-300 text-primary-red"
                  : "bg-accent-white";

            const formattedMessage = msg.message
              ? msg.message
                  .replace(
                    /\/dashboard\/pro\/orders\/(\d+)/g,
                    `/dashboard/${dashboardSegment}/orders/$1`,
                  )
                  .replace(/\n/g, "<br />")
              : "";

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isSender ? "justify-end" : "justify-start"}`}
              >
                {!compact && !isSender && (
                  <figure className="size-11 rounded-full relative shrink-0 grid place-items-center bg-accent-red">
                    {msg.sender?.avatar ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_SITE_URL}/${msg.sender.avatar}`}
                        alt="author"
                        fill
                        unoptimized
                        className="size-full rounded-full"
                      />
                    ) : (
                      <span className="text-xl font-bold text-white">
                        {msg.sender?.first_name?.at(0)}
                      </span>
                    )}
                  </figure>
                )}

                <div className="max-w-[550px]">
                  {/* Plain message */}
                  {!msg.cart && !msg.order && (
                    <div
                      className={`${compact ? "text-sm py-2 px-3" : "text-[15px] py-3 px-3.5"} relative font-lato leading-[160%] rounded-[6px] shadow ${bubbleClass}`}
                    >
                      <div>
                        {msg.message && (
                          <p
                            dangerouslySetInnerHTML={{
                              __html: formattedMessage,
                            }}
                          />
                        )}

                        {msg?.attachments && msg?.attachments?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {msg.attachments?.map(file => {
                              const imageUrl = (file as any).isLocal
                                ? file.file_path
                                : `${process.env.NEXT_PUBLIC_SITE_URL}/${file.file_path}`;

                              return (
                                <img
                                  key={file.id}
                                  src={imageUrl}
                                  alt={file.file_name}
                                  onClick={() => setPreviewImage(imageUrl)}
                                  className="w-32 h-32 rounded-lg object-cover border border-gray-200 cursor-pointer hover:opacity-90 transition"
                                />
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <span
                        className={` ${compact ? "text-[10px]" : "text-xs mt-1"} text-gray-500 text-end block`}
                      >
                        {time}
                      </span>
                    </div>
                  )}

                  {/* Cart message */}
                  {msg.cart && (
                    <AttachedItemCard message={msg.message} time={time}>
                      {msg.cart.cart_items.map(item => (
                        <ProductCard
                          key={item.id}
                          href={`/product-details/${item.product.id}`}
                          image={item.product.images?.[0]?.image}
                          name={item.product.product_name}
                          qty={item.quantity}
                          price={item.product.product_price}
                        />
                      ))}
                    </AttachedItemCard>
                  )}

                  {/* Order message */}
                  {msg.order && (
                    <AttachedItemCard message={msg.message} time={time}>
                      {msg.order.order_items.map(item => (
                        <ProductCard
                          key={item.id}
                          href={`/dashboard/${dashboardSegment}/orders/${item.order_id}`}
                          image={item.product.images?.[0]?.image}
                          name={item.product.product_name}
                          qty={item.quantity}
                          price={item.product.product_price}
                        />
                      ))}
                    </AttachedItemCard>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Preview File */}
      {selectedFiles.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-3">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="relative border border-gray-200 rounded-lg overflow-hidden"
            >
              {file.type.startsWith("image/") ? (
                <img
                  src={previewUrls[index]}
                  alt={file.name}
                  className="w-20 h-20 object-cover"
                />
              ) : (
                <div className="w-20 h-20 flex items-center justify-center bg-gray-100 text-xs p-2 text-center">
                  {file.name}
                </div>
              )}

              <button
                type="button"
                onClick={() => removeAttachment(index)}
                className="absolute top-1 right-1 bg-primary-red cursor-pointer text-white rounded-full w-5 h-5 text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <form onSubmit={handleSend} className="flex items-center gap-3">
        <p
          className={`${compact ? "px-3 py-2.5" : "px-5 py-3"} border border-gray-300 text-sm text-[#071431] w-full rounded-lg relative`}
        >
          <input
            type="text"
            placeholder="Type your message...."
            disabled={isPending}
            value={message}
            onChange={e => setMessage(e.target.value)}
            className={`outline-none w-full h-full ${
              isPending && "cursor-not-allowed opacity-80"
            }`}
          />

          {/* Emoji */}
          {!compact && (
            <div className="absolute top-3 right-14 text-secondary-gray cursor-pointer">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="cursor-pointer"
              >
                <FiSmile size={20} />
              </button>

              {showEmojiPicker && (
                <div className="absolute bottom-12 right-0 z-50">
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
              )}
            </div>
          )}

          {/* Attachment */}
          {!compact && (
            <p>
              <label
                htmlFor="attachment"
                className="absolute top-1/2 -translate-y-1/2 right-4 text-secondary-gray cursor-pointer"
              >
                <FiPaperclip size={20} />
              </label>

              <input
                id="attachment"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            </p>
          )}
        </p>

        <button
          type="submit"
          disabled={
            isPending || (!message.trim() && selectedFiles.length === 0)
          }
          className={`bg-primary-green cursor-pointer text-white py-2.5 font-medium rounded-lg shrink-0 disabled:cursor-not-allowed disabled:opacity-70 ${compact ? "text-sm px-3.5" : "px-5"}`}
        >
          {isPending ? (
            <ImSpinner9 className="text-white text-lg animate-spin" />
          ) : (
            <span className="flex gap-2 items-center">
              <FiSend size={18} />
              Send
            </span>
          )}
        </button>
      </form>

      {/* Preview chat attachment */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] rounded-lg"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 text-white text-3xl cursor-pointer"
            >
              ×
            </button>

            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default ConversationPage;
