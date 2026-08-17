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
      query: ({
        receiver_id,
        conversation_id,
      }: {
        receiver_id: number;
        conversation_id: number;
      }) => ({
        url: "/api/message",
        params: {
          receiver_id,
          conversation_id,
        },
      }),
      providesTags: (_result, _error, { receiver_id }) => [
        { type: "conversation", receiver_id },
      ],
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
  }),
});

export const {
  useGetAllConversationQuery,
  useGetSingleConversationQuery,
  useSendMessageMutation,
} = chatApi;
