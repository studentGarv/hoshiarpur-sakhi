import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Noto_Sans } from 'next/font/google';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

// Punjabi font support (Noto Sans supports Gurmukhi script)
const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HoshiarpurSakhi - Discover Temples & Gurdwaras in Hoshiarpur',
  description: 'Comprehensive directory of 40+ temples and gurdwaras in Hoshiarpur district with detailed information, maps, and AI-powered assistance.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to Google Fonts for Gurmukhi support */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
