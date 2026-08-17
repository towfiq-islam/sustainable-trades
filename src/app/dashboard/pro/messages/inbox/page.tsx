"use client";
import { use } from "react";
import ConversationPage from "@/Components/PageComponents/dashboardPages/messageComponents/ConversationPage";

type Props = {
  searchParams: Promise<{ conversation_id: number; receiver_id: number }>;
};

const page = ({ searchParams }: Props) => {
  const { receiver_id, conversation_id } = use(searchParams);

  return (
    <ConversationPage
      receiverId={receiver_id}
      conversationId={conversation_id}
    />
  );
};

export default page;
