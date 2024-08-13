'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import AuthInput from '@/common/components/auth/AuthInput';
import Breakline from '@/common/components/elements/Breakline';
import { Button } from '@/common/components/ui/button';

const Register: React.FC = React.memo(() => {
  const router = useRouter();

  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <p className="text-3xl font-bold">注册</p>
      <AuthInput
        name="电子邮件地址"
        type="text"
        value={registerForm.email}
        onChange={(e) =>
          setRegisterForm({ ...registerForm, email: e.target.value })
        }
      />
      <AuthInput
        name="密码"
        type="password"
        value={registerForm.password}
        onChange={(e) =>
          setRegisterForm({ ...registerForm, password: e.target.value })
        }
      />
      <AuthInput
        name="确认密码"
        type="password"
        value={registerForm.confirmPassword}
        onChange={(e) =>
          setRegisterForm({ ...registerForm, confirmPassword: e.target.value })
        }
      />
      <Button
        className="text-md mt-6 h-14 w-80 bg-primary hover:bg-lightprimary"
        onClick={() => router.push('/')}
      >
        注册
      </Button>
      <p className="mt-4 flex text-sm">
        已经有账户？{' '}
        <Link href="/login" className="text-primary">
          登录
        </Link>
      </p>
      <Breakline className="mt-8 h-[1px] w-80" text="或"></Breakline>
      <Button className="text-md mt-4 h-14 w-80 justify-start border-[1.5px] border-gray-300 bg-transparent text-black shadow-none">
        <p className="text-md flex w-full items-center justify-center gap-4 font-bold">
          Continue with AccessToken
        </p>
      </Button>
    </div>
  );
});

export default Register;
