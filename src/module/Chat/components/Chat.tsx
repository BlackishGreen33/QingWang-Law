'use client';

import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { BsArrowUpSquareFill } from 'react-icons/bs';
import { FaChevronDown } from 'react-icons/fa';

import { Input } from '@/common/components/ui/input';

import Record from './Record';

type Message = {
  message: string;
  isMe: boolean;
};

interface ChatProps {
  chat_id: string;
}

const Chat: React.FC<ChatProps> = React.memo(({ chat_id }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    }

    const getChatrooms = async () => {
      try {
        const fetchMessages = await axios.get(
          `http://127.0.0.1:6006/chat/${chat_id}?chat_id=${chat_id}`,
          {
            headers: { Authorization: token as string },
          }
        );

        // console.log(fetchMessages.data);
        // setMessages(fetchMessages.data.chats);
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (error.response.status === 401) {
          window.location.href = '/login';
        }
        // eslint-disable-next-line no-console
        console.log(error);
      }
    };
    getChatrooms();
  }, [chat_id]);

  return (
    <>
      <div className="ml-8 mt-4 flex items-center gap-1 text-lg">
        <p className="font-bold">LAW</p>
        <p className="font-bold text-gray-500">3.5</p>
        <FaChevronDown className="text-gray-300" />
      </div>
      <section className="flex h-[85vh] w-full flex-col items-center justify-center gap-4 overflow-y-scroll scrollbar-hide">
        <Record messages={messages} />
      </section>
      <div className="flex flex-col items-center gap-2">
        <div className="flex w-[98%] md:w-780">
          <Input
            className="h-14 w-full rounded-2xl rounded-r-none border-[1.5px] border-r-0 border-gray-300 pl-6 outline-none"
            placeholder={`给"LAW"发送消息`}
          />
          <div className="flex h-14 items-center rounded-2xl rounded-l-none border-[1.5px] border-l-0 border-gray-300 pr-4 outline-none">
            <BsArrowUpSquareFill className="text-3xl text-gray-300" />
          </div>
        </div>
        <p className="text-sm text-gray-500">
          向LAW发送消息即表示，您同意我们的
          <Link href="#" className="font-semibold text-black underline">
            条款
          </Link>
          并已阅读我们的
          <Link href="#" className="font-semibold text-black underline">
            隐私政策
          </Link>
          。
        </p>
      </div>
    </>
  );
});

export default Chat;
