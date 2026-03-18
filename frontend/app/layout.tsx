import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prompt 优化助手",
  description: "让你的 Prompt 更专业",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className="bg-gray-950 text-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
