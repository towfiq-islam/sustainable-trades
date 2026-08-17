"use client";
import { useParams } from "next/navigation";
import ConversationPage from "@/Components/PageComponents/dashboardPages/messageComponents/ConversationPage";

const page = () => {
  const params = useParams();
  const id = Number(params.id);
  return <ConversationPage receiverId={id} type="private" />;
};

export default page;
