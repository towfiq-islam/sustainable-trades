"use client";
import ConversationPage from "@/Components/PageComponents/dashboardPages/messageComponents/ConversationPage";
import { useParams } from "next/navigation";

const page = () => {
  const params = useParams();
  const id = Number(params.id);
  return <ConversationPage conversationId={id} type="private" />;
};

export default page;
