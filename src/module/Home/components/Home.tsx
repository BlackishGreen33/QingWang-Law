'use client';

import Link from 'next/link';
import React, { useEffect } from 'react';
import { BsArrowUpSquareFill } from 'react-icons/bs';
import { FaChevronDown } from 'react-icons/fa';

import { Input } from '@/common/components/ui/input';

import Chat from './Chat';
import Recommend from './Recommend';

type Message = {
  message: string;
  isMe: boolean;
};

const Messages: Message[] = [
  //   {
  //     message: '可以输入案件帮我分析吗？',
  //     isMe: true,
  //   },
  //   {
  //     message: '当然，请提供具体的案件细节，这样我可以更好的为你进行分析。',
  //     isMe: false,
  //   },
  //   {
  //     message: '123',
  //     isMe: true,
  //   },
  //   {
  //     message: `# Hi, *Pluto*
  // ## 测试
  // ### 123
  // #### 465
  // > 321
  // * 231
  //   * ** 123**
  // 1. 123
  //   1. 123
  // [123](https://www.google.com)
  // - 123
  // - 123333333
  // - 3333333333333333333333333333
  // 3333333333333333333333333333`,
  //     isMe: false,
  //   },
];

const Home: React.FC = React.memo(() => {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    }
  }, []);

  return (
    <>
      <div className="ml-8 mt-4 flex items-center gap-1 text-lg">
        <p className="font-bold">LAW</p>
        <p className="font-bold text-gray-500">智能法律助手</p>
        <FaChevronDown className="text-gray-300" />
      </div>
      <section className="flex h-[85vh] w-full flex-col items-center justify-center gap-4 overflow-y-scroll scrollbar-hide">
        {Messages.length !== 0 ? <Chat messages={Messages} /> : <Recommend />}
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

export default Home;
