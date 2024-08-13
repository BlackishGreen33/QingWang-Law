import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { Button } from '@/common/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/common/components/ui/dialog';
import { Textarea } from '@/common/components/ui/textarea';

const AccessToken: React.FC = React.memo(() => {
  const router = useRouter();

  const [accessToken, setAccessToken] = useState('');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-md mt-4 h-14 w-80 justify-start border-[1.5px] border-gray-300 bg-transparent text-black shadow-none hover:bg-gray-100">
          <p className="text-md flex w-full items-center justify-center gap-4 font-bold">
            Continue with AccessToken
          </p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Continue with AccessToken</DialogTitle>
          <DialogDescription>
            Enter your AccessToken to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full">
          <Textarea
            className="h-20 w-full resize-none"
            placeholder="Please enter your AccessToken"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
          />
        </div>
        <DialogFooter>
          <div className="flex w-full justify-center gap-4">
            <Button type="submit" onClick={() => router.push('/')}>
              OK
            </Button>
            <DialogPrimitive.Close>
              <Button
                className="bg-gray-400"
                onClick={() => setAccessToken('')}
              >
                Cancel
              </Button>
            </DialogPrimitive.Close>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default AccessToken;
