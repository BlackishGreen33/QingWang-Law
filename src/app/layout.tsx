import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import '@/common/styles/globals.scss';

import Providers from '@/common/components/providers/Providers';

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
    <html lang="zh-cn">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
