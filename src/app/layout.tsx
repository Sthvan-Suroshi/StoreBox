import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { CSPostHogProvider } from "./_providers/posthog-provider";

export const metadata: Metadata = {
  title: "StoreBox",
  description:
    "StoreBox is a file manager site which can help you store images. It provides clean and faster way to upload files and folders",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <CSPostHogProvider>
        <html lang="en" className={`${geist.variable}`}>
          <body>{children}</body>
        </html>
      </CSPostHogProvider>
    </ClerkProvider>
  );
}
