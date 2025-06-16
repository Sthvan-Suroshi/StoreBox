import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { PostHogProvider } from "./_providers/posthog-provider";
import { Toaster } from "sonner";

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
      <PostHogProvider>
        <html lang="en" className={`${geist.variable}`}>
          <body>
            {children}
            <Toaster />
          </body>
        </html>
      </PostHogProvider>
    </ClerkProvider>
  );
}
