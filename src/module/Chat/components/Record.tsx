import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import '@/common/styles/markdown.scss';
import uniqueKeyUtil from '@/common/utils/keyGen';
import { cn } from '@/common/utils/utils';

type Message = {
  message: string | string[]; // 支持字符串或字符串数组
  isMe: boolean;
  mission?: string; // 可选字段，表示任务类型
};

interface ChatProps {
  messages: Message[];
  thinkingMessage?: string | null;
}

const Record: React.FC<ChatProps> = React.memo(({ messages, thinkingMessage }) => {
  const [modalContent, setModalContent] = useState<string | null>(null);

  const handleLinkClick = (content: string) => {
    setModalContent(content); // 设置弹窗内容
  };

  const closeModal = () => {
    setModalContent(null); // 关闭弹窗
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, thinkingMessage]);

  // 词表和解释表
  const vocabulary = {
    "权利": "权利是指法律赋予个人或团体的合法权益。",
    "权力": "权力是指国家机关或公职人员依法行使的公共职权。"
  };

  // 处理文本，标红词表中的词汇并添加气泡提示
  const processText = (text: string) => {
    return text.split(' ').map((word, index) => {
      if (word in vocabulary) {
        return (
          <span key={index} className="text-red-500 relative group">
            {word}
            <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 mt-2">
              {vocabulary[word as keyof typeof vocabulary]}
            </span>
          </span>
        );
      }
      return word + ' ';
    });
  };

  return (
    <>
      <div id="markdown" className="flex h-full w-[98%] flex-col gap-4 overflow-y-auto md:w-780">
        {messages.map((item, index) => (
          <div
            key={uniqueKeyUtil.nextKey()}
            className={cn('flex', item.isMe ? 'flex-row-reverse' : 'flex-row')}
          >
            {item.isMe ? (
              // 用户的消息
              <p className="w-fit max-w-4/5 bg-gray-200 text-black rounded-xl px-4 py-2 whitespace-pre-wrap">
                {processText(item.message as string)}
              </p>
            ) : item.mission === '类案检索' || item.mission === '法条检索' ? (
              // 检索结果放入蓝色气泡中
              <div className="flex w-4/5 gap-4">
                <Image
                  className="h-8 w-8 rounded-full border-2 border-gray-300"
                  src="https://raw.githubusercontent.com/BlackishGreen33/QingWang-Law/main/public/logo.png"
                  alt="青望_LAW"
                  width={50}
                  height={50}
                />
                <div className="bg-gray-200 text-black rounded-xl px-4 py-2 w-full whitespace-pre-wrap">
                  {Array.isArray(item.message) ? (
                    item.message.length === 0 ? (
                      // 如果检索结果数组为空，显示‘无检索结果’
                      <p className="text-gray-700">无检索结果</p>
                    ) : item.mission === '类案检索' ? (
                      item.message.map((result: string, idx: number) => (
                        <div key={`${index}-${idx}`} className="my-1">
                          <a
                            href="#"
                            className="text-blue-700 underline hover:text-blue-900"
                            onClick={() => handleLinkClick(result)}
                          >
                            {result.slice(5, 80)}...
                          </a>
                        </div>
                      ))
                    ) : (
                      item.message.map((result: string, idx: number) => (
                        <div key={`${index}-${idx}`} className="my-1">
                          <a
                            href="#"
                            className="text-blue-700 underline hover:text-blue-900"
                            onClick={() => handleLinkClick(result)}
                          >
                            {result.slice(0, 30)}...
                          </a>
                        </div>
                      ))
                    )
                  ) : (
                    <p className="text-gray-700">正在思考...</p>
                  )}
                </div>
              </div>
            ) : (
              // 默认文本消息渲染
              <div className="flex w-4/5 gap-4">
                <Image
                  className="h-8 w-8 rounded-full border-2 border-gray-300"
                  src="/model_logo.png"
                  alt="青望_LAW"
                  width={50}
                  height={50}
                />
                <div className="bg-gray-200 text-black rounded-xl px-4 py-2 w-full whitespace-pre-wrap">
                  {typeof item.message === 'string' ? processText(item.message) : JSON.stringify(item.message)}
                </div>
              </div>
            )}
          </div>
        ))}
        {thinkingMessage && (
          <div className="flex w-4/5 gap-4">
            <Image
              className="h-8 w-8 rounded-full border-2 border-gray-300"
              src="https://raw.githubusercontent.com/BlackishGreen33/QingWang-Law/main/public/logo.png"
              alt="青望_LAW"
              width={50}
              height={50}
            />
            <div className="bg-gray-200 text-black rounded-xl px-4 py-2 w-full">
              {processText(thinkingMessage)}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 模态框 */}
      {modalContent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative w-11/12 max-w-3xl bg-white rounded-lg shadow-lg p-6 overflow-hidden">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-red-500 font-bold text-lg hover:text-red-700 transition-all duration-300"
            >
              关闭
            </button>
            <div className="overflow-y-auto max-h-[70vh] p-4 border-t border-gray-200">
              <Markdown
                remarkPlugins={[remarkGfm]}
                className="prose max-w-none"
              >
                {modalContent}
              </Markdown>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default Record;
