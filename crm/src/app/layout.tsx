import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { isAuthenticated } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GlenRay Systems CRM",
  description: "Internal CRM dashboard for GlenRay Systems",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAuthenticated();

  return (
    <html lang="en">
      <body className={inter.className}>
        {authed ? (
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64">
              <div className="p-8">{children}</div>
            </main>
          </div>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
