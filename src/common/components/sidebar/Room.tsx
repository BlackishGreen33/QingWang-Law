import Link from 'next/link';
import React from 'react';
import { BsThreeDots } from 'react-icons/bs';

interface RoomProps {
  title: string;
  chat_id: string;
}

const Room: React.FC<RoomProps> = React.memo(({ title, chat_id }) => {
  return (
    <Link
      href={`/chat/${chat_id}`}
      className="group flex items-center justify-between rounded-lg px-4 py-2 hover:bg-gray-200"
    >
      <p>{title}</p>
      <BsThreeDots className="hidden cursor-pointer group-hover:block" />
    </Link>
  );
});

export default Room;
