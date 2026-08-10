import h1 from "@/Assets/h1.svg";
import h2 from "@/Assets/h2.svg";
import h3 from "@/Assets/h3.svg";
import h4 from "@/Assets/h4.svg";
import h5 from "@/Assets/h5.svg";

export const getNavLinks = (dynamicPage: any) => [
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
