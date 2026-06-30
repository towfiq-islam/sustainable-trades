import toast from "react-hot-toast";
import useClientApi from "@/Hooks/useClientApi";
import { useQueryClient } from "@tanstack/react-query";

// Get All Conversation
export const getAllConversation = ({
  name,
  unread,
  sent,
}: {
  name?: string;
  unread?: string;
  sent?: string;
}) => {
  return useClientApi({
    method: "get",
    key: ["get-all-conversation", name, unread, sent],
    endpoint: "/api/conversation",
    params: { name, unread, sent },
    queryOptions: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
    },
  });
};

// Get Single Conversation
export const getSingleConversation = (
  id: number,
  type: "private" | "order",
) => {
  return useClientApi({
    method: "get",
    enabled: !!id,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    key: ["get-single-conversation", id, type],
    endpoint: `/api/message?receiver_id=${id}&type=${type}`,
    queryOptions: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
    },
  });
};

// Send Message
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useClientApi({
    method: "post",
    key: ["send-message"],
    endpoint: "/api/message/send",
    onSuccess: (data: any) => {
      if (data?.success) {
        queryClient.invalidateQueries("get-single-conversation" as any);
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });
};

// Get Local Pickup Conversation
export const getLocalPickupConversation = () => {
  return useClientApi({
    method: "get",
    key: ["get-local-pickup-conversation"],
    endpoint: "/api/local-pickup/conversation",
  });
};
