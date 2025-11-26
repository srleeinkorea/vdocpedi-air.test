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

  return (
    <>
      <header className="p-4 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-30">
        <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">V.Doc <span className="text-indigo-600">PEDI-AIR</span></h1>
        <div className="text-xs text-gray-500 flex items-center space-x-1 font-medium">
          <span>{currentTime}</span>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        </div>
      </header>

      {/* User Card */}
      <div className="px-4 mb-6">
        <button 
          onClick={() => onNavigate('emr')}
          className="w-full bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-gray-100 active:scale-95 transition-transform"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">{DANGER_DATA.name} 환아 (만 {DANGER_DATA.age}세)</p>
              <p className="text-lg font-bold text-gray-800">맞춤형 AI 상담 시작</p>
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Shortcuts */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3">핵심 서비스</h2>
        <div className="grid grid-cols-2 gap-4">
          <DashboardCard 
            icon={<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.3 16c-.77 1.333.192 3 1.732 3z" />}
            title="위험도 트리아제"
            subtitle="응급 판단"
            color="text-red-500"
            onClick={() => onNavigate('triage')}
          />
          <DashboardCard 
            icon={<path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />}
            title="인공호흡기 분석"
            subtitle="실시간 신호"
            color="text-blue-500"
            onClick={() => onNavigate('ventilator')}
          />
          <DashboardCard 
            icon={<path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4v-4z" />}
            title="EMR 상담"
            subtitle="진료 기록 기반"
            color="text-orange-500"
            onClick={() => onNavigate('emr')}
          />
          <DashboardCard 
            icon={<path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5V3h4v2M3 12h18M9 16h6" />}
            title="PRO 기록"
            subtitle="보호자 보고"
            color="text-green-500"
            onClick={() => onNavigate('pro')}
          />
        </div>
      </div>

      {/* Danger Status */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3">현재 환아 상태 요약</h2>
        <button 
          onClick={() => onNavigate('triage')}
          className="w-full text-left p-5 rounded-2xl bg-red-50 border-2 border-red-500 shadow-sm flex justify-between items-start animate-pulse relative overflow-hidden active:scale-95 transition-transform"
        >
          <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-red-500 rounded-full opacity-10 blur-xl"></div>
          <div className="z-10">
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
              <p className="text-lg font-extrabold text-red-700">심각 위험 (Level 1)</p>
            </div>
            <p className="text-sm font-medium text-red-800 leading-snug">
              SpO2 {DANGER_DATA.spo2}% 및 호흡수 {DANGER_DATA.rr}회/분. <br/>
              즉시 의료진 연락 필요.
            </p>
          </div>
          <div className="text-right z-10 min-w-[80px]">
            <p className="text-4xl font-black text-red-600 tracking-tighter">{DANGER_DATA.spo2}<span className="text-xl ml-1">%</span></p>
            <p className="text-xs font-bold text-red-400 mt-1 uppercase">SpO2</p>
          </div>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="px-4 pb-20">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-gray-800">검사 및 연동 결과</h2>
          <button onClick={() => onNavigate('report')} className="text-xs font-semibold text-indigo-500 hover:text-indigo-700">전체 보기</button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="EMR 진단명" value="BPD (CLD)" subValue="만성 폐쇄성..." borderColor="border-indigo-100" textColor="text-indigo-600" />
          <StatCard label="인공호흡기" value="P-Peak 위험" subValue={`${DANGER_DATA.p_peak_measured} cmH₂O`} borderColor="border-red-100" textColor="text-red-600" />
          <StatCard label="현재 SpO2" value={`${DANGER_DATA.spo2}%`} subValue="실시간" borderColor="border-red-100" textColor="text-red-600" />
        </div>
      </div>
    </>
  );
};

const DashboardCard: React.FC<{ icon: React.ReactNode; title: string; subtitle: string; color: string; onClick: () => void }> = ({ icon, title, subtitle, color, onClick }) => (
  <button onClick={onClick} className="bg-white p-4 h-32 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center space-y-2 border border-transparent hover:border-gray-100 hover:shadow-md transition-all active:scale-95">
    <div className={`${color}`}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {icon}
      </svg>
    </div>
    <div className="text-center">
      <p className="font-bold text-gray-800 text-sm">{title}</p>
      <p className="text-[10px] text-gray-400 font-medium">{subtitle}</p>
    </div>
  </button>
);

const StatCard: React.FC<{ label: string; value: string; subValue: string; borderColor: string; textColor: string }> = ({ label, value, subValue, borderColor, textColor }) => (
  <div className={`bg-white p-3 rounded-xl shadow-sm border ${borderColor} flex flex-col justify-center h-24`}>
    <p className="text-[10px] text-gray-400 font-medium mb-1">{label}</p>
    <p className={`text-sm font-bold ${textColor} leading-tight`}>{value}</p>
    <p className="text-[10px] text-gray-400 mt-1 truncate">{subValue}</p>
  </div>
);

export default Dashboard;