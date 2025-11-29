
import React, { useState, useEffect } from 'react';
import { ScreenName, DANGER_DATA } from '../../types';

interface DashboardProps {
  onNavigate: (screen: ScreenName) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const period = hours >= 12 ? '오후' : '오전';
      const displayHours = hours % 12 || 12;
      setCurrentTime(`${period} ${displayHours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Simple Triage Logic
  const getRiskLevel = (data: typeof DANGER_DATA) => {
    if (data.spo2 < 90 || data.rr > 40 || data.p_peak_measured > data.p_peak_threshold) return 'red';
    if (data.spo2 < 95 || data.rr > 30) return 'yellow';
    return 'blue';
  };

  const riskLevel = getRiskLevel(DANGER_DATA);

  // Status Colors & Text Configuration
  const statusConfig = {
    red: {
      bg: 'bg-gradient-to-br from-rose-50 to-white',
      border: 'border-rose-100',
      text: 'text-rose-600',
      indicator: 'bg-rose-500',
      label: '즉시 대응 필요',
      desc: '위험 징후가 감지되었습니다',
      icon: '🚨'
    },
    yellow: {
      bg: 'bg-gradient-to-br from-amber-50 to-white',
      border: 'border-amber-100',
      text: 'text-amber-600',
      indicator: 'bg-amber-400',
      label: '주의 관찰 필요',
      desc: '수치가 불안정합니다',
      icon: '⚠️'
    },
    blue: {
      bg: 'bg-gradient-to-br from-emerald-50 to-white',
      border: 'border-emerald-100',
      text: 'text-emerald-600',
      indicator: 'bg-emerald-500',
      label: '상태 안정적',
      desc: '모든 수치가 정상 범위입니다',
      icon: '🍀'
    }
  };

  const currentStatus = statusConfig[riskLevel];

  return (
    <div className="bg-gray-50 min-h-screen pb-24 font-sans">
      {/* Header */}
      <header className="px-6 py-5 bg-white/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between border-b border-gray-100">
        <div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight flex items-center">
            V.Doc <span className="text-indigo-600 ml-1 font-extrabold">PEDI-AIR</span>
          </h1>
          <p className="text-[11px] text-gray-400 font-medium tracking-wide">
            Pediatric AI for Respiratory System
          </p>
        </div>
        <div className="text-xs text-gray-500 font-semibold bg-gray-100 px-3 py-1.5 rounded-full">
          {currentTime}
        </div>
      </header>

      <div className="p-5 space-y-7">
        
        {/* 1. Real-time risk/status (Traffic Light) */}
        <section>
          <button 
            onClick={() => onNavigate('triage')}
            className={`w-full relative overflow-hidden rounded-3xl p-6 text-left transition-all active:scale-[0.98] duration-200 border shadow-lg shadow-gray-100/50 ${currentStatus.bg} ${currentStatus.border}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-2xl">{currentStatus.icon}</span>
                  <h2 className={`text-xl font-bold ${currentStatus.text}`}>{currentStatus.label}</h2>
                </div>
                <p className="text-sm text-gray-600 font-medium ml-1 opacity-80">{currentStatus.desc}</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-gray-500 border border-white/50 shadow-sm">
                상세 분석 &gt;
              </div>
            </div>

            {/* Modern Status Indicators (Dots with Faces) */}
            <div className="flex items-center space-x-3 bg-white/40 p-2 rounded-full w-fit backdrop-blur-sm border border-white/50">
              <div className={`h-4 w-4 rounded-full transition-all duration-500 flex items-center justify-center text-[10px] ${riskLevel === 'blue' ? 'bg-emerald-500 scale-125 shadow-emerald-200 shadow-md' : 'bg-gray-300 opacity-50'}`}>
                {riskLevel === 'blue' && '😊'}
              </div>
              <div className={`h-4 w-4 rounded-full transition-all duration-500 flex items-center justify-center text-[10px] ${riskLevel === 'yellow' ? 'bg-amber-400 scale-125 shadow-amber-200 shadow-md' : 'bg-gray-300 opacity-50'}`}>
                 {riskLevel === 'yellow' && '😐'}
              </div>
              <div className={`h-4 w-4 rounded-full transition-all duration-500 flex items-center justify-center text-[10px] ${riskLevel === 'red' ? 'bg-rose-500 scale-125 animate-pulse shadow-rose-200 shadow-md' : 'bg-gray-300 opacity-50'}`}>
                 {riskLevel === 'red' && '😫'}
              </div>
            </div>
          </button>
        </section>

        {/* 2. Immediate action CTA (Red Only) */}
        {riskLevel === 'red' && (
          <section>
            <div className="bg-white rounded-3xl shadow-xl shadow-rose-100/50 border border-rose-100 overflow-hidden ring-4 ring-rose-50">
              <div className="p-5 bg-gradient-to-r from-rose-50/80 to-white border-b border-rose-50">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-rose-700 flex items-center">
                      <span className="mr-2">🚨</span> 긴급 조치 가이드
                    </h3>
                    <p className="text-sm text-rose-600/80 mt-1 pl-7 font-medium">기도 폐쇄(가래/꼬임) 의심 상황</p>
                  </div>
                </div>
              </div>
              
              <div className="p-5">
                <div className="space-y-3 mb-5">
                   <CheckItem text="환아의 고개를 젖혀 기도를 확보하세요." />
                   <CheckItem text="즉시 석션(Suction)을 시행하세요." />
                   <CheckItem text="인공호흡기 튜브 연결을 확인하세요." />
                </div>

                <button 
                  onClick={() => onNavigate('ventilator')}
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3.5 rounded-2xl font-bold text-base shadow-lg shadow-rose-200 transition-all active:scale-95 flex items-center justify-center space-x-2"
                >
                  <span>석션 및 튜브 확인법 상세 보기</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 3. Machine status / vital summary */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm font-bold text-gray-700">실시간 바이탈</h2>
            <div className="flex items-center space-x-1.5 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] text-green-700 font-bold">Live</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <VitalCard 
              label="최고압력 (P-Peak)" 
              value={DANGER_DATA.p_peak_measured} 
              unit="cmH₂O" 
              isHigh={DANGER_DATA.p_peak_measured > DANGER_DATA.p_peak_threshold}
              desc={DANGER_DATA.p_peak_measured > DANGER_DATA.p_peak_threshold ? "기도 저항 높음" : "정상"}
            />
            <VitalCard 
              label="산소포화도 (SpO2)" 
              value={DANGER_DATA.spo2} 
              unit="%" 
              isHigh={DANGER_DATA.spo2 < 90} 
              isLowBad={true}
              desc={DANGER_DATA.spo2 < 90 ? "저산소증 위험" : "정상"}
            />
          </div>
        </section>

        {/* 4. Core menu */}
        <section>
          <h2 className="text-sm font-bold text-gray-700 mb-3 px-1">서비스 메뉴</h2>
          <div className="grid grid-cols-4 gap-4">
             <MenuButton icon="📊" label="트리아제" onClick={() => onNavigate('triage')} />
             <MenuButton icon="🫁" label="호흡기" onClick={() => onNavigate('ventilator')} />
             <MenuButton icon="👨‍⚕️" label="진료" onClick={() => onNavigate('clinic')} />
             <MenuButton icon="⚙️" label="더보기" onClick={() => onNavigate('more')} />
          </div>
        </section>

        {/* 5. Auxiliary features (AI Chatbot & Records) */}
        <section className="space-y-4 pt-2">
           <div className="flex items-center justify-between mb-1 px-1">
              <h2 className="text-sm font-bold text-gray-700">스마트 케어</h2>
           </div>
           
           <button 
            onClick={() => onNavigate('emr')}
            className="w-full bg-indigo-500 p-5 rounded-3xl shadow-xl shadow-indigo-200/50 flex items-center justify-between active:scale-[0.98] transition-all group overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="flex items-center space-x-4 relative z-10">
              <div className="bg-white/20 p-3 rounded-2xl text-white backdrop-blur-sm border border-white/10 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4v-4z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-lg">AI 의료 상담</p>
                <p className="text-indigo-100 text-xs mt-1 font-medium">현재 상황 맞춤 대처법 질문하기</p>
              </div>
            </div>
            <div className="bg-white/20 p-2.5 rounded-full group-hover:bg-white/30 transition-colors relative z-10">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </div>
          </button>

          <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 border border-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5V3h4v2M3 12h18M9 16h6" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm">상태 기록 (PRO)</h3>
                <p className="text-xs text-gray-400 mt-0.5">체온, 배변 등 특이사항</p>
              </div>
            </div>
            <button onClick={() => onNavigate('pro')} className="text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2.5 rounded-xl hover:bg-indigo-100 transition-colors">
              기록하기
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

const CheckItem: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center space-x-3">
    <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-rose-600" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    </div>
    <span className="text-sm text-gray-700 font-medium">{text}</span>
  </div>
);

const VitalCard: React.FC<{ label: string; value: number; unit: string; isHigh: boolean; isLowBad?: boolean; desc: string }> = ({ label, value, unit, isHigh, isLowBad, desc }) => {
  const isDanger = isLowBad ? isHigh : isHigh; 
  const colorClass = isDanger ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-white border-gray-100 text-gray-800';
  
  return (
    <div className={`p-4 rounded-3xl border ${colorClass} shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-32`}>
      <div className="flex justify-between items-start">
        <span className="text-xs font-bold opacity-70">{label}</span>
        {isDanger && <span className="text-[10px] font-bold bg-white/60 px-2 py-0.5 rounded-md text-rose-500 backdrop-blur-sm shadow-sm">주의</span>}
      </div>
      <div>
        <span className="text-3xl font-extrabold tracking-tight">{value}</span>
        <span className="text-sm font-medium ml-1 opacity-60">{unit}</span>
      </div>
      <p className="text-xs font-medium opacity-80">{desc}</p>
    </div>
  );
};

const MenuButton: React.FC<{ icon: string; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center justify-center py-4 px-2 rounded-3xl bg-white border border-gray-100 shadow-sm active:scale-95 transition-all hover:shadow-md hover:border-gray-200">
    <span className="text-2xl mb-2 filter drop-shadow-sm">{icon}</span>
    <span className="text-[11px] font-bold text-gray-600">{label}</span>
  </button>
);

export default Dashboard;
