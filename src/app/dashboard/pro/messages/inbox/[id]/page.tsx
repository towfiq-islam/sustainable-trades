"use client";
import { use } from "react";
import ConversationPage from "@/Components/PageComponents/dashboardPages/messageComponents/ConversationPage";

type Props = {
  searchParams: Promise<{ type: string }>;
  params: Promise<{ id: number }>;
};

const page = ({ params, searchParams }: Props) => {
  const { id } = use(params);
  const { type } = use(searchParams);
  return <ConversationPage receiverId={id} type={type} />;
};

export default page;
