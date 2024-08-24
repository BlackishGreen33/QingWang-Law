import { NextPage } from 'next';

import Chat from '@/module/Chat';

interface PageProps {
  params: {
    chat_id: string;
  };
}

const Page: NextPage<PageProps> = ({ params: { chat_id } }) => {
  return (
    <>
      <Chat chat_id={chat_id} />
    </>
  );
};

export default Page;
