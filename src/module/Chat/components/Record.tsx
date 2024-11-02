import Image from 'next/image';
import React, { useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import '@/common/styles/markdown.scss';

import uniqueKeyUtil from '@/common/utils/keyGen';
import { cn } from '@/common/utils/utils';

type Message = {
  message: string;
  isMe: boolean;
};

interface ChatProps {
  messages: Message[];
}

const Chat: React.FC<ChatProps> = React.memo(({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 当 messages 发生变化时自动滚动到底部
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div
      id="markdown"
      className="flex h-full w-[98%] flex-col gap-4 overflow-y-auto md:w-780"
    >
      {messages.map((item) => (
        <div
          key={uniqueKeyUtil.nextKey()}
          className={cn('flex', item.isMe ? 'flex-row-reverse' : 'flex-row')}
        >
          {item.isMe ? (
            <p className="w-fit max-w-4/5 whitespace-pre-wrap rounded-xl bg-gray-200 px-4 py-2 text-black">
              {item.message}
            </p>
          ) : (
            <div className="flex w-4/5 gap-4">
              <Image
                className="h-8 w-8 rounded-full border-2 border-gray-300"
                src="https://raw.githubusercontent.com/BlackishGreen33/QingWang-Law/main/public/logo.png"
                alt="青望_LAW"
                width={50}
                height={50}
              />
              <Markdown
                remarkPlugins={[remarkGfm]}
                className="w-full whitespace-pre-wrap rounded-xl bg-blue-500 px-4 py-2 text-black"
              >
                {item.message}
              </Markdown>
            </div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} /> {/* 占位符，用于滚动到最新消息 */}
    </div>
  );
});

export default Chat;
