import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ScoreTrack",
  description: "ScoreTrack - Multi-user class marks entry without database",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}>
        <header className="border-b border-blue-100 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-semibold text-blue-700">ScoreTrack</Link>
            <nav className="text-sm">
              <Link className="mr-3 text-blue-600 hover:text-blue-700" href="/student/login">Student</Link>
              <Link className="text-blue-600 hover:text-blue-700" href="/admin/login">Admin</Link>
            </nav>
          </div>
        </header>
        <main className="min-h-[calc(100vh-104px)]">{children}</main>
        <footer className="border-t border-blue-100 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-4 text-xs text-gray-500">No database. Data is stored locally in JSON.</div>
        </footer>
      </body>
    </html>
  );
}
