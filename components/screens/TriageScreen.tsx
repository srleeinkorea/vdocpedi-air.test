import React from 'react';
import { ScreenName, DANGER_DATA } from '../../types';

interface TriageScreenProps {
  onBack: () => void;
}

const TriageScreen: React.FC<TriageScreenProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white">
      <header className="p-4 flex items-center justify-start border-b border-gray-100 sticky top-0 bg-white z-20">
        <button onClick={onBack} className="mr-4 p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-gray-800">위험도 트리아제 분류</h1>
      </header>

      <div className="p-6 space-y-6">
        {/* Hero Alert */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-white shadow-xl shadow-red-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium opacity-90 mb-1">현재 상태</p>
              <p className="text-4xl font-extrabold flex items-center">
                Level 1
              </p>
            </div>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white opacity-80 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.3 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-lg font-bold">최고 위험: 즉시 처치 필요</p>
            <p className="text-xs mt-2 leading-relaxed opacity-90">
              {DANGER_DATA.emrDiagnosis} 환아의 산소 포화도 {DANGER_DATA.spo2}%는 심각한 응급 상황입니다. 즉시 병원으로 이송하거나 응급 조치를 취하십시오.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">주요 위험 지표</h2>
          <div className="space-y-3">
            <DangerMetric label="산소포화도 (SpO2)" value={`${DANGER_DATA.spo2}%`} desc="경고 임계치(90%) 이하" isDanger />
            <DangerMetric label="총 호흡수 (RR)" value={`${DANGER_DATA.rr}회/분`} desc="빈호흡 (Tachypnea)" isDanger />
            <DangerMetric label="최고압력 (P-Peak)" value={`${DANGER_DATA.p_peak_measured} cmH₂O`} desc={`임계치 ${DANGER_DATA.p_peak_threshold} 초과`} isDanger />
          </div>
        </div>

        <div>
           <h2 className="text-lg font-bold text-gray-800 mb-4">권고 처치 가이드라인</h2>
           <div className="bg-indigo-50 p-5 rounded-2xl border-l-4 border-indigo-500">
              <p className="font-bold text-indigo-700 mb-2">응급 프로토콜 실행 (Level 1)</p>
              <ul className="text-sm text-indigo-900 space-y-2 list-disc ml-4">
                  <li>FIO₂ 즉시 100%로 상승 (의료진 지시)</li>
                  <li>흡인(Suction) 및 기도 개방 확인</li>
                  <li>담당 의료팀에 즉시 상황 보고</li>
                  <li>기흉 발생 여부 확인 (흉부 움직임 관찰)</li>
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
};

const DangerMetric: React.FC<{ label: string; value: string; desc: string; isDanger?: boolean }> = ({ label, value, desc, isDanger }) => (
  <div className={`p-4 rounded-xl border ${isDanger ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'} flex justify-between items-center`}>
    <div>
      <p className="font-semibold text-gray-800">{label}</p>
      <p className={`text-xs ${isDanger ? 'text-red-600' : 'text-gray-500'}`}>{desc}</p>
    </div>
    <span className={`text-2xl font-bold ${isDanger ? 'text-red-600' : 'text-gray-800'}`}>{value}</span>
  </div>
);

export default TriageScreen;