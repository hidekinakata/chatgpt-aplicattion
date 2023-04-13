import "./globals.css";
import HomeLayout from "@/layouts/HomeLayout";
import { Poppins } from "next/font/google";
import { pop } from "@jridgewell/set-array";
import Head from "next/head";

const poppins = Poppins({
  weight: ["500"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  title: "ChatGPT+",
  description: "ChatGPT based application.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={"font-sans " + poppins.variable}>
        <HomeLayout>{children}</HomeLayout>
      </body>
    </html>
  );
}
