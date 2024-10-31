import { NextPage } from 'next';

import Chat from '@/module/Chat';

interface PageProps {
  params: {
    chat_id: string;
  };
}

const Page: NextPage<PageProps> = async (props) => {
  const params = await props.params;

  const { chat_id } = params;

  return (
    <>
      <Chat chat_id={chat_id} />
    </>
  );
};

export default Page;
