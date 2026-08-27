import type { Metadata } from "next";
import "./globals.css";
import { Shell } from "@/components/ui";

export const metadata: Metadata = {
  title: "Secret Manager",
  description: "Secret values are never stored. Track where settings, repositories, deployments, and links live.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
