'use client';

import { useMediaQuery } from '@react-hook/media-query';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import React from 'react';

import useStore from '@/common/hooks/useStore';

import Sidebar from '../sidebar/Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = React.memo(({ children }) => {
  const pathname = usePathname();
  const { activeMenu } = useStore();
  const isMDScreen = useMediaQuery('(min-width: 768px)');
  const { resolvedTheme, setTheme } = useTheme();
  setTheme(resolvedTheme!);

  return (
    <>
      {!(pathname === '/auth') && (
        <motion.div
          className={`z-[10] dark:bg-secondary-dark-bg ${activeMenu && 'fixed w-64 bg-bgDefault'}`}
          animate={{
            x: activeMenu ? 0 : -100,
            opacity: activeMenu ? 1 : 0,
            transition: {
              duration: 0.5,
              delay: 0.1,
              type: 'tween',
              stiffness: 200,
            },
          }}
        >
          <Sidebar />
        </motion.div>
      )}
      <motion.div
        className={
          !(pathname === '/auth') && activeMenu
            ? 'min-h-screen w-full dark:bg-main-dark-bg md:pl-72'
            : 'flex-2 min-h-screen w-full dark:bg-main-dark-bg'
        }
        animate={{
          padding: !(pathname === '/auth') && activeMenu && isMDScreen ? '0 0 0 256px' : '0',
          transition: {
            duration: 0.5,
            type: 'tween',
            stiffness: 200,
          },
        }}
      >
        <div
          className={`flex h-dvh flex-col ${pathname === '/auth' && 'bg-bgDefault'}`}
        >
          <main className="flex-1 transition-all duration-300">{children}</main>
        </div>
      </motion.div>
    </>
  );
});

export default Layout;
