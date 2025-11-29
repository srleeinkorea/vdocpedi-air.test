
import React from 'react';
import { ScreenName, DANGER_DATA } from '../../types';

interface TriageScreenProps {
  onBack: () => void;
}

const TriageScreen: React.FC<TriageScreenProps> = ({ onBack }) => {
  // Determine risk level
  const getRiskLevel = (data: typeof DANGER_DATA) => {
    if (data.spo2 < 90 || data.rr > 40 || data.p_peak_measured > data.p_peak_threshold) return 'red';
    if (data.spo2 < 95 || data.rr > 30) return 'yellow';
    return 'blue';
  };
  const currentRisk = getRiskLevel(DANGER_DATA);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="px-5 py-4 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-sm z-20 border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-base font-bold text-gray-800">위험도 상세 분석</h1>
        <div className="w-10"></div>
      </header>

      <div className="p-6 space-y-8">
        
        {/* Risk Gauge Header */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
          <p className="text-sm text-gray-500 font-medium mb-4">현재 환아의 위험 등급</p>
          
          {/* Segmented Risk Bar - Refined Colors: Softer Rose/Amber/Emerald */}
          <div className="flex items-center justify-center space-x-1 mb-6">
            <RiskSegment 
              active={currentRisk === 'blue'} 
              color="bg-emerald-400" 
              textColor="text-emerald-600" 
              label="안정" 
            />
            <RiskSegment 
              active={currentRisk === 'yellow'} 
              color="bg-amber-400" 
              textColor="text-amber-600" 
              label="주의" 
            />
            <RiskSegment 
              active={currentRisk === 'red'} 
              color="bg-rose-400" 
              textColor="text-rose-600" 
              label="위험" 
            />
          </div>

          <h2 className={`text-2xl font-black mb-1 transition-colors duration-300 ${
            currentRisk === 'red' ? 'text-rose-500' :
            currentRisk === 'yellow' ? 'text-amber-500' :
            'text-emerald-500'
          }`}>
            {currentRisk === 'red' ? 'Level 1. 즉시 대응' : currentRisk === 'yellow' ? 'Level 2. 주의 관찰' : 'Level 3. 안정'}
          </h2>
          <p className="text-sm text-gray-600">
             {currentRisk === 'red' ? '의료진 호출 또는 응급실 이송이 필요합니다.' : 
              currentRisk === 'yellow' ? '바이탈 수치 변화를 지속적으로 확인하세요.' : 
              '현재 호흡 및 바이탈이 안정적입니다.'}
          </p>
        </div>

        {/* Detailed Criteria List */}
        <div>
          <h3 className="text-sm font-bold text-gray-500 mb-3 px-1">등급별 판단 기준</h3>
          <div className="space-y-3">
             <TriageCard 
                level="red" 
                title="심각 (Red)" 
                desc="SpO2 90% 미만 · 심한 빈호흡" 
                isActive={currentRisk === 'red'} 
             />
             <TriageCard 
                level="yellow" 
                title="주의 (Yellow)" 
                desc="SpO2 90-94% · 경미한 빈호흡" 
                isActive={currentRisk === 'yellow'} 
             />
             <TriageCard 
                level="blue" 
                title="안정 (Blue)" 
                desc="SpO2 95% 이상 · 호흡 안정" 
                isActive={currentRisk === 'blue'} 
             />
          </div>
        </div>

        {/* Metrics Detail */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-5 text-sm">현재 측정 수치</h3>
          <div className="space-y-5">
            <MetricRow label="산소포화도 (SpO2)" value={DANGER_DATA.spo2} unit="%" isDanger={DANGER_DATA.spo2 < 90} />
            <MetricRow label="분당 호흡수 (RR)" value={DANGER_DATA.rr} unit="회" isDanger={DANGER_DATA.rr > 40} />
            <MetricRow label="최고 압력 (P-Peak)" value={DANGER_DATA.p_peak_measured} unit="cmH₂O" isDanger={DANGER_DATA.p_peak_measured > DANGER_DATA.p_peak_threshold} />
          </div>
        </div>
      </div>
    </div>
  );
};

const RiskSegment: React.FC<{ active: boolean; color: string; textColor: string; label: string }> = ({ active, color, textColor, label }) => (
  <div className="flex flex-col items-center space-y-2 w-full">
    <div className={`h-3 w-full rounded-full transition-all duration-300 ${active ? color : 'bg-gray-100'}`} />
    {active && <span className={`text-[10px] font-bold ${textColor}`}>{label}</span>}
  </div>
);

const TriageCard: React.FC<{ level: 'red' | 'yellow' | 'blue'; title: string; desc: string; isActive: boolean }> = ({ level, title, desc, isActive }) => {
  const styles = {
    // Colors Refined: Using softer borders (200) and rings (300/400) for less harsh contrast
    red: { icon: '🚨', border: 'border-rose-200', bg: 'bg-rose-50', ring: 'ring-rose-300', iconColor: 'text-rose-500' },
    yellow: { icon: '⚠️', border: 'border-amber-200', bg: 'bg-amber-50', ring: 'ring-amber-400', iconColor: 'text-amber-500' },
    blue: { icon: '🍀', border: 'border-emerald-200', bg: 'bg-emerald-50', ring: 'ring-emerald-400', iconColor: 'text-emerald-500' }
  };
  const style = styles[level];

  return (
    <div className={`relative p-4 rounded-2xl border transition-all duration-300 flex items-center space-x-4 ${
      isActive 
        ? `${style.bg} ${style.border} ring-1 ${style.ring} shadow-sm` 
        : 'bg-white border-gray-100 opacity-60 grayscale-[0.3]'
    }`}>
      <div className="text-2xl">{style.icon}</div>
      <div className="flex-1">
        <p className={`font-bold text-sm ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>{title}</p>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
      {isActive && (
        <div className="bg-white rounded-full p-1 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${style.iconColor}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
};

const MetricRow: React.FC<{ label: string; value: number; unit: string; isDanger: boolean }> = ({ label, value, unit, isDanger }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-500 font-medium text-sm">{label}</span>
    <span className={`text-lg font-bold ${isDanger ? 'text-rose-500' : 'text-gray-800'}`}>
      {value}<span className="text-xs font-medium text-gray-400 ml-1">{unit}</span>
    </span>
  </div>
);

export default TriageScreen;
