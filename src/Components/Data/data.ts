import { StaticImageData } from "next/image";

type TradeItem = {
  image: StaticImageData;
  title: string;
  store: string;
  quantity: string;
  totalAmount: number;
};

type TradeRequest = {
  id: number;
  date: string;
  inquiryNumber: number;
  status: "Pending" | "Sent" | "Approved" | "Canceled";
  items: TradeItem[];
};

export const tradegetStatusColor = (status: TradeRequest["status"]): string => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Sent":
      return "bg-blue-100 text-blue-800";
    case "Approved":
      return "bg-gray-100 text-gray-800";
    case "Canceled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

type Product = {
  id: number;
  name: string;
  status: "Approved" | "Pending" | "Denied";
  sku: string;
  stock: number;
  price: number;
  cost: number;
  visibility: "Active" | "Inactive";
  image: string | StaticImageData;
};

export const statusColorsinventory: Record<Product["status"], string> = {
  Approved: "bg-[#3C665B] text-white font-semibold",
  Pending: "bg-accent-red text-white font-semibold",
  Denied: "bg-primary-red text-white font-semibold",
};

export const visibilityColors: Record<Product["visibility"], string> = {
  Active: "bg-[#3C665B] text-white font-semibold",
  Inactive: "bg-[#757575] text-white font-semibold",
};
