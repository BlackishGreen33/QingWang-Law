import { AnimatePresence, motion } from 'framer-motion';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import * as React from 'react';

import useStore from '@/common/hooks/useStore';

const MenuActiver: React.FC = React.memo(() => {
  const { activeMenu, setActiveMenu } = useStore();

  const handleToggle = React.useCallback(
    () => setActiveMenu(!activeMenu),
    [activeMenu, setActiveMenu]
  );

  const iconClassName = 'h-5 w-5 text-gray-600 dark:text-gray-300';
  const buttonBaseClasses =
    'fixed top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-2xl ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:ring-gray-600';

  return (
    <AnimatePresence mode="wait">
      <motion.button
        key="sidebar-toggle"
        initial={{ x: activeMenu ? 0 : -20, opacity: 0 }}
        animate={{
          x: 0,
          opacity: 1,
          transition: { type: 'spring', stiffness: 300 },
        }}
        exit={{
          x: -20,
          opacity: 0,
          transition: { duration: 0.15 },
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleToggle}
        className={`${buttonBaseClasses} ${
          activeMenu ? 'left-[260px]' : 'left-4'
        }`}
      >
        {activeMenu ? (
          <PanelLeftClose className={iconClassName} />
        ) : (
          <PanelLeftOpen className={iconClassName} />
        )}
      </motion.button>
    </AnimatePresence>
  );
});

export default MenuActiver;
