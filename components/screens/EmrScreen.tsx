
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
      text: `민성이 보호자님, 알람 소리와 불안정한 수치 때문에 걱정이 많으시죠? 🍀\n\n현재 데이터를 분석해보니 **가래로 인한 일시적 기도 막힘** 가능성이 가장 높습니다.\n\n✅ **지금 바로 확인해주세요**\n• 침착하게 **석션(Suction)**을 먼저 진행해주세요.\n• 튜브가 꺾이거나 눌리지 않았는지 봐주세요.\n\n💡 **잠깐, 왜 그럴까요?**\n가래가 기도를 좁게 만들면 호흡기 압력(P-Peak)은 오르고, 산소 공급이 원활하지 않아 SpO2가 떨어질 수 있습니다.`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedEvidence, setExpandedEvidence] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, expandedEvidence]);

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
        return {
          ...msg,
          feedback: msg.feedback === type ? undefined : type
        };
      }
      return msg;
    }));
  };

  const toggleEvidence = (id: string) => {
    setExpandedEvidence(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const suggestions = [
    "석션 후에도 수치가 안 올라요 📉",
    "응급실에 지금 가야 할까요? 🚑",
    "P-Peak 알람이 계속 울려요 🚨",
    "가래 양상이 평소와 달라요 🟡",
    "호흡이 너무 가빠 보여요 💨"
  ];

  const renderFormattedText = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="font-bold text-gray-900">{part}</strong>;
      }
      return part;
    });
  };

  const parseMessageContent = (text: string) => {
    const splitMarker = "💡 **잠깐, 왜 그럴까요?**";
    if (text.includes(splitMarker)) {
      const parts = text.split(splitMarker);
      return { main: parts[0].trim(), evidence: parts[1].trim() };
    }
    return { main: text, evidence: null };
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      <header className="px-5 py-4 flex items-center justify-start border-b border-gray-200 bg-white sticky top-0 z-20">
        <button onClick={onBack} className="mr-3 p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-base font-bold text-gray-800">의료진 AI 상담</h1>
          <div className="flex items-center space-x-1">
             <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
             <p className="text-xs text-gray-400 font-medium">실시간 답변 가능</p>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Context Card - Simplified */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-xs">
           <div className="flex items-center justify-between mb-3 border-b border-gray-50 pb-2">
             <span className="font-bold text-gray-700">{DANGER_DATA.name} (만 {DANGER_DATA.age}세)</span>
             <span className="text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded">기관절개술 케어중</span>
           </div>
           <div className="flex space-x-4">
             <div>
               <p className="text-gray-400 mb-0.5">SpO2</p>
               <p className={`text-lg font-bold ${DANGER_DATA.spo2 < 90 ? 'text-rose-500' : 'text-gray-800'}`}>{DANGER_DATA.spo2}%</p>
             </div>
             <div>
               <p className="text-gray-400 mb-0.5">P-Peak</p>
               <p className={`text-lg font-bold ${DANGER_DATA.p_peak_measured > DANGER_DATA.p_peak_threshold ? 'text-rose-500' : 'text-gray-800'}`}>{DANGER_DATA.p_peak_measured}</p>
             </div>
             <div className="flex-1 border-l border-gray-100 pl-4 flex items-center">
                <p className="text-gray-500 leading-tight">현재 가래 막힘이 <br/>의심되는 상황입니다.</p>
             </div>
           </div>
        </div>

        {messages.map((msg) => {
          const { main, evidence } = parseMessageContent(msg.text);

          return (
            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[90%] p-5 text-sm leading-relaxed whitespace-pre-line shadow-sm transition-all ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm' 
                  : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-sm'
              }`}>
                {msg.role === 'user' ? msg.text : renderFormattedText(main)}

                {msg.role === 'model' && evidence && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <button 
                      onClick={() => toggleEvidence(msg.id)}
                      className="flex items-center justify-between w-full text-left group"
                    >
                      <span className="text-xs font-bold text-indigo-600 flex items-center bg-indigo-50 px-2 py-1.5 rounded-lg group-hover:bg-indigo-100 transition-colors">
                        <span className="mr-1.5">💡</span>
                        의학적 근거
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${expandedEvidence[msg.id] ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedEvidence[msg.id] && (
                      <div className="mt-3 text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 leading-relaxed">
                        {renderFormattedText(evidence)}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {msg.role === 'model' && (
                <div className="flex items-center space-x-2 mt-2 ml-1">
                  <button 
                    onClick={() => handleFeedback(msg.id, 'positive')}
                    className={`p-1.5 rounded-full border transition-all ${
                      msg.feedback === 'positive' 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-600' 
                        : 'bg-white border-gray-100 text-gray-300 hover:text-gray-500'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={msg.feedback === 'positive' ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleFeedback(msg.id, 'negative')}
                    className={`p-1.5 rounded-full border transition-all ${
                      msg.feedback === 'negative' 
                        ? 'bg-rose-50 border-rose-200 text-rose-600' 
                        : 'bg-white border-gray-100 text-gray-300 hover:text-gray-500'
                    }`}
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={msg.feedback === 'negative' ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l2.969 1.305m-7.18 5.635h2.969v9a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {!isLoading && messages.length > 0 && messages[messages.length - 1].role === 'model' && (
           <div className="mt-2 ml-1">
              <div className="flex overflow-x-auto space-x-2 scrollbar-hide py-2">
                {suggestions.map((s, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleSend(s)}
                    className="whitespace-nowrap px-4 py-2.5 bg-white text-indigo-600 text-sm font-semibold rounded-2xl border border-indigo-100 shadow-sm hover:bg-indigo-50 hover:shadow-md transition-all flex-shrink-0"
                  >
                    {s}
                  </button>
                ))}
              </div>
           </div>
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white px-5 py-4 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm">
              <div className="flex space-x-1.5">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-100 p-4 pb-8">
        <div className="flex items-center space-x-3">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="증상이나 궁금한 점을 입력하세요..."
            className="flex-grow bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none placeholder-gray-400 transition-all"
            disabled={isLoading}
          />
          <button 
            onClick={() => handleSend(input)}
            disabled={isLoading || !input.trim()}
            className={`p-3.5 rounded-2xl flex-shrink-0 transition-all ${
              input.trim() && !isLoading 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95' 
                : 'bg-gray-100 text-gray-300'
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
    