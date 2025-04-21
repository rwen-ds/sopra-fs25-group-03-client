import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ConfigProvider, theme } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@/styles/globals.css"; // Tailwind CSS + 全局样式

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Group 03",
  description: "sopra-fs25-template-client",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* Tailwind */}
        <div className="min-h-screen bg-white text-black">
          <ConfigProvider
            theme={{
              algorithm: theme.defaultAlgorithm,
              token: {
                colorPrimary: "#22426b",
                borderRadius: 8,
                fontSize: 16,
              },
              components: {
                Button: {
                  colorPrimary: "#75bd9d",
                  algorithm: true,
                  controlHeight: 38,
                },
                Input: {
                  colorBorder: "gray",
                  colorTextPlaceholder: "#888888",
                  algorithm: false,
                },
                Form: {
                  labelColor: "#fff",
                  algorithm: theme.defaultAlgorithm,
                },
              },
            }}
          >
            <AntdRegistry>{children}</AntdRegistry>
          </ConfigProvider>
        </div>
      </body>
    </html>
  );
}
