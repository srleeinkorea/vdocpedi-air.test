import React from 'react';
import { ScreenName, DANGER_DATA } from '../../types';

interface VentilatorScreenProps {
  onBack: () => void;
}

const VentilatorScreen: React.FC<VentilatorScreenProps> = ({ onBack }) => {
  const isPPeakDanger = DANGER_DATA.p_peak_measured > DANGER_DATA.p_peak_threshold;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 flex items-center justify-start border-b border-gray-200 bg-white sticky top-0 z-20">
        <button onClick={onBack} className="mr-4 p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-gray-800">인공호흡기 위험 분석</h1>
      </header>

      <div className="p-6 pb-24 space-y-6">
        
        {/* Analysis Card */}
        <div className="p-5 rounded-2xl bg-white border border-red-200 shadow-sm relative overflow-hidden">
           <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500"></div>
           <div className="flex items-start space-x-3">
             <div className="p-2 bg-red-100 rounded-lg text-red-600 flex-shrink-0">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.3 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
             </div>
             <div>
               <h3 className="font-bold text-gray-900">호흡기 알람: P-Peak 및 빈호흡</h3>
               <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                 현재 압력이 가정용 임계치({DANGER_DATA.p_peak_threshold} cmH₂O)를 초과했습니다. 
                 <br/><span className="text-xs text-red-500 font-medium">원인: 폐 순응도 저하 또는 튜브 막힘 가능성.</span>
               </p>
             </div>
           </div>
        </div>

        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">실시간 데이터 모니터링</h2>
        
        <div className="grid grid-cols-2 gap-4">
           {/* P-Peak */}
           <GaugeCard 
             title="최고 압력 (P-Peak)" 
             value={DANGER_DATA.p_peak_measured} 
             unit="cmH₂O"
             status="danger"
             detail={`임계치 ${DANGER_DATA.p_peak_threshold} 초과`}
           />
           {/* P-Drive */}
           <GaugeCard 
             title="구동 압력 (P-drive)" 
             value={DANGER_DATA.p_drive_measured} 
             unit="cmH₂O"
             status="warning"
             detail="설정 압력 높음"
           />
           {/* V.Tidal */}
           <GaugeCard 
             title="호흡량 (V.Tidal)" 
             value={DANGER_DATA.vtidal_measured} 
             unit="mL"
             status="warning"
             detail={`목표 ${DANGER_DATA.vtidal_target} 대비 과호흡`}
           />
           {/* RR */}
           <GaugeCard 
             title="총 호흡수 (RR)" 
             value={DANGER_DATA.rr} 
             unit="회/분"
             status="danger"
             detail="빈호흡 상태"
           />
        </div>

        {/* BPD Analysis */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center">
            <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
            BPD 특이 분석 결과
          </h3>
          <div className="space-y-3">
            <p className="text-sm text-gray-600 leading-relaxed">
              <span className="font-bold text-gray-900">폐 순응도 저하:</span> P-Peak 상승은 폐가 단단해졌거나 기도 저항이 높아졌음을 의미합니다.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              <span className="font-bold text-gray-900">기흉 위험:</span> {DANGER_DATA.emrDiagnosis} 환아에게 고압력 지속은 기흉 위험을 급격히 높입니다.
            </p>
          </div>
        </div>

        <button className="w-full bg-red-600 text-white p-4 rounded-xl font-bold shadow-lg shadow-red-200 active:scale-95 transition-transform">
          호흡기 연결 상태 확인 가이드 보기
        </button>

      </div>
    </div>
  );
};

const GaugeCard: React.FC<{ title: string; value: number; unit: string; status: 'danger' | 'warning' | 'normal'; detail: string }> = ({ title, value, unit, status, detail }) => {
  const colors = {
    danger: "bg-red-50 border-red-200 text-red-600",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
    normal: "bg-green-50 border-green-200 text-green-600"
  };

  return (
    <div className={`p-4 rounded-2xl border-2 ${colors[status]} flex flex-col justify-between h-36`}>
      <p className="text-xs font-bold opacity-80">{title}</p>
      <div className="text-center my-1">
        <span className="text-4xl font-extrabold tracking-tight">{value}</span>
        <span className="text-sm font-medium ml-1 opacity-70">{unit}</span>
      </div>
      <div className="text-[10px] font-bold py-1 px-2 bg-white/50 rounded-lg text-center backdrop-blur-sm">
        {detail}
      </div>
    </div>
  );
};

export default VentilatorScreen;