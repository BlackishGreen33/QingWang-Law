import axios from 'axios';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';

import { API_URL } from '@/common/constants';

import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface RoomProps {
  title: string;
  chat_id: string;
  onDelete: (chat_id: string) => void;
  onRename: (chat_id: string, newTitle: string) => void;
}

const Room: React.FC<RoomProps> = React.memo(
  ({ title, chat_id, onDelete, onRename }) => {
    const [showOptions, setShowOptions] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const token = localStorage.getItem('token') as string;

    const pathname = usePathname();
    const chatId = pathname.slice('/chat/'.length);

    const optionsRef = useRef<HTMLDivElement>(null); // 用于检测点击外部的参考

    const handleThreeDotsClick = () => {
      setShowOptions((prev) => !prev); // 点击切换选项框显示状态
    };

    // 监听点击事件，点击页面其他地方时关闭选项框
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          optionsRef.current &&
          !optionsRef.current.contains(event.target as Node)
        ) {
          setShowOptions(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    const deleteChat = async () => {
      try {
        const response = await axios.delete(
          `${API_URL}/api/chat/delete/${chat_id}`,
          {
            headers: { Authorization: token },
          }
        );
        if (response.data.status === 'success') {
          onDelete(chat_id); // 更新父组件的聊天房间列表
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error('删除聊天失败：', error);
      }
      setShowOptions(false); // 点击删除后关闭选项框
    };

    const renameChat = async () => {
      if (!newTitle) {
        alert('聊天名不能为空！');
        return;
      }

      try {
        const response = await axios.post(
          `${API_URL}/api/chat/rename/${chat_id}`,
          { title: newTitle },
          { headers: { Authorization: token } }
        );
        if (response.data.status === 'success') {
          onRename(chat_id, newTitle); // 更新父组件的聊天房间名称
          setShowRenameModal(false);
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error('重命名聊天失败：', error);
      }
      setShowOptions(false); // 点击重命名后关闭选项框
    };

    return (
      <Link href={`/chat/${chat_id}`}>
        <div
          className={`group relative flex items-center justify-between rounded-lg px-4 py-2 dark:hover:bg-gray-700 ${chatId === chat_id ? 'bg-primary' : 'hover:bg-gray-200'}`}
        >
          {/* 链接到聊天房间 */}

          <p className={`${chatId === chat_id && 'text-white'}`}>{title}</p>

          {/* BsThreeDots和选项框的容器 */}
          <div className="relative" ref={optionsRef}>
            <BsThreeDots
              className={`cursor-pointer ${chatId === chat_id && 'text-white'}`}
              onClick={handleThreeDotsClick}
            />

            {/* 选项框 */}
            {showOptions && (
              <div className="absolute right-0 z-10 mt-2 w-40 rounded-lg bg-white shadow-lg dark:bg-gray-700">
                <button
                  className="block w-full rounded-t-lg px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => {
                    setShowRenameModal(true);
                    setShowOptions(false); // 点击重命名按钮后关闭选项框
                  }}
                >
                  重命名
                </button>
                <button
                  className="block w-full rounded-b-lg px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => {
                    setShowDeleteModal(true);
                    setShowOptions(false); // 点击删除按钮后关闭选项框
                  }}
                >
                  删除
                </button>
              </div>
            )}
          </div>

          {/* 删除聊天确认弹窗 */}
          {showDeleteModal && (
            <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-500 bg-opacity-75">
              <div className="flex flex-col gap-2 rounded-xl bg-gray-100 p-6 shadow-lg dark:bg-gray-700">
                <p>确定要删除此聊天吗？</p>
                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    className="bg-gray-500 text-white"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    取消
                  </Button>
                  <Button className="text-white" onClick={deleteChat}>
                    删除
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 重命名聊天弹窗 */}
          {showRenameModal && (
            <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-500 bg-opacity-75">
              <div className="flex flex-col gap-2 rounded-xl bg-gray-100 p-6 shadow-lg dark:bg-gray-700">
                <p>输入新聊天名：</p>
                <Input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-72 border border-black p-2 dark:border-white"
                />
                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    className="bg-gray-500 text-white"
                    onClick={() => setShowRenameModal(false)}
                  >
                    取消
                  </Button>
                  <Button className="text-white" onClick={renameChat}>
                    重命名
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Link>
    );
  }
);

export default Room;
