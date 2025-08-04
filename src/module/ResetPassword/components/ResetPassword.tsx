'use client';

import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import AuthInput from '@/common/components/auth/AuthInput';
import { Button } from '@/common/components/ui/button';
import { ToastAction } from '@/common/components/ui/toast';
import { useToast } from '@/common/components/ui/use-toast';
import { API_URL } from '@/common/constants';
import { ResetPasswordForm } from '@/common/types/auth';

const ForgotPassword: React.FC = React.memo(() => {
  const router = useRouter();
  const { toast } = useToast();
  const [isCooldown, setIsCooldown] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(60);
  const [loginForm, setLoginForm] = useState<ResetPasswordForm>({
    email: '',
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
        `${API_URL}/api/send_code`,
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

  const handleResetPassword = async () => {
    if (!loginForm.email || !loginForm.code) {
      toast({ title: '请填写所有必填字段' });
      return;
    }

    try {
      const payload = {
        email: loginForm.email,
        code: loginForm.code,
      };
      const res = await axios.post(
        `${API_URL}/api/login`,
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
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
          重置密码
        </h1>
        <p className="mb-4 text-center">
          输入您的电子邮件地址以接收验证码或密码重置链接
        </p>
        <div className="space-y-4">
          <AuthInput
            name="电子邮件地址"
            type="text"
            value={loginForm.email}
            onChange={(e) =>
              setLoginForm({ ...loginForm, email: e.target.value })
            }
          />
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
        </div>
        <Button
          className="text-md mt-6 h-14 w-full bg-primary hover:bg-lightprimary dark:text-white"
          onClick={handleResetPassword}
          disabled={isLoading}
        >
          {isLoading ? '重置中...' : '重置'}
        </Button>
        <p className="mt-4 text-center text-sm">
          还没有账户？{' '}
          <Link href="/register" className="text-primary">
            注册
          </Link>
        </p>
        <p className="mt-4 text-center text-sm">
          忘记密码？{' '}
          <Link href="/forgotpassword" className="text-primary">
            重置密码
          </Link>
        </p>
      </div>
    </div>
  );
});

export default ForgotPassword;
