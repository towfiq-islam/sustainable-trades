import h1 from "@/Assets/h1.svg";
import h2 from "@/Assets/h2.svg";
import h3 from "@/Assets/h3.svg";
import h4 from "@/Assets/h4.svg";
import h5 from "@/Assets/h5.svg";
import {
  PEightSvg,
  PElevenSvg,
  PFifteenSvg,
  PFiveSvg,
  PFourSvg,
  PFourteenSvg,
  PNineSvg,
  POneSvg,
  PSevenSvg,
  PSeventeenSvg,
  PSixSvg,
  PSixteenSvg,
  PTenSvg,
  PThirteenSvg,
  PThreeSvg,
  PTwelveSvg,
  PTwoSvg,
} from "@/Components/Svg/SvgContainer";
import { MdOutlineWheelchairPickup } from "react-icons/md";
import { FaTruck } from "react-icons/fa";
export const getNavLinks = (dynamicPage?: any) => [
  { id: 1, label: "Home", path: "/" },
  { id: 2, label: "Shop", path: "/shop" },
  { id: 3, label: "Community", path: "/community-member-spotlight" },
  { id: 4, label: "About", path: "/about", sub_menu: dynamicPage },
  {
    id: 5,
    label: "Help",
    path: "/help",
    sub_menu: [
      {
        id: 51,
        page_title: "How-To Tutorials",
        path: "/help/how-to-tutorials",
        logo: h1,
      },
      { id: 52, page_title: "FAQs", path: "/help/faqs", logo: h2 },
      { id: 53, page_title: "Contact", path: "/help/contact", logo: h3 },
      {
        id: 54,
        page_title: "Terms and Conditions",
        path: "/help/terms-and-conditions",
        logo: h4,
      },
      {
        id: 55,
        page_title: "Infringement Report",
        path: "/help/infringement-report",
        logo: h5,
      },
    ],
  },
  { id: 6, label: "Blog", path: "/blog" },
];

export const proNavLinks = [
  { id: 1, label: "Dashboard", path: "/dashboard/pro/home", icon: <POneSvg /> },
  { id: 2, label: "Orders", path: "/dashboard/pro/orders", icon: <PTwoSvg /> },
  {
    id: 3,
    label: "Trades",
    path: "/dashboard/pro/trades",
    icon: <PThreeSvg />,
  },
  {
    id: 4,
    label: "Listings & Inventory",
    path: "",
    icon: <PFourSvg />,
    subMenus: [
      {
        label: "Listings",
        path: "/dashboard/pro/listing",
        icon: <PFourSvg />,
      },
      {
        label: "Listings",
        path: "/dashboard/pro/view-listing",
        icon: <PFourSvg />,
      },
    ],
  },
  {
    id: 5,
    label: "Payments",
    path: "",
    icon: <PFiveSvg />,
    subMenus: [
      {
        label: "Payment List",
        path: "/dashboard/pro/payments",
        icon: <PFiveSvg />,
      },
      {
        label: "Payment Integration",
        path: "/dashboard/pro/payment-method",
        icon: <PFiveSvg />,
      },
      {
        label: "Sales Tax",
        path: "/dashboard/pro/taxes",
        icon: <PFiveSvg />,
      },
    ],
  },
  {
    id: 6,
    label: "Accounting",
    path: "/dashboard/pro/accounting",
    icon: <PSixSvg />,
  },
  {
    id: 7,
    label: "Membership",
    path: "/dashboard/pro/membership",
    icon: <PSevenSvg />,
  },
  {
    id: 8,
    label: "Discounts",
    path: "/dashboard/pro/discounts",
    icon: <PEightSvg />,
  },
  {
    id: 8,
    label: "Local Pickup",
    path: "/dashboard/pro/local-pickup",
    icon: <MdOutlineWheelchairPickup className="text-xl" />,
  },
  {
    id: 8,
    label: "Local Delivery",
    path: "/dashboard/pro/local-delivery",
    icon: <FaTruck className="text-xl" />,
  },
  {
    id: 9,
    label: "Shipping",
    path: "/dashboard/pro/shipping",
    icon: <PNineSvg />,
  },
  {
    id: 10,
    label: "Favorites",
    path: "/dashboard/pro/favorites",
    icon: <PTenSvg />,
  },
  {
    id: 11,
    label: "Member Spotlight",
    path: "/dashboard/pro/member-spotlight",
    icon: <PElevenSvg />,
  },
  {
    id: 12,
    label: "Notification",
    path: "/dashboard/pro/notification",
    icon: <PTwelveSvg />,
  },
  {
    id: 13,
    label: "Messages",
    path: "/dashboard/pro/messages",
    icon: <PThirteenSvg />,
  },
  {
    id: 14,
    label: "Reviews",
    path: "/dashboard/pro/reviews",
    icon: <PFourteenSvg />,
  },
  {
    id: 15,
    label: "Settings",
    path: "/dashboard/pro/settings",
    icon: <PFifteenSvg />,
  },
];

export const basicNavLinks = [
  {
    id: 16,
    label: "Dashboard",
    path: "/dashboard/basic/home",
    icon: <POneSvg />,
  },
  {
    id: 17,
    label: "Listings",
    path: "/dashboard/basic/listing",
    icon: <PSixteenSvg />,
  },
  {
    id: 18,
    label: "Trades",
    path: "/dashboard/basic/trades",
    icon: <PThreeSvg />,
  },
  {
    id: 19,
    label: "Membership",
    path: "/dashboard/basic/membership",
    icon: <PSevenSvg />,
  },
  {
    id: 20,
    label: "Favorites",
    path: "/dashboard/basic/favorites",
    icon: <PTenSvg />,
  },
  {
    id: 22,
    label: "Notification",
    path: "/dashboard/basic/notification",
    icon: <PTwelveSvg />,
  },
  {
    id: 23,
    label: "Messages",
    path: "/dashboard/basic/messages",
    icon: <PThirteenSvg />,
  },
  {
    id: 24,
    label: "Settings",
    path: "/dashboard/basic/settings",
    icon: <PFifteenSvg />,
  },
];

export const customerNavLinks = [
  {
    id: 25,
    label: "Orders",
    path: "/dashboard/customer/orders",
    icon: <PTwoSvg />,
  },
  {
    id: 26,
    label: "Favorites",
    path: "/dashboard/customer/favorites",
    icon: <PTenSvg />,
  },
  {
    id: 27,
    label: "Cart",
    path: "/dashboard/customer/cart",
    icon: <PSeventeenSvg />,
  },
  {
    id: 28,
    label: "Messages",
    path: "/dashboard/customer/messages",
    icon: <PThirteenSvg />,
  },
  {
    id: 30,
    label: "Reviews",
    path: "/dashboard/customer/reviews",
    icon: <PFourteenSvg />,
  },
  {
    id: 31,
    label: "Settings",
    path: "/dashboard/customer/settings",
    icon: <PFifteenSvg />,
  },
];
