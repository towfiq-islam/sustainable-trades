import { StaticImageData } from "next/image";
import OrderImage from "../../Assets/orderimage.png";

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

export const tradeRequests: TradeRequest[] = [
  {
    id: 378,
    date: "11/28/2023",
    inquiryNumber: 378,
    status: "Pending",
    items: [
      {
        image: OrderImage,
        title: "Organic Musk Bath",
        store: "Holistic",
        quantity: "10 Jars  ",
        totalAmount: 20,
      },
      {
        image: OrderImage,
        title: "Nutrition Work Shop",
        store: "Earths Essence",
        quantity: "3 hours work",
        totalAmount: 30,
      },
    ],
  },
  {
    id: 379,
    date: "11/27/2023",
    inquiryNumber: 379,
    status: "Sent",
    items: [
      {
        image: OrderImage,
        title: "Lavender Scented Candle",
        store: "Candle Co",
        quantity: "10 Pieces",
        totalAmount: 50,
      },
      {
        image: OrderImage,
        title: "Yard Waste Service",
        store: "Earths Essence",
        quantity: "3 hours work",
        totalAmount: 30,
      },
    ],
  },
  {
    id: 380,
    date: "11/26/2023",
    inquiryNumber: 380,
    status: "Approved",
    items: [
      {
        image: OrderImage,
        title: "Lemongrass Sustainable Bar Soap",
        store: "The Soap Shop",
        quantity: "15 Bars",
        totalAmount: 25,
      },
    ],
  },
  {
    id: 381,
    date: "11/25/2023",
    inquiryNumber: 381,
    status: "Canceled",
    items: [
      {
        image: OrderImage,
        title: "Garden Waste Pickup",
        store: "Earths Essence",
        quantity: "5 hours work",
        totalAmount: 40,
      },
    ],
  },
  {
    id: 382,
    date: "11/24/2023",
    inquiryNumber: 382,
    status: "Pending",
    items: [
      {
        image: OrderImage,
        title: "8oz Watermelon Sustainable Bar Soap",
        store: "The Soap Shop",
        quantity: "12 Pieces",
        totalAmount: 60,
      },
      {
        image: OrderImage,
        title: "Yard Waste Service",
        store: "Earths Essence",
        quantity: "12 Pieces",
        totalAmount: 60,
      },
    ],
  },
  {
    id: 383,
    date: "11/23/2023",
    inquiryNumber: 383,
    status: "Sent",
    items: [
      {
        image: OrderImage,
        title: "Rose Sustainable Bar Soap",
        store: "The Soap Shop",
        quantity: "18 Bars",
        totalAmount: 35,
      },
    ],
  },
  {
    id: 384,
    date: "11/22/2023",
    inquiryNumber: 384,
    status: "Approved",
    items: [
      {
        image: OrderImage,
        title: "Compost Waste Collection",
        store: "Earths Essence",
        quantity: "4 hours work",
        totalAmount: 28,
      },
    ],
  },
  {
    id: 385,
    date: "11/21/2023",
    inquiryNumber: 385,
    status: "Canceled",
    items: [
      {
        image: OrderImage,
        title: "Citrus Scented Candle",
        store: "Candle Co",
        quantity: "8 Pieces",
        totalAmount: 45,
      },
    ],
  },
];

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

export const tradetabs = [
  {
    id: 1,
    label: "Pending",
    count: tradeRequests.filter(ln => ln.status === "Pending").length,
  },
  {
    id: 2,
    label: "Sent",
    count: tradeRequests.filter(ln => ln.status === "Sent").length,
  },
  {
    id: 3,
    label: "Approved",
    count: tradeRequests.filter(ln => ln.status === "Approved").length,
  },
  {
    id: 4,
    label: "Canceled",
    count: tradeRequests.filter(ln => ln.status === "Canceled").length,
  },
];

type Tip = {
  question: string;
  answer: string;
};

export const tips: Tip[] = [
  {
    question: "Knowing what your service is worth",
    answer:
      "Understanding the true value of your service helps you negotiate better and ensure you get fair compensation.",
  },
  {
    question: "Building Trust in Trading: Communication is Key",
    answer:
      "Clear and honest communication with trading partners fosters trust and long-term relationships.",
  },
  {
    question: "Crafting Compelling Trade Listings: Dos and Don'ts",
    answer:
      "Present your items clearly, use accurate descriptions, and avoid misleading information to attract serious buyers.",
  },
];

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
  Pending: "bg-[#E48872] text-white font-semibold",
  Denied: "bg-[#8B200C] text-white font-semibold",
};

export const visibilityColors: Record<Product["visibility"], string> = {
  Active: "bg-[#3C665B] text-white font-semibold",
  Inactive: "bg-[#757575] text-white font-semibold",
};
