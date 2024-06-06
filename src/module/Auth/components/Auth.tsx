'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { SiMicrosoft } from 'react-icons/si';

import Breakline from '@/common/components/elements/Breakline';
import { Button } from '@/common/components/ui/button';

const Auth: React.FC = React.memo(() => {
  const router = useRouter();

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <p className="text-3xl font-bold">欢迎回来</p>
      <div className="relative mt-6 w-80">
        <input
          type="text"
          id="small_outlined"
          className="text-md peer block h-14 w-full appearance-none rounded-lg border-[1.5px] border-gray-300 bg-transparent px-2.5 pb-1.5 pt-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-primary"
          placeholder=""
        />
        <label
          htmlFor="small_outlined"
          className="absolute start-1 top-1 z-10 origin-[0] -translate-y-3 scale-75 transform bg-bgDefault px-3 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:mx-2 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-primary dark:bg-gray-900 dark:text-gray-400 peer-focus:dark:text-primary rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
        >
          电子邮件地址
        </label>
      </div>
      <Button
        className="text-md hover:bg-lightprimary mt-6 h-14 w-80 bg-primary"
        onClick={() => router.push('/')}
      >
        继续
      </Button>
      <p className="mt-4 flex text-sm">
        还没有账户？{' '}
        <Link href="/auth" className="text-primary">
          注册
        </Link>
      </p>
      <Breakline className="mt-8 h-[1px] w-80" text="或"></Breakline>
      <Button className="text-md mt-4 h-14 w-80 justify-start border-[1.5px] border-gray-300 bg-transparent text-black shadow-none">
        <p className="text-md flex items-center gap-4">
          <FcGoogle className="text-lg" /> 继续使用 Google 登录
        </p>
      </Button>
      <Button className="text-md mt-2 h-14 w-80 justify-start border-[1.5px] border-gray-300 bg-transparent text-black shadow-none">
        <p className="text-md flex items-center gap-4">
          <SiMicrosoft className="text-lg" /> 继续使用 Microsoft 账户登录
        </p>
      </Button>
    </div>
  );
});

export default Auth;
