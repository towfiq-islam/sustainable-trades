import "./globals.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import ToastProvider from "@/Provider/ToastProvider/ToastProvider";
import ReduxProvider from "@/Provider/ReduxProvider/ReduxProvider";
import LocationProvider from "@/Provider/LocationProvider/LocationProvider";
import ScrollToTop from "@/Shared/ScrollToTop";
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

// Metadata
export const metadata: Metadata = {
  title: "Sustainable Trades",
  description:
    "An online marketplace making it easy to shop local and sustainably. Connect with local food, artisans, services, and businesses that are good for people and the planet.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${geist.variable} antialiased`}>
        <ScrollToTop />
        <ReduxProvider>
          <LocationProvider>
            <ToastProvider />
            {children}
          </LocationProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
