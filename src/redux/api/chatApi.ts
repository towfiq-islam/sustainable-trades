import { apiSlice } from "@/redux/api/apiSlice";

export const chatApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // Get All Conversations
    getAllConversation: builder.query({
      query: ({
        name,
        unread,
        sent,
        page,
      }: {
        name?: string;
        unread?: string;
        sent?: string;
        page?: number;
      }) => ({
        url: "/api/conversation",
        params: {
          name,
          unread,
          sent,
          page,
        },
      }),
      // Cache key ignores `page` so all pages merge into one cache entry
      serializeQueryArgs: ({ queryArgs }) => {
        const { page, ...rest } = queryArgs;
        return rest;
      },
      // Append new page's conversations onto the existing cache
      merge: (currentCache, newResponse, { arg }) => {
        if (arg.page === 1 || !arg.page) return newResponse;
        currentCache.data.conversations.data.push(
          ...newResponse.data.conversations.data,
        );
        currentCache.data.conversations.next_page_url =
          newResponse.data.conversations.next_page_url;
        currentCache.data.conversations.current_page =
          newResponse.data.conversations.current_page;
      },
      // Only refetch when the page actually changes
      forceRefetch: ({ currentArg, previousArg }) =>
        currentArg?.page !== previousArg?.page,
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
      ],
    }),
  }),
});

export const {
  useGetAllConversationQuery,
  useGetSingleConversationQuery,
  useSendMessageMutation,
} = chatApi;
