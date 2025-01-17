'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { PiNotePencilBold } from 'react-icons/pi';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/common/components/ui/avatar';
import { Button } from '@/common/components/ui/button';
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

  const createRoom = async () => {
    try {
      const chatroom = await axios.post(
        'http://127.0.0.1:6006/chat/new_chat',
        {},
        {
          headers: { Authorization: token as string },
        }
      );
      setRooms((prevRooms) => [...prevRooms, chatroom.data]); // 直接更新 rooms 列表
      router.push(`/chat/${chatroom.data.chat_id}`);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (error.response?.status === 401) {
        router.push('/login');
      }
      console.error(error);
    }
  };

  useEffect(() => {
    const getChatrooms = async () => {
      try {
        const fetchRooms = await axios.get('http://127.0.0.1:6006/chat/list', {
          headers: { Authorization: token as string },
        });
        setRooms(fetchRooms.data.chats);
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (error.response?.status === 401) {
          router.push('/login');
        }
        console.error(error);
      }
    };
    getChatrooms();
  }, [token]);

  const handleDeleteRoom = (chat_id: string) => {
    setRooms((prevRooms) =>
      prevRooms.filter((room) => room.chat_id !== chat_id)
    );
  };

  const handleRenameRoom = (chat_id: string, newTitle: string) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.chat_id === chat_id ? { ...room, title: newTitle } : room
      )
    );
  };

  return (
    <div className="mx-2 h-full overflow-auto pb-10 md:overflow-hidden md:hover:overflow-auto">
      {activeMenu && (
        <div
          className={cn(
            'flex h-screen flex-col',
            { 'justify-between': !token },
            { 'gap-2': token }
          )}
        >
          <div className="ml-1 mt-4 flex items-center justify-between pr-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-7 w-7 rounded-full border-2 border-gray-300">
                <AvatarImage
                  src="https://raw.githubusercontent.com/BlackishGreen33/QingWang-Law/main/public/logo.png"
                  alt="青望_LAW"
                />
                <AvatarFallback>青望_LAW</AvatarFallback>
              </Avatar>
              <p className="font-bold">新聊天</p>
            </div>
            <PiNotePencilBold
              className="cursor-pointer text-lg"
              onClick={createRoom}
            />
          </div>
          {rooms.map((item) => (
            <Room
              key={uniqueKeyUtil.nextKey()}
              title={item.title}
              chat_id={item.chat_id}
              onDelete={handleDeleteRoom}
              onRename={handleRenameRoom}
            />
          ))}
          {!token && (
            <div className="flex flex-col p-2">
              <p className="text-sm font-bold">注册或登录</p>
              <p className="text-sm text-gray-500">
                保存您的聊天历史记录，共享聊天并个性化您的使用体验
              </p>
              <Button
                className="text-md mt-4 h-10 w-full bg-primary text-sm hover:bg-lightprimary"
                onClick={() => router.push('/register')}
              >
                注册
              </Button>
              <Button
                className="text-md mt-2 h-10 w-full border border-gray-300 bg-white text-sm text-black shadow-none hover:bg-gray-200"
                onClick={() => router.push('/login')}
              >
                登录
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default Sidebar;
