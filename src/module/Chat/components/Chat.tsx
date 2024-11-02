'use client';

import { Input } from '@/common/components/ui/input';
import { cn } from '@/common/utils/utils';
import axios from 'axios';
import Link from 'next/link';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BsArrowUpSquareFill } from 'react-icons/bs';
import { FaChevronDown } from 'react-icons/fa';
import { io, Socket } from 'socket.io-client';
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
  const [question, setQuestion] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string>('法律咨询');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [streamedMessage, setStreamedMessage] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const numberRef = useRef<number>(1);

  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token')!;
  }

  // 初始化 Socket 连接
  const initSocket = useCallback(() => {
    const socketInstance = io('ws://127.0.0.1:6006/chat', {
      transports: ['websocket'],
      auth: { token },
      timeout: 5000,
    });

    socketInstance.on('connect', () => {
      console.log('Connected to server');
    });

    socketInstance.on('chat', (data: string) => {
      const parsedData = JSON.parse(data);
      console.log('Received message from server:', parsedData);
      setIsStreaming(true);
      if (parsedData.num === 1) {
        numberRef.current = 1;
      }
      if (parsedData.isfinished === 0 && numberRef.current === parsedData.num) {
        numberRef.current += 1;
        setStreamedMessage((prev) => prev + parsedData.text);
      }
      if (parsedData.isfinished === 1) {
        setIsStreaming(false);
        setMessages((prevMessages) => [
          ...prevMessages,
          { message: streamedMessage, isMe: false },
        ]);
        setStreamedMessage('');
      }
    });

    socketInstance.on('error', (error) => {
      if (error.status === 401) {
        window.location.href = '/login';
      }
    });

    setSocket(socketInstance);
  }, [token, streamedMessage]);

  // 获取历史消息
  const getMessages = useCallback(
    async (isStreaming?: boolean) => {
      try {
        const fetchMessages = await axios.get(
          `http://127.0.0.1:6006/chat/${chat_id}?chat_id=${chat_id}`,
          {
            headers: { Authorization: token as string },
          }
        );
        const data = fetchMessages.data.messages.map(
          (message: { content: string; role: string }) => ({
            message: message.content,
            isMe: message.role === 'user',
          })
        );

        if (!isStreaming) {
          setMessages(data);
        }
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (error.response?.status === 401) {
          window.location.href = '/login';
        }
        console.log(error);
      }
    },
    [chat_id, token]
  );

  const sentQuestion = async () => {
    if (!question.trim()) return;
    try {
      const input = question;
      setQuestion('');

      await axios.post(
        `http://127.0.0.1:6006/chat/stream/${chat_id}`,
        { inputs: input, mission: selectedOption },
        { headers: { Authorization: token as string } }
      );

      setIsStreaming(true);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
      console.log(error);
    }
  };

  useEffect(() => {
    getMessages(false);
    initSocket(); // 初始化 socket 连接

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [getMessages, initSocket]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sentQuestion();
    }
  };

  return (
    <>
      <div className="ml-8 mt-4 flex items-center gap-1 text-lg">
        <p className="font-bold">LAW</p>
        <p className="font-bold text-gray-500">智能法律助手</p>
        <FaChevronDown className="text-gray-300" />
      </div>

      {/* 选项按钮 */}
      <div className="mt-4 flex justify-center gap-4">
        {['法律咨询', '类案检索', '判决预测'].map((option) => (
          <button
            key={option}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-semibold',
              option === selectedOption
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            )}
            onClick={() => setSelectedOption(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <section className="flex h-[85vh] w-full flex-col items-center justify-center gap-4 overflow-y-scroll scrollbar-hide">
        <Record
          messages={
            isStreaming
              ? [...messages, { message: streamedMessage, isMe: false }]
              : messages
          }
        />
      </section>
      <div className="flex flex-col items-center gap-2">
        <div className="flex w-[98%] md:w-780">
          <Input
            className="h-14 w-full rounded-2xl rounded-r-none border-[1.5px] border-r-0 border-gray-300 pl-6 outline-none"
            placeholder={`给"LAW"发送消息`}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="flex h-14 items-center rounded-2xl rounded-l-none border-[1.5px] border-l-0 border-gray-300 pr-4 outline-none">
            <BsArrowUpSquareFill
              className={cn('text-3xl text-gray-300', {
                'text-gray-500': question,
              })}
              onClick={sentQuestion}
            />
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
