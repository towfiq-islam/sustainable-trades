import { apiSlice } from "@/redux/api/apiSlice";

export const chatApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // Get All Conversations
    getAllConversation: builder.query({
      query: ({
        name,
        unread,
        sent,
      }: {
        name?: string;
        unread?: string;
        sent?: string;
      }) => ({
        url: "/api/conversation",
        params: {
          name,
          unread,
          sent,
        },
      }),
      providesTags: ["conversation"],
    }),

    // Get Single Conversation
    getSingleConversation: builder.query({
      query: ({ id, type }: { id: number; type: "private" | "order" }) => ({
        url: "/api/message",
        params: {
          receiver_id: id,
          type,
        },
      }),
      providesTags: (_result, _error, { id }) => [{ type: "conversation", id }],
    }),

    // Send Message
    sendMessage: builder.mutation({
      query: data => ({
        url: "/api/message/send",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, body) => [
        { type: "conversation", id: `${body.type}-${body.receiver_id}` },
        "conversation",
        ,
      ],
    }),

    // Local Pickup Conversations
    getLocalPickupConversation: builder.query({
      query: () => "/api/local-pickup/conversation",
      providesTags: ["conversation"],
    }),
  }),
});

export const {
  useGetAllConversationQuery,
  useGetSingleConversationQuery,
  useSendMessageMutation,
  useGetLocalPickupConversationQuery,
} = chatApi;
