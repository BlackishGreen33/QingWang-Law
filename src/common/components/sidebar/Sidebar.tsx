'use client';

import axios, { AxiosError } from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { FaUser, FaUsers } from 'react-icons/fa';
import { PiNotePencilBold } from 'react-icons/pi';

import MenuActiver from '@/common/components/elements/MenuActiver';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/common/components/ui/avatar';
import { Button } from '@/common/components/ui/button';
import { API_URL } from '@/common/constants';
import useStore from '@/common/hooks/useStore';
import uniqueKeyUtil from '@/common/utils/keyGen';
import { cn } from '@/common/utils/utils';

import Room from './Room';

type Room = {
  title: string;
  chat_id: string;
};

const Sidebar: React.FC = React.memo(() => {
  const router = useRouter();
  const { activeMenu } = useStore();

  const [rooms, setRooms] = React.useState<Room[]>([]);

  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token')!;
  }

  // 创建新聊天室
  const createRoom = async () => {
    try {
      const chatroom = await axios.post(
        `${API_URL}/api/chat/new_chat`,
        {},
        { headers: { Authorization: token } }
      );
      setRooms([...rooms, chatroom.data]);
      router.push(`/chat/${chatroom.data.chat_id}`);
    } catch (error) {
      if ((error as AxiosError).response?.status === 401) {
        router.push('/login');
      }
    }
  };

  // 获取聊天室列表
  React.useEffect(() => {
    const getChatrooms = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/chat/list`,
          {
            headers: { Authorization: token },
          }
        );
        setRooms(response.data.chats);
      } catch (error) {
        if ((error as AxiosError).response?.status === 401) {
          router.push('/login');
        }
      }
    };
    getChatrooms();
  }, [token, router]);

  // 删除聊天室
  const handleDeleteRoom = (chatId: string) => {
    setRooms(rooms.filter((room) => room.chat_id !== chatId));
  };

  // 重命名聊天室
  const handleRenameRoom = (chatId: string, newTitle: string) => {
    setRooms(
      rooms.map((room) =>
        room.chat_id === chatId ? { ...room, title: newTitle } : room
      )
    );
  };

  return (
    <>
      {/* 侧边栏容器 */}
      <motion.div
        className={cn(
          'fixed left-0 top-0 h-full bg-white shadow-xl transition-all duration-300',
          'flex flex-col dark:border-gray-700 dark:bg-gray-800',
          activeMenu ? 'w-64' : 'w-16' // 修改为固定最小宽度
        )}
      >
        {/* 始终显示的顶部区域 */}
        <div className="flex flex-col items-center border-b p-2 dark:border-gray-700">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="cursor-pointer p-2"
          >
            <Link href="/">
              <Avatar className="h-10 w-10 border-2 border-primary">
                <AvatarImage
                  src="https://raw.githubusercontent.com/BlackishGreen33/QingWang-Law/main/public/logo.png"
                  alt="Logo"
                />
                <AvatarFallback>Law</AvatarFallback>
              </Avatar>
            </Link>
          </motion.div>

          {/* 新建按钮（迷你模式） */}
          {!activeMenu && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="mt-4"
            >
              <PiNotePencilBold
                onClick={createRoom}
                className="cursor-pointer text-2xl text-gray-600 hover:text-primary dark:text-gray-400"
              />
            </motion.div>
          )}
        </div>

        {/* 展开状态内容 */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-y-auto p-4"
            >
              {/* 顶部标题区 */}
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-bold dark:text-gray-200">
                    竭诚为您提供法律服务
                  </span>
                </div>
                <PiNotePencilBold
                  onClick={createRoom}
                  className="cursor-pointer text-xl text-gray-600 hover:text-primary dark:text-gray-400"
                />
              </div>

              {/* 聊天室列表 */}
              <div className="space-y-2">
                {rooms.map((room) => (
                  <Room
                    key={uniqueKeyUtil.nextKey()}
                    title={room.title}
                    chat_id={room.chat_id}
                    onDelete={handleDeleteRoom}
                    onRename={handleRenameRoom}
                  />
                ))}
              </div>

              {/* 未登录提示 */}
              {!token && (
                <motion.div
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  className="mt-8 rounded-lg bg-gray-50 p-4 dark:bg-gray-700"
                >
                  <p className="text-sm font-medium dark:text-gray-200">
                    登录后同步聊天记录
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button
                      onClick={() => router.push('/register')}
                      className="hover:bg-primary/90 flex-1 bg-primary"
                    >
                      注册
                    </Button>
                    <Button
                      onClick={() => router.push('/login')}
                      variant="outline"
                      className="flex-1 dark:border-gray-600 dark:text-gray-300"
                    >
                      登录
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 展开模式下侧边栏底部新增两个带图标的按钮 */}
        {activeMenu && (
          <div className="flex gap-2 border-t p-4 dark:border-gray-700">
            <Button className="flex flex-1 items-center justify-center gap-2 p-2 dark:text-white">
              <FaUser className="text-lg" />
              <span>个人信息</span>
            </Button>
            <Button className="flex flex-1 items-center justify-center gap-2 p-2 dark:text-white">
              <FaUsers className="text-lg" />
              <span>社区</span>
            </Button>
          </div>
        )}

        {/* 迷你模式底部区域 */}
        {!activeMenu && (
          <div className="mt-auto border-t p-2 dark:border-gray-700">
            {/* 可以添加其他迷你模式图标 */}
          </div>
        )}
      </motion.div>

      {/* 始终显示的侧边栏开关按钮 */}
      <MenuActiver />
    </>
  );
});

export default Sidebar;
