import Link from 'next/link';
import React from 'react';
import { BsArrowUpSquareFill } from 'react-icons/bs';
import { FaChevronDown, FaRegLightbulb } from 'react-icons/fa';
import { HiAcademicCap } from 'react-icons/hi2';
import { PiAirplaneTakeoffBold } from 'react-icons/pi';
import { TbPencilMinus } from 'react-icons/tb';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/common/components/ui/avatar';
import { Input } from '@/common/components/ui/input';

const Home: React.FC = React.memo(() => {
  return (
    <>
      <div className="ml-8 mt-4 flex items-center gap-1 text-lg">
        <p className="font-bold">LAW</p>
        <p className="font-bold text-gray-500">3.5</p>
        <FaChevronDown className="text-gray-300" />
      </div>
      <div className="flex h-[85vh] w-full flex-col items-center justify-center gap-4">
        <Avatar className="h-12 w-12 rounded-full border-2 border-gray-300">
          <AvatarImage
            src="https://raw.githubusercontent.com/BlackishGreen33/QingWang-Law/main/public/logo.png"
            alt="青望_LAW"
          />
          <AvatarFallback>青望_LAW</AvatarFallback>
        </Avatar>
        <p className="text-xl font-bold">今天能帮您些什么？</p>
        <div className="grid w-2/3 grid-cols-2 grid-rows-2 gap-5 sm:w-1/2 md:w-1/3 lg:w-1/4 2xl:w-1/5">
          <div className="flex cursor-pointer flex-col gap-1 rounded-2xl border-2 border-gray-300 p-4 shadow-md hover:bg-gray-100">
            <TbPencilMinus className="text-lg text-purple-400" />
            感谢我的面试官
          </div>
          <div className="flex cursor-pointer flex-col gap-1 rounded-2xl border-2 border-gray-300 p-4 shadow-md hover:bg-gray-100">
            <FaRegLightbulb className="text-lg text-yellow-400" />
            用于在新城市结交朋友的活动
          </div>
          <div className="flex cursor-pointer flex-col gap-1 rounded-2xl border-2 border-gray-300 p-4 shadow-md hover:bg-gray-100">
            <HiAcademicCap className="text-lg text-green-400" />
            解释超导体
          </div>
          <div className="flex cursor-pointer flex-col gap-1 rounded-2xl border-2 border-gray-300 p-4 shadow-md hover:bg-gray-100">
            <PiAirplaneTakeoffBold className="text-lg text-yellow-400" />
            规划一个放松日
          </div>
        </div>
      </div>
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
