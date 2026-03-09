import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://thevaluesbracket.vercel.app'
  ),
  title: {
    default: 'The Values Bracket',
    template: '%s | The Values Bracket',
  },
  description: 'Sort 21 values, watch them face off in a bracket, and discover your core 5. Free, fun, ~5 minutes.',
  keywords: ['values bracket', 'core values', 'values assessment', 'personal values', 'self-discovery', 'values tournament'],
  authors: [{ name: 'CultureWright Consulting' }],
  creator: 'CultureWright Consulting',
  publisher: 'CultureWright Consulting',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'The Values Bracket',
    title: 'The Values Bracket',
    description: 'Sort 21 values, watch them face off, and discover your core 5.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Values Bracket',
    description: 'Sort 21 values, watch them face off, and discover your core 5.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
