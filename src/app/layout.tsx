import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Link Alternative Homepage GIF Generator",
  description: "Generate animated GIF for homepage link alternative",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
