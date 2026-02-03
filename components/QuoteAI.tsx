
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Info } from 'lucide-react';
import { getCleaningAdvice } from '../services/gemini';
import { ChatMessage } from '../types';

const QuoteAI: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '반갑습니다! 링크클린의 AI 컨설턴트입니다.\n\n청소의 유형이나 특별히 신경 쓰이는 부분을 말씀해 주시면 상세히 상담해 드리겠습니다. 😊' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    const aiResponse = await getCleaningAdvice(userMessage);
    setMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
    setIsLoading(false);
  };

  return (
    <section id="AI 견적 상담" className="py-20 md:py-40 bg-gray-50/30 px-4 md:px-0">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-10 md:mb-16">
          <span className="text-purple-custom font-black tracking-[0.2em] md:tracking-[0.4em] uppercase text-[10px] md:text-sm block mb-3 md:mb-4">AI Smart Consulting</span>
          <h2 className="text-3xl md:text-6xl font-black text-gray-900 tracking-tighter">프라이빗 맞춤 상담</h2>
        </div>

        <div className="bg-white rounded-[32px] md:rounded-[64px] shadow-2xl overflow-hidden flex flex-col h-[550px] md:h-[750px] border border-gray-100 relative">
          
          {/* Header */}
          <div className="px-5 py-4 md:px-8 md:py-6 border-b border-gray-50 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-custom/10 rounded-xl md:rounded-2xl flex items-center justify-center text-purple-custom">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-black text-gray-900 text-sm md:text-lg tracking-tight">AI 클린 컨설턴트</h3>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 md:p-12 space-y-6 md:space-y-10 bg-[#FAFAFB]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 md:gap-6 max-w-[90%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 ${msg.role === 'user' ? 'bg-white text-purple-custom border border-purple-100' : 'bg-purple-custom text-white'}`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={20} />}
                  </div>
                  <div className={`group relative p-4 md:p-8 rounded-[24px] md:rounded-[32px] text-sm md:text-lg leading-relaxed md:leading-loose font-medium whitespace-pre-wrap shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-br from-purple-custom to-purple-dark text-white rounded-tr-none' 
                      : 'bg-white text-gray-700 rounded-tl-none border border-gray-100'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-xl bg-purple-custom text-white flex items-center justify-center animate-bounce">
                    <Loader2 size={16} className="animate-spin" />
                  </div>
                  <div className="text-gray-400 text-[10px] font-bold">답변을 구성 중입니다...</div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 md:p-10 bg-white border-t border-gray-50">
            <div className="max-w-3xl mx-auto relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="궁금한 내용을 입력하세요..."
                className="w-full pl-5 pr-14 py-3.5 md:py-6 bg-gray-50 rounded-[24px] md:rounded-[32px] border border-transparent focus:bg-white focus:border-purple-custom/30 transition-all text-sm md:text-lg"
                disabled={isLoading}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={`absolute right-1.5 p-2.5 md:p-5 rounded-[20px] md:rounded-[24px] transition-all active:scale-90 ${
                  input.trim() 
                    ? 'bg-purple-custom text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-300'
                }`}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteAI;
