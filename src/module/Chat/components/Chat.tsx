'use client';

import axios from 'axios';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import { BsArrowUpSquareFill } from 'react-icons/bs';
import { FaChevronDown } from 'react-icons/fa';

import { Input } from '@/common/components/ui/input';
import { cn } from '@/common/utils/utils';

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

  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token')!;
  }

  const getMessages = useCallback(
    async (isFlow?: boolean) => {
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

        if (isFlow) {
          const dataWithoutLastElement = data.slice(0, -1);
          setMessages(dataWithoutLastElement);
          const lastElement = data.at(-1);
          if (lastElement && lastElement.message.isMe === false) {
            setMessages([...messages, { message: '', isMe: false }]);
            const strToAppend = lastElement.message;
            const appendCharacter = (index = 0) => {
              if (index < strToAppend.length) {
                const newMessages = [...messages];
                newMessages[newMessages.length - 1].message +=
                  strToAppend.charAt(index);
                setMessages(newMessages);
                setTimeout(() => {
                  appendCharacter(index + 1);
                }, 100);
              }
            };
          }
        } else {
          setMessages(data);
        }
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (error.response && error?.response.status === 401) {
          window.location.href = '/login';
        }
        // eslint-disable-next-line no-console
        console.log(error);
      }
    },
    [chat_id, messages, token]
  );

  const sentQuestion = async () => {
    try {
      const input = question;
      setQuestion('');
      const anwser = await axios.get(
        `http://127.0.0.1:6006/chat/stream/${chat_id}?chat_id=${chat_id}&inputs=${input}`,
        {
          headers: { Authorization: token as string },
        }
      );
      // const reader = anwser.body.getReader();
      // const decoder = new TextDecoder();
      // while (1) {
      //   // 读取数据流的第一块数据，done表示数据流是否完成，value表示当前的数
      //   const { done, value } = await reader.read();
      //   if (done) break;
      //   const text = decoder.decode(value);
      //   // 打印第一块的文本内容
      //   console.log(text, done);
      // }
      // const fetchMessages = await axios.get(
      //   `http://127.0.0.1:6006/chat/${chat_id}?chat_id=${chat_id}`,
      //   {
      //     headers: { Authorization: token as string },
      //   }
      // );
      // const data = fetchMessages.data.messages.map(
      //   (message: { content: string; role: string }) => ({
      //     message: message.content,
      //     isMe: message.role === 'user',
      //   })
      // );
      // const dataWithoutLastElement = data.slice(0, -1);
      // setMessages(dataWithoutLastElement);
      getMessages(true);
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

  useEffect(() => {
    getMessages(false);
  }, [getMessages]);

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
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
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
