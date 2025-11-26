
import React, { useState, useRef, useEffect } from 'react';
import { ScreenName, DANGER_DATA, ChatMessage } from '../../types';
import { generateMedicalAdvice } from '../../services/geminiService';

interface EmrScreenProps {
  onBack: () => void;
}

const EmrScreen: React.FC<EmrScreenProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'model',
      text: `안녕하세요, ${DANGER_DATA.name} 환아 보호자님. \n\n현재 환아의 상태(Level 1)는 매우 위중합니다. EMR 기록 기반으로 P-Peak 상승과 저산소증이 감지되었습니다. \n\n무엇을 도와드릴까요?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const aiResponseText = await generateMedicalAdvice(text, DANGER_DATA);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: aiResponseText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const handleFeedback = (messageId: string, type: 'positive' | 'negative') => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        // Toggle off if same type selected, otherwise set new type
        return {
          ...msg,
          feedback: msg.feedback === type ? undefined : type
        };
      }
      return msg;
    }));
  };

  const suggestions = [
    "지금 가장 위험한 증상은?",
    "P-drive가 높은 이유가 뭔가요?",
    "응급조치 방법 알려줘"
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="p-4 flex items-center justify-start border-b border-gray-200 bg-white sticky top-0 z-20">
        <button onClick={onBack} className="mr-4 p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-800">EMR 맞춤형 AI 상담</h1>
          <p className="text-xs text-indigo-500 font-medium">V.Doc AI Connected</p>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Context Card */}
        <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 text-xs text-indigo-800">
           <p className="font-bold mb-1">🔍 연동 데이터 컨텍스트</p>
           <ul className="list-disc ml-4 space-y-0.5 opacity-80">
             <li>진단명: {DANGER_DATA.emrDiagnosis}</li>
             <li>Vital: SpO2 {DANGER_DATA.spo2}%, RR {DANGER_DATA.rr}회</li>
             <li>Vent: P-Peak {DANGER_DATA.p_peak_measured}, P-Drive {DANGER_DATA.p_drive_measured}</li>
           </ul>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
            }`}>
              {msg.text}
            </div>

            {/* Feedback UI for AI messages */}
            {msg.role === 'model' && (
              <div className="flex items-center space-x-3 mt-2 ml-1">
                <button 
                  onClick={() => handleFeedback(msg.id, 'positive')}
                  className={`flex items-center space-x-1 text-xs px-2 py-1 rounded-full transition-all ${
                    msg.feedback === 'positive' 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={msg.feedback === 'positive' ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  <span>도움됨</span>
                </button>
                <button 
                  onClick={() => handleFeedback(msg.id, 'negative')}
                  className={`flex items-center space-x-1 text-xs px-2 py-1 rounded-full transition-all ${
                    msg.feedback === 'negative' 
                      ? 'bg-red-100 text-red-600' 
                      : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                  }`}
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={msg.feedback === 'negative' ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l2.969 1.305m-7.18 5.635h2.969v9a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                  </svg>
                  <span>도움 안됨</span>
                </button>
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4 pb-8">
        {messages.length < 3 && !isLoading && (
          <div className="flex overflow-x-auto space-x-2 mb-3 scrollbar-hide pb-1">
            {suggestions.map((s, i) => (
              <button 
                key={i} 
                onClick={() => handleSend(s)}
                className="whitespace-nowrap px-3 py-1.5 bg-gray-100 text-indigo-600 text-xs font-semibold rounded-full hover:bg-indigo-50 border border-transparent hover:border-indigo-200 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="AI에게 상태에 대해 물어보세요..."
            className="flex-grow bg-gray-100 border-none rounded-full px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            disabled={isLoading}
          />
          <button 
            onClick={() => handleSend(input)}
            disabled={isLoading || !input.trim()}
            className={`p-3 rounded-full flex-shrink-0 transition-colors ${
              input.trim() && !isLoading ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-400'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmrScreen;
