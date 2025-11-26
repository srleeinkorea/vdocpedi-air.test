import React from 'react';
import { ScreenName } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeScreen, onNavigate }) => {
  // Hide nav on detail screens
  const hideNav = ['triage', 'ventilator', 'emr'].includes(activeScreen);

  const getNavClass = (screen: ScreenName) => 
    activeScreen === screen || (screen === 'home' && hideNav) // Keep home active logic simple or just based on explicit match
      ? "text-indigo-700" 
      : "text-gray-400 hover:text-indigo-500";

  // If we are in a detail view, we don't render the bottom nav at all based on the prototype design,
  // but usually apps keep it. The prototype explicitly hides it for details.
  
  return (
    <div className="max-w-xl mx-auto bg-gray-50 min-h-screen relative shadow-2xl overflow-hidden flex flex-col">
      <main className="flex-grow overflow-y-auto scrollbar-hide">
        {children}
      </main>

      {!hideNav && (
        <nav className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex justify-around p-3 z-40">
          <button onClick={() => onNavigate('home')} className={`flex flex-col items-center ${activeScreen === 'home' ? 'text-indigo-700' : 'text-gray-400'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-5a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-xs font-medium mt-1">홈</span>
          </button>
          
          <button onClick={() => onNavigate('report')} className={`flex flex-col items-center ${getNavClass('report')}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6m0 0h18m-9 0V6" />
            </svg>
            <span className="text-xs font-medium mt-1">리포트</span>
          </button>
          
          <button onClick={() => onNavigate('clinic')} className={`flex flex-col items-center ${getNavClass('clinic')}`}>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3h8v4m-4 5h.01M3 12v7a2 2 0 002 2h14a2 2 0 002-2v-7M3 12h18M9 16h6" />
            </svg>
            <span className="text-xs font-medium mt-1">진료</span>
          </button>
          
          <button onClick={() => onNavigate('more')} className={`flex flex-col items-center ${getNavClass('more')}`}>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-xs font-medium mt-1">더보기</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default Layout;