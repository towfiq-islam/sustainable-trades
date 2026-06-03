import "./globals.css";
import type { Metadata } from "next";
import { Lato } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { getSiteSettings } from "@/Hooks/api/cms_api";
import AosProvider from "@/Provider/AosProvider/AosProvider";
import AuthProvider from "@/Provider/AuthProvider/AuthProvider";
import QueryProvider from "@/Provider/QueryProvider/QueryProvider";


// Fonts
const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  display: "swap",
});

// Metadata
export const metadata: Metadata = {
  title: "Sustainable Trades",
  description: "An E-commerce Website",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let faviconUrl = "/favicon.svg";
  const siteSettings = await getSiteSettings();
  if (siteSettings?.data?.favicon) {
    faviconUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${siteSettings.data.favicon}`;
  }

  return (
    <html lang="en">
      <head>
        <link rel="icon" href={faviconUrl} />
      </head>
      <body className={`${lato.variable} antialiased`}>
        <QueryProvider>
          <AuthProvider>
            <AosProvider>
              <Toaster />
              {children}
            </AosProvider>
            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
