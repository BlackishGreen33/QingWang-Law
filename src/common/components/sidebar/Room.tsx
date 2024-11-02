import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import axios from 'axios';

interface RoomProps {
  title: string;
  chat_id: string;
  onDelete: (chat_id: string) => void;
  onRename: (chat_id: string, newTitle: string) => void;
}

const Room: React.FC<RoomProps> = React.memo(({ title, chat_id, onDelete, onRename }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const token = localStorage.getItem('token') as string;

  const optionsRef = useRef<HTMLDivElement>(null); // 用于检测点击外部的参考

  const handleThreeDotsClick = () => {
    setShowOptions((prev) => !prev); // 点击切换选项框显示状态
  };

  // 监听点击事件，点击页面其他地方时关闭选项框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
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
      const response = await axios.delete(`http://127.0.0.1:6006/chat/delete/${chat_id}`, {
        headers: { Authorization: token },
      });
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
        `http://127.0.0.1:6006/chat/rename/${chat_id}`,
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
    <div className="group flex items-center justify-between rounded-lg px-4 py-2 hover:bg-gray-200 relative">
      {/* 链接到聊天房间 */}
      <Link href={`/chat/${chat_id}`}>
        <p>{title}</p>
      </Link>

      {/* BsThreeDots和选项框的容器 */}
      <div className="relative" ref={optionsRef}>
        <BsThreeDots className="cursor-pointer" onClick={handleThreeDotsClick} />

        {/* 选项框 */}
        {showOptions && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-lg z-10">
            <button
              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              onClick={() => {
                setShowRenameModal(true);
                setShowOptions(false); // 点击重命名按钮后关闭选项框
              }}
            >
              重命名
            </button>
            <button
              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
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
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded shadow-lg">
            <p>确定要删除此聊天吗？</p>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 mr-2"
                onClick={() => setShowDeleteModal(false)}
              >
                取消
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={deleteChat}
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 重命名聊天弹窗 */}
      {showRenameModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded shadow-lg">
            <p>输入新聊天名：</p>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="border p-2 rounded w-full mt-2"
            />
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 mr-2"
                onClick={() => setShowRenameModal(false)}
              >
                取消
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={renameChat}
              >
                重命名
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default Room;