'use client';

import axios from 'axios';
import Link from 'next/link';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BsArrowUpSquareFill } from 'react-icons/bs';
import { io, Socket } from 'socket.io-client';

import { Input } from '@/common/components/ui/input';
import { cn } from '@/common/utils/utils';

import { ScrollArea } from '@/common/components/ui/scrollarea';
import Record from './Record';

type Message = {
  message: string;
  isMe: boolean;
  mission?: string; // 可选的 mission 字段
  id?: string; // 添加 id 字段
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
  const [isModelEnhanced, setIsModelEnhanced] = useState<boolean>(false);
  const [thinkingMessage, setThinkingMessage] = useState<string | null>(null);

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

      setIsStreaming(true);

      numberRef.current = 1;
      // 防止重复处理相同的分段消息
      if (parsedData.num <= numberRef.current) {
        return; // 如果当前消息编号小于或等于已处理的编号，则忽略
      }
      numberRef.current = parsedData.num; // 更新已处理编号

      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];

        // 初始化时显示“正在思考...”占位符
        if (parsedData.num === 1) {
          if (
            updatedMessages.length === 0 ||
            updatedMessages[updatedMessages.length - 1]?.isMe !== false
          ) {
            updatedMessages.push({ message: '正在思考...', isMe: false });
          }
        }

        // 拼接或更新流式输出
        if (parsedData.isfinished === 0) {
          const lastMessage = updatedMessages[updatedMessages.length - 1];
          if (lastMessage?.isMe === false) {
            lastMessage.message = parsedData.text;
          }
        }

        // 如果完成，删除“正在思考...”占位符
        if (parsedData.isfinished === 1) {
          setIsStreaming(false);
          const lastMessage = updatedMessages[updatedMessages.length - 1];
          if (lastMessage?.message.includes('正在思考...')) {
            lastMessage.message = lastMessage.message.replace(
              '正在思考...',
              ''
            );
          }
        }

        return updatedMessages;
      });
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
          (message: { content: string | string[]; role: string }) => {
            let formattedMessage = message.content;

            // 如果是类案检索或法条检索的返回
            if (message.role === '类案检索' || message.role === '法条检索') {
              // 如果搜索结果为空，返回“无检索结果”
              if (
                Array.isArray(formattedMessage) &&
                formattedMessage.length === 0
              ) {
                formattedMessage = '无检索结果';
              }

              // 将检索结果作为模型消息处理
              return {
                message: formattedMessage,
                isMe: false, // 设置为模型消息
                mission: message.role, // 保存检索任务类型
              };
            }

            // 如果是其他角色的消息（'user' 或 'model'）
            return {
              message: formattedMessage,
              isMe: message.role === 'user', // 如果是用户消息，则是我发的消息
            };
          }
        );

        // 如果不是流式消息，更新消息状态
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
    try {
      const input = question;
      setQuestion(''); // 清空输入框

      // 生成唯一 ID
      const thinkingMessageId = `${Date.now()}_${Math.random()}`;

      // 发送用户消息
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: input, isMe: true },
      ]);

      // 添加“正在思考...”占位符
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: '正在思考...',
          isMe: false,
          id: thinkingMessageId,
          mission: selectedOption,
        },
      ]);

      if (selectedOption === '判决预测' || selectedOption === '法律咨询') {
        // 判决预测通过 Socket.IO 处理
        await axios.post(
          `http://127.0.0.1:6006/chat/stream/${chat_id}`,
          { inputs: input, mission: selectedOption },
          { headers: { Authorization: token as string } }
        );
        setIsStreaming(true);
      }

      if (selectedOption === '类案检索' || selectedOption === '法条检索') {
        let top_k;
        if (selectedOption === '类案检索') {
          top_k = 3;
        }
        if (selectedOption === '法条检索') {
          top_k = 5;
        }
        const response = await axios.post(
          `http://127.0.0.1:6006/chat/stream/${chat_id}/search`,
          {
            inputs: input,
            mission: selectedOption,
            is_model: isModelEnhanced,
            top_k: top_k,
          },
          { headers: { Authorization: token as string } }
        );
        const { searchresult, status } = response.data;

        if (status === 'success') {
          // 更新为类案检索的结果

          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            // 初始化时显示“正在思考...”占位符
            if (
              updatedMessages.length === 0 ||
              updatedMessages[updatedMessages.length - 1]?.isMe !== false
            ) {
              updatedMessages.push({
                message: '正在思考...',
                isMe: false,
                mission: selectedOption,
              });
            }

            const lastMessage = updatedMessages[updatedMessages.length - 1];
            if (lastMessage?.isMe === false) {
              lastMessage.message = searchresult;
            }

            return updatedMessages;
          });
        }
      }
    } catch (error) {
      console.error('Error sending question:', error);
    } finally {
      setThinkingMessage(null); // 清除“正在思考”标记
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
      <div className="ml-8 mt-4 flex items-center gap-1 text-lg"></div>

      {/* 选项按钮 */}
      <div className="mt-4 flex justify-center gap-4">
        {['法律咨询', '法条检索', '类案检索', '判决预测'].map((option) => (
          <button
            key={option}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-semibold',
              option === selectedOption
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700'
            )}
            onClick={() => setSelectedOption(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {['类案检索', '法条检索'].includes(selectedOption) && (
        <div className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="model-enhance"
            className="h-4 w-4"
            checked={isModelEnhanced}
            onChange={() => setIsModelEnhanced((prev) => !prev)}
          />
          <label htmlFor="model-enhance" className="text-sm text-gray-700">
            是否使用模型增强搜索
          </label>
        </div>
      )}

      <section className="flex h-[85vh] w-full flex-col items-center justify-center gap-4">
        <ScrollArea className='pr-14'>
          <Record
            messages={
              isStreaming && streamedMessage
                ? [...messages, { message: streamedMessage, isMe: false }]
                : messages
            }
            thinkingMessage={thinkingMessage}
          />
        </ScrollArea>
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
