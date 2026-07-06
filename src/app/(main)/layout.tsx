import React from "react";
import Footer from "@/Shared/Footer";
import Navbar from "@/Shared/Navbar";
import { getDynamicPages } from "@/lib/cms.api";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const dynamicPage = await getDynamicPages();

  return (
    <>
      <Navbar dynamicPage={dynamicPage?.data} />
      <main>{children}</main>
      <Footer dynamicPage={dynamicPage?.data} />
    </>
  );
};

export default MainLayout;
