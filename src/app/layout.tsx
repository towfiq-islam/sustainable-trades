import "./globals.css";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Lato, Geist } from "next/font/google";
import ToastProvider from "@/Provider/ToastProvider/ToastProvider";
import ReduxProvider from "@/Provider/ReduxProvider/ReduxProvider";
const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });


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
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${lato.variable} antialiased`}>
        <ReduxProvider>
          <ToastProvider />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
