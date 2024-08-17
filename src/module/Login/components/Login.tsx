'use client';

import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import AccessToken from '@/common/components/auth/AccessToken';
import AuthInput from '@/common/components/auth/AuthInput';
import Breakline from '@/common/components/elements/Breakline';
import { Button } from '@/common/components/ui/button';

const Login: React.FC = React.memo(() => {
  const router = useRouter();

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        'http://0.0.0.0:6006/login',
        {
          username: loginForm.email,
          password: loginForm.password,
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (res.status === 200) {
        router.push('/');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      alert('登录失败');
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <p className="text-3xl font-bold">欢迎回来</p>
      <AuthInput
        name="电子邮件地址"
        type="text"
        value={loginForm.email}
        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
      />
      <AuthInput
        name="密码"
        type="password"
        value={loginForm.password}
        onChange={(e) =>
          setLoginForm({ ...loginForm, password: e.target.value })
        }
      />
      <Button
        className="text-md mt-6 h-14 w-80 bg-primary hover:bg-lightprimary"
        onClick={handleLogin}
      >
        登录
      </Button>
      <p className="mt-4 flex text-sm">
        还没有账户？{' '}
        <Link href="/register" className="text-primary">
          注册
        </Link>
      </p>
      <Breakline className="mt-8 h-[1px] w-80" text="或"></Breakline>
      <AccessToken />
    </div>
  );
});

export default Login;
