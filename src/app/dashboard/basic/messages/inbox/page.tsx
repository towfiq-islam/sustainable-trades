"use client";
import { use } from "react";
import MessagePage from "@/Components/PageComponents/dashboardPages/messageComponents/MessagePage";

type Props = {
  searchParams: Promise<{ conversation_id: number; receiver_id: number }>;
};

const page = ({ searchParams }: Props) => {
  const { receiver_id, conversation_id } = use(searchParams);

  return (
    <MessagePage receiverId={receiver_id} conversationId={conversation_id} />
  );
};

export default page;
