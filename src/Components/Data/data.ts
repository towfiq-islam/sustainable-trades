import p1 from "@/Assets/p1.jpg";
import { StaticImageData } from "next/image";
import OrderImage from "../../Assets/orderimage.png";

// All Fake Data
export const data = [
  {
    id: 1,
    title: "notebook",
    description: "desc....",
  },
  {
    id: 2,
    title: "notebook",
    description: "desc....",
  },
  {
    id: 3,
    title: "notebook",
    description: "desc....",
  },
];

export const orders = [
  {
    id: "114-4026893",
    placedDate: "July 5, 2024",
    total: "$46.97",
    arrivingText: "Delivered",
    packageNote: "Your package was left near the front door or porch.",
    productName: "Organic Soap",
    productImage: OrderImage,
    status: "Buy Again",
  },
  {
    id: "114-4026894",
    placedDate: "July 3, 2024",
    total: "$29.99",
    arrivingText: "Local Pickup Completed",
    packageNote: "Your package was left at the reception.",
    productName: "Handmade Lotion",
    productImage: OrderImage,
    status: "Cancelled Orders",
  },
  {
    id: "114-4026895",
    placedDate: "July 1, 2024",
    total: "$59.50",
    arrivingText: "Arriving Tomorrow",
    packageNote: "Delivered to your mailbox.",
    productName: "Shampoo Set",
    productImage: OrderImage,
    status: "Not Shipped",
  },
];

export const data2 = [
  {
    id: 1,
    product_image: [p1, p1, p1, p1],
    product_title: "Organic Coconut Soap",
    product_price: "8.50",
    is_wishlist: true,
  },
  {
    id: 2,
    product_image: [p1, p1, p1, p1],
    product_title: "Organic Coconut Soap",
    product_price: "8.50",
    is_wishlist: true,
  },
  {
    id: 3,
    product_image: [p1, p1, p1, p1],
    product_title: "Organic Coconut Soap",
    product_price: "8.50",
    is_wishlist: true,
  },
  {
    id: 4,
    product_image: [p1, p1, p1, p1],
    product_title: "Organic Coconut Soap",
    product_price: "8.50",
    is_wishlist: true,
  },
];

export const shopdata = [
  {
    id: 1,
    shop_image: p1,
    shop_name:
      "Silk Skin CA Tower, new delhi, India CA Tower, new delhi, India CA Tower, new delhi, India",
    shop_location: "CA Tower, new delhi, India",
  },
  {
    id: 2,
    shop_image: p1,
    shop_name: "Silk Skin",
    shop_location: "CA Tower, new delhi, India",
  },
  {
    id: 3,
    shop_image: p1,
    shop_name: "Silk Skin",
    shop_location: "CA Tower, new delhi, India",
  },
  {
    id: 4,
    shop_image: p1,
    shop_name: "Silk Skin",
    shop_location: "CA Tower, new delhi, India",
  },
];

// export const testimonial = [
//   {
//     id: 1,
//     type: "product",
//     productId: 101,
//     productName: "Wireless Headphones",
//     rating: 2,
//     avatar: p1,
//     review:
//       "I really enjoyed the sound quality and the comfort of these headphones.",
//     date: "2025-08-20",
//   },
//   {
//     id: 2,
//     type: "shop",
//     shopId: 501,
//     shopName: "TechWave Store",
//     rating: 4,
//     review: "Great store with helpful staff. Delivery was quick too!",
//     date: "2025-08-22",
//     avatar: p1,
//   },
//   {
//     id: 3,
//     type: "product",
//     productId: 102,
//     productName: "Smart Watch",
//     avatar: p1,
//     rating: 3,
//     review: "Decent watch with nice features, but battery drains too fast.",
//     date: "2025-08-24",
//   },
// ];

interface Order {
  id: string;
  date: string;
  customer: string;
  email: string;
  optIn: string;
  items: number;
  amount: string;
  fullfill: string;
  status: "Pending" | "Shipped" | "Delivered" | "Canceled" | "Local";
}
export const ordersData: Order[] = [
  {
    id: "155496",
    date: "Jun 25, 2024",
    customer: "Amy Woods",
    email: "email@gmail.com",
    optIn: "Yes",
    items: 3,
    amount: "$16.78",
    status: "Pending",
    fullfill: "Shipping",
  },
  {
    id: "147605",
    date: "Jun 23, 2024",
    customer: "Erick Jones",
    email: "email@gmail.com",
    optIn: "No",
    items: 2,
    amount: "$10.56",
    status: "Pending",
    fullfill: "Local Pickup",
  },
  {
    id: "147586",
    date: "Jun 22, 2024",
    customer: "Rebecca Garcia",
    email: "email@gmail.com",
    optIn: "Yes",
    items: 6,
    amount: "$26.76",
    status: "Pending",
    fullfill: "Local Pickup",
  },
  {
    id: "142501",
    date: "Jun 19, 2024",
    customer: "Ariana Ortiz",
    email: "email@gmail.com",
    optIn: "Yes",
    items: 4,
    amount: "$19.27",
    status: "Shipped",
    fullfill: "Shipping",
  },
  {
    id: "141989",
    date: "Jun 19, 2024",
    customer: "Jody Mason",
    email: "email@gmail.com",
    optIn: "Yes",
    items: 9,
    amount: "$42.77",
    status: "Shipped",
    fullfill: "Local Pickup",
  },
  {
    id: "140989",
    date: "Jun 19, 2024",
    customer: "Dilon Hester",
    email: "email@gmail.com",
    optIn: "Yes",
    items: 9,
    amount: "$42.77",
    status: "Shipped",
    fullfill: "Local Pickup",
  },
  {
    id: "135496",
    date: "Jun 10, 2024",
    customer: "Nia Howard",
    email: "email@gmail.com",
    optIn: "Yes",
    items: 7,
    amount: "$39.78",
    status: "Delivered",
    fullfill: "Shipping",
  },
  {
    id: "134877",
    date: "Jun 7, 2024",
    customer: "Vincent Ramos",
    email: "email@gmail.com",
    optIn: "No",
    items: 6,
    amount: "$39.32",
    status: "Canceled",
    fullfill: "Local Pickup",
  },
  {
    id: "133476",
    date: "Jun 7, 2024",
    customer: "Becca Hart",
    email: "email@gmail.com",
    optIn: "No",
    items: 6,
    amount: "$39.32",
    status: "Canceled",
    fullfill: "Local Pickup",
  },
  {
    id: "129116",
    date: "Jun 2, 2024",
    customer: "Peyton McClaire",
    email: "email@gmail.com",
    optIn: "Yes",
    items: 10,
    amount: "$77.09",
    status: "Local",
    fullfill: "Shipping",
  },
];

export const statusColors = {
  Pending: "bg-[#E48872] text-[#fff] text-[14px] font-semibold",
  Shipped: "bg-[#D4E2CB] text-[14px] font-semibold text-[#000]",
  Delivered: "bg-[#274F45] text-white",
  Canceled: "bg-[#8B200C] text-white",
  Local: "bg-[#E48872] text-white",
};

export type PaymentData = {
  invoice: string;
  purchaseDate: string;
  billingTo: string;
  amount: string;
  paymentMethod: string;
  status: "Paid" | "Pending" | "Failed";
};

export const paymentData: PaymentData[] = [
  {
    invoice: "#INV-5496",
    purchaseDate: "Jun 25, 2024",
    billingTo: "Amy Woods",
    amount: "$16.78",
    paymentMethod: "Stripe",
    status: "Pending",
  },
  {
    invoice: "#INV-7605",
    purchaseDate: "Jun 23, 2024",
    billingTo: "Erick Jones",
    amount: "$10.56",
    paymentMethod: "PayPal",
    status: "Paid",
  },
  {
    invoice: "#INV-7586",
    purchaseDate: "Jun 22, 2024",
    billingTo: "Rebecca Garcia",
    amount: "$26.76",
    paymentMethod: "Square",
    status: "Paid",
  },
  {
    invoice: "#INV-2501",
    purchaseDate: "Jun 19, 2024",
    billingTo: "Ariana Ortiz",
    amount: "$19.27",
    paymentMethod: "Visa 9278",
    status: "Failed",
  },
  {
    invoice: "#INV-0899",
    purchaseDate: "Jun 13, 2024",
    billingTo: "Dilon Hiester",
    amount: "$42.77",
    paymentMethod: "Visa 4213",
    status: "Paid",
  },
  {
    invoice: "#INV-7456",
    purchaseDate: "Jun 13, 2024",
    billingTo: "Mina Nixon",
    amount: "$57.62",
    paymentMethod: "PayPal",
    status: "Paid",
  },
  {
    invoice: "#INV-5496",
    purchaseDate: "Jun 10, 2024",
    billingTo: "Nia Howard",
    amount: "$39.78",
    paymentMethod: "Visa 9485",
    status: "Paid",
  },
  {
    invoice: "#INV-3477",
    purchaseDate: "Jun 7, 2024",
    billingTo: "Vincent Ramos",
    amount: "$39.32",
    paymentMethod: "Stripe",
    status: "Paid",
  },
  {
    invoice: "#INV-1241",
    purchaseDate: "Jun 6, 2024",
    billingTo: "Sam Zavala",
    amount: "$12.99",
    paymentMethod: "Visa 6457",
    status: "Paid",
  },
  {
    invoice: "#INV-9116",
    purchaseDate: "Jun 2, 2024",
    billingTo: "Peyton McClarie",
    amount: "$77.09",
    paymentMethod: "Venmo",
    status: "Paid",
  },
];

export const getStatusColor = (status: PaymentData["status"]) => {
  switch (status) {
    case "Paid":
      return "border-2 border-[#274F45] text-[#274F45] text-[14px] font-semibold";
    case "Pending":
      return "border-2 border-[#E48872] text-[14px] text-[#E48872] font-semibold";
    case "Failed":
      return "border-2 border-[#8B200C] text-[#8B200C] text-[14px] font-semibold";
  }
};

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

// Sample JSON data (v8 style) with 8 trade requests
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

export const productsData: Product[] = [
  {
    id: 1,
    name: "Lavender Soap Bars",
    status: "Approved",
    sku: "12345678",
    stock: 3,
    price: 6.78,
    cost: 3.55,
    visibility: "Active",
    image: OrderImage,
  },
  {
    id: 2,
    name: "Cold-pressed Rosemary Oil",
    status: "Pending",
    sku: "12345678",
    stock: 5,
    price: 9.34,
    cost: 4.75,
    visibility: "Active",
    image: OrderImage,
  },
  {
    id: 3,
    name: "Handmade Cocoa Butter",
    status: "Denied",
    sku: "12345678",
    stock: 3,
    price: 8.46,
    cost: 4.15,
    visibility: "Inactive",
    image: OrderImage,
  },
];

export const statusColorsinventory: Record<Product["status"], string> = {
  Approved: "bg-[#3C665B] text-white font-semibold",
  Pending: "bg-[#E48872] text-white font-semibold",
  Denied: "bg-[#8B200C] text-white font-semibold",
};

export const visibilityColors: Record<Product["visibility"], string> = {
  Active: "bg-[#3C665B] text-white font-semibold",
  Inactive: "bg-[#757575] text-white font-semibold",
};
