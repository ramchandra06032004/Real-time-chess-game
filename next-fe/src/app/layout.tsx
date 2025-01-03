"use client";
import navbar from "@/components/Navbar/navbar";
import "./globals.css";
import Navbar from "@/components/Navbar/navbar";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider>

      <body     className="dark" >
        <Navbar />
        <Toaster/>
        {children}
      </body>
      </SessionProvider>
    </html>
  );
}
