'use client';

import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import AuthInput from '@/common/components/auth/AuthInput';
import { Button } from '@/common/components/ui/button';
import { ToastAction } from '@/common/components/ui/toast';
import { useToast } from '@/common/components/ui/use-toast';
import { API_PORT, API_URL } from '@/common/constants';
import { LoginForm } from '@/common/types/auth';

const Login: React.FC = React.memo(() => {
  const router = useRouter();
  const { toast } = useToast();
  const [isCooldown, setIsCooldown] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(60);
  const [loginMode, setLoginMode] = useState<'password' | 'code'>('password');
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: '',
    code: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const sendVerifyCode = async () => {
    if (isCooldown || !/^\S+@\S+\.\S+$/.test(loginForm.email)) {
      toast({ title: '请输入有效的邮箱地址' });
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post(
        `${API_URL}:${API_PORT}/send_code`,
        {
          email: loginForm.email,
          type: 'login',
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (res.status === 200) {
        toast({
          title: '验证码已发送',
          description: '请检查您的邮箱',
        });

        setIsCooldown(true);
        setCountdown(60);

        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev === 1) {
              clearInterval(timer);
              setIsCooldown(false);
              return 60;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: '发送验证码失败',
        description: '请检查邮箱格式或重试',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (
      !loginForm.email ||
      (loginMode === 'password' && !loginForm.password) ||
      (loginMode === 'code' && !loginForm.code)
    ) {
      toast({ title: '请填写所有必填字段' });
      return;
    }

    try {
      const payload = {
        email: loginForm.email,
        ...(loginMode === 'password'
          ? { password: loginForm.password }
          : { code: loginForm.code }),
      };
      const res = await axios.post(`${API_URL}:${API_PORT}/login`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.status === 200) {
        localStorage.setItem('token', res.data.token);
        router.push('/');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: '登录失败',
        description: '请检查您的电子邮件地址及密码/验证码。',
        action: (
          <ToastAction altText="Try again" onClick={sendVerifyCode}>
            重试一次
          </ToastAction>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md rounded bg-white p-8 shadow dark:bg-gray-800">
        <h1 className="mb-6 text-center text-2xl font-bold dark:text-white">
          欢迎回来
        </h1>
        <div className="mb-4 flex justify-center">
          <button
            className={`rounded-l px-4 py-2 focus:outline-none ${
              loginMode === 'password'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => setLoginMode('password')}
          >
            账号密码登录
          </button>
          <button
            className={`rounded-r px-4 py-2 focus:outline-none ${
              loginMode === 'code'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => setLoginMode('code')}
          >
            验证码登录
          </button>
        </div>
        <div className="space-y-4">
          <AuthInput
            name="电子邮件地址"
            type="text"
            value={loginForm.email}
            onChange={(e) =>
              setLoginForm({ ...loginForm, email: e.target.value })
            }
          />
          {loginMode === 'password' && (
            <AuthInput
              name="密码"
              type="password"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
            />
          )}
          {loginMode === 'code' && (
            <div className="flex items-center gap-2">
              <AuthInput
                name="验证码"
                type="text"
                value={loginForm.code}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, code: e.target.value })
                }
              />
              <Button
                className="h-10 dark:text-white"
                onClick={sendVerifyCode}
                disabled={isCooldown}
              >
                {isCooldown ? `${countdown} 秒后重试` : '发送验证码'}
              </Button>
            </div>
          )}
        </div>
        <Button
          className="text-md mt-6 h-14 w-full bg-primary hover:bg-lightprimary dark:text-white"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? '登录中...' : '登录'}
        </Button>
        <p className="mt-4 text-center text-sm">
          还没有账户？{' '}
          <Link href="/register" className="text-primary">
            注册
          </Link>
        </p>
      </div>
    </div>
  );
});

export default Login;
