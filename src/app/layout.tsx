import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import '@/common/styles/globals.scss';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '青望_LAW | 法律大模型',
  description: '"青望_LAW - 法律大模型',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
