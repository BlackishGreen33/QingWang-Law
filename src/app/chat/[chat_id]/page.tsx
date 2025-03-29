import { NextPage } from 'next';

import Chat from '@/module/Chat';

type Params = Promise<{ chat_id: string }>;
interface PageProps {
  params: Params;
}

const Page: NextPage<PageProps> = async (props) => {
  const params = await props.params;

  const { chat_id } = params;

  return <Chat chat_id={chat_id} />;
};

export default Page;
