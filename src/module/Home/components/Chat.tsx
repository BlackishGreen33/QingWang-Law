import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import '@/common/styles/markdown.scss';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/common/components/ui/avatar';
import uniqueKeyUtil from '@/common/utils/keyGen';
import { cn } from '@/common/utils/utils';

type Message = {
  message: string;
  isMe: boolean;
};

interface ChatProps {
  messages: Message[];
}

const Chat: React.FC<ChatProps> = React.memo(({ messages }) => (
  <div id="markdown" className="flex h-full w-[98%] flex-col gap-4 md:w-780">
    {messages.map((item) => (
      <div
        key={uniqueKeyUtil.nextKey()}
        className={cn('flex', item.isMe ? 'flex-row-reverse' : 'flex-row')}
      >
        {item.isMe ? (
          <p className="w-fit max-w-4/5 overflow-x-scroll rounded-l-full rounded-r-full bg-gray-100 px-4 py-2 scrollbar-hide">
            {item.message}
          </p>
        ) : (
          <div className="flex w-4/5 gap-4">
            <Avatar className="h-8 w-8 rounded-full border-2 border-gray-300">
              <AvatarImage
                src="https://raw.githubusercontent.com/BlackishGreen33/QingWang-Law/main/public/logo.png"
                alt="青望_LAW"
              />
              <AvatarFallback>青望_LAW</AvatarFallback>
            </Avatar>
            <Markdown remarkPlugins={[remarkGfm]} className="-mt-2">
              {item.message}
            </Markdown>
          </div>
        )}
      </div>
    ))}
  </div>
));

export default Chat;
