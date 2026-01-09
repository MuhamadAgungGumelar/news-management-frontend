import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import GlobalLoadingBar from '@/components/common/GlobalLoadingBar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'News Management System',
  description: 'Analytics dashboard for news article management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GlobalLoadingBar />
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
