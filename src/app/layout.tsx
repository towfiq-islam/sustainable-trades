import "./globals.css";
import type { Metadata } from "next";
import { Lato } from "next/font/google";
import AosProvider from "@/Provider/AosProvider/AosProvider";
import AuthProvider from "@/Provider/AuthProvider/AuthProvider";
import QueryProvider from "@/Provider/QueryProvider/QueryProvider";
import ToastProvider from "@/Provider/ToastProvider/ToastProvider";

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
    <html lang="en">
      <body className={`${lato.variable} antialiased`}>
        <QueryProvider>
          <AuthProvider>
            <AosProvider>
              <ToastProvider />
              {children}
            </AosProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
