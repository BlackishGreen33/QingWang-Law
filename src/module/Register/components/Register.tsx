'use client';

import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import AuthInput from '@/common/components/auth/AuthInput';
import { Button } from '@/common/components/ui/button';
import { ToastAction } from '@/common/components/ui/toast';
import { useToast } from '@/common/components/ui/use-toast';

const Register: React.FC = React.memo(() => {
  const router = useRouter();
  const { toast } = useToast();
  const [isCooldown, setIsCooldown] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(60);
  const [registerForm, setRegisterForm] = useState<{
    email: string;
    code: string;
    password: string;
    confirmPassword: string;
  }>({
    email: '',
    code: '',
    password: '',
    confirmPassword: '',
  });

  const sendCode = async () => {
    if (isCooldown) return;

    try {
      const res = await axios.post(
        'http://localhost:6006/send_code',
        {
          email: registerForm.email,
          type: 'register',
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
    }
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post(
        'http://localhost:6006/register',
        {
          email: registerForm.email,
          code: registerForm.code,
          password1: registerForm.password,
          password2: registerForm.confirmPassword,
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (res.status === 201) {
        router.push('/login');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: '注册失败',
        description: '请检查您的电子邮件地址、验证码和密码。',
        action: <ToastAction altText="Try again">重试一次</ToastAction>,
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md rounded bg-white p-8 shadow dark:bg-gray-800">
        <h1 className="mb-6 text-center text-2xl font-bold">注册</h1>
        <div className="space-y-4">
          <AuthInput
            name="电子邮件地址"
            type="text"
            value={registerForm.email}
            onChange={(e) =>
              setRegisterForm({ ...registerForm, email: e.target.value })
            }
          />
          <div className="flex items-center gap-2">
            <AuthInput
              name="验证码"
              type="text"
              value={registerForm.code}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, code: e.target.value })
              }
            />
            <Button
              className="h-10 dark:text-white"
              onClick={sendCode}
              disabled={isCooldown}
            >
              {isCooldown ? `${countdown} 秒后重试` : '发送验证码'}
            </Button>
          </div>
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
              setRegisterForm({
                ...registerForm,
                confirmPassword: e.target.value,
              })
            }
          />
        </div>
        <Button
          className="text-md mt-6 h-14 w-full bg-primary hover:bg-lightprimary dark:text-white"
          onClick={handleRegister}
        >
          注册
        </Button>
        <p className="mt-4 text-center text-sm">
          已经有账户？{' '}
          <Link href="/login" className="text-primary">
            登录
          </Link>
        </p>
      </div>
    </div>
  );
});

export default Register;
