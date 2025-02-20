import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback } from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import useStore from '@/common/hooks/useStore';

const MenuActiver: React.FC = React.memo(() => {
  const { activeMenu, setActiveMenu } = useStore();

  const handleToggle = useCallback(
    () => setActiveMenu(!activeMenu),
    [activeMenu, setActiveMenu]
  );

  return (
    <AnimatePresence>
      {/* 始终渲染按钮，通过动画控制显示 */}
      <motion.button
        key="sidebar-toggle"
        initial={{ x: activeMenu ? 0 : -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -20, opacity: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleToggle}
        className={`
          fixed top-4 z-50 flex h-10 w-10 items-center justify-center
          rounded-full bg-white shadow-2xl ring-1 ring-gray-200
          hover:bg-gray-50 dark:bg-gray-800 dark:ring-gray-600
          ${activeMenu ? 'left-[260px]' : 'left-4'} // 根据侧边栏实际宽度调整
        `}
      >
        {activeMenu ? (
          <PanelLeftClose className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        ) : (
          <PanelLeftOpen className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        )}
      </motion.button>
    </AnimatePresence>
  );
});

export default MenuActiver;