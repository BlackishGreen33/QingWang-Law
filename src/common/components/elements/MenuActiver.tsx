import { motion } from 'framer-motion';
import React, { useCallback } from 'react';

import useStore from '@/common/hooks/useStore';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

const MenuActiver: React.FC = React.memo(() => {
  const { activeMenu, setActiveMenu } = useStore();

  const handleActiveMenu = useCallback(
    () => setActiveMenu(!activeMenu),
    [activeMenu, setActiveMenu]
  );

  return (
    <div className="flex h-dvh items-center px-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={handleActiveMenu}
              className="relative rounded-full text-xl text-gray-500 hover:bg-light-gray"
            >
              |
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-black text-white">
            <p>{activeMenu ? '关闭侧边栏' : '打开侧边栏'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
});

export default MenuActiver;
