'use client';

// eslint-disable-next-line simple-import-sort/imports
import { useMediaQuery } from '@react-hook/media-query';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import React, { useCallback } from 'react';
import { CiCircleQuestion } from 'react-icons/ci';

import useStore from '@/common/hooks/useStore';

import MenuActiver from '../elements/MenuActiver';
import Sidebar from '../sidebar/Sidebar';
import { Toaster } from '../ui/toaster';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = React.memo(({ children }) => {
  const pathname = usePathname();
  const { activeMenu, setActiveMenu } = useStore();
  const isMDScreen = useMediaQuery('(min-width: 768px)');
  const { resolvedTheme, setTheme } = useTheme();
  setTheme(resolvedTheme!);

  const handleCloseMenu = useCallback(
    () => setActiveMenu(false),
    [setActiveMenu]
  );

  return (
    <>
      {!(pathname === '/login') &&
        !(pathname === '/register') &&
        activeMenu && (
          <div className="relative flex">
            {!isMDScreen && (
              <div
                className="fixed h-full w-full bg-gray-500 opacity-50"
                onClick={handleCloseMenu}
              ></div>
            )}
            <motion.div
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              className={`z-[10] ${activeMenu && 'fixed w-64 bg-bgDefault'}`}
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
          </div>
        )}
      <motion.div
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        className={
          !(pathname === '/login') && !(pathname === '/register') && activeMenu
            ? 'min-h-screen w-full md:pl-72'
            : 'flex-2 min-h-screen w-full'
        }
        animate={{
          padding:
            !(pathname === '/login') &&
            !(pathname === '/register') &&
            activeMenu &&
            isMDScreen
              ? '0 0 0 256px'
              : '0',
          transition: {
            duration: 0.5,
            type: 'tween',
            stiffness: 200,
          },
        }}
      >
        <div
          className={`flex h-dvh ${pathname === '/login' && 'bg-bgDefault'} ${pathname === '/register' && 'bg-bgDefault'}`}
        >
          {!(pathname === '/login') && !(pathname === '/register') && (
            <MenuActiver />
          )}
          <main className="flex flex-1 flex-col transition-all duration-300">
            {children}
          </main>
          {isMDScreen && (
            <CiCircleQuestion className="absolute bottom-4 right-4 cursor-pointer text-3xl text-gray-300" />
          )}
        </div>
      </motion.div>
      <Toaster />
    </>
  );
});

export default Layout;
