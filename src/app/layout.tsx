import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wisconsin Inmate Lookup",
  description: "Look up inmates in Wisconsin county jails",
  keywords: ["wisconsin", "inmates", "jail", "county", "lookup"],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-foreground bg-background-gradient min-h-screen`}
      >
        <Header />
        {children}
        <footer className="bg-card-bg border-t border-card-border py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-foreground opacity-70 text-sm mb-2">
            Data is updated daily at 8:00 AM CST from official county sources.
          </p>
          <p className="text-foreground opacity-50 text-sm">
            &copy; {new Date().getFullYear()} Wisconsin Inmate Lookup System
          </p>
        </div>
      </footer>
      </body>
    </html>
  );
}
