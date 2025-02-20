import React from 'react';
import { FaRegLightbulb } from 'react-icons/fa';
import { HiAcademicCap } from 'react-icons/hi2';
import { PiAirplaneTakeoffBold } from 'react-icons/pi';
import { TbPencilMinus } from 'react-icons/tb';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/common/components/ui/avatar';
import uniqueKeyUtil from '@/common/utils/keyGen';

type RecommendMessage = {
  icon: React.ReactNode;
  message: string;
};

interface RecommendCardProps extends RecommendMessage {}

const Recommend_Messages: RecommendMessage[] = [
  {
    icon: <TbPencilMinus className="text-lg text-purple-400" />,
    message: '我需要咨询一些法律相关的事宜',
  },
  {
    icon: <FaRegLightbulb className="text-lg text-yellow-400" />,
    message: '帮我来分析一下案件的情况',
  },
  {
    icon: <HiAcademicCap className="text-lg text-green-400" />,
    message: '能帮我预测一下判决吗',
  },
  {
    icon: <PiAirplaneTakeoffBold className="text-lg text-yellow-400" />,
    message: '有没有相关的案例提供',
  },
];

const RecommendCard: React.FC<RecommendCardProps> = React.memo((card) => (
  <div className="flex cursor-pointer flex-col gap-1 rounded-2xl border-2 border-gray-300 p-4 shadow-md hover:bg-gray-100">
    {card.icon}
    {card.message}
  </div>
));

const Recommend: React.FC = React.memo(() => (
  <>
    <Avatar className="h-12 w-12 rounded-full border-2 border-gray-300">
      <AvatarImage
        src="https://raw.githubusercontent.com/BlackishGreen33/QingWang-Law/main/public/logo.png"
        alt="青望_LAW"
      />
      <AvatarFallback>青望_LAW</AvatarFallback>
    </Avatar>
    <p className="text-xl font-bold">今天能帮您些什么？</p>
    <div className="grid w-2/3 grid-cols-2 grid-rows-2 gap-5 sm:w-1/2 md:w-1/3 lg:w-1/4 2xl:w-1/5">
      {Recommend_Messages.map((item) => (
        <RecommendCard
          key={uniqueKeyUtil.nextKey()}
          icon={item.icon}
          message={item.message}
        />
      ))}
    </div>
  </>
));

export default Recommend;
