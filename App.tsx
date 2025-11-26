import React, { useState } from 'react';
import { ScreenName } from './types';
import Layout from './components/Layout';
import Modal from './components/Modal';
import Dashboard from './components/screens/Dashboard';
import TriageScreen from './components/screens/TriageScreen';
import VentilatorScreen from './components/screens/VentilatorScreen';
import EmrScreen from './components/screens/EmrScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('home');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });

  const navigateTo = (screen: ScreenName) => {
    // Check for screens that are simulated/not implemented
    if (['pro', 'report', 'clinic', 'more'].includes(screen)) {
      setModalContent({
        title: '준비 중입니다',
        message: `현재 [${getKoreanScreenName(screen)}] 화면은 데모 버전에서 지원하지 않습니다.`
      });
      setModalOpen(true);
      return;
    }
    setCurrentScreen(screen);
  };

  const getKoreanScreenName = (screen: string) => {
    const map: Record<string, string> = {
      'pro': 'PRO 기록 및 분석',
      'report': '리포트',
      'clinic': '진료',
      'more': '더보기'
    };
    return map[screen] || screen;
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <Dashboard onNavigate={navigateTo} />;
      case 'triage':
        return <TriageScreen onBack={() => navigateTo('home')} />;
      case 'ventilator':
        return <VentilatorScreen onBack={() => navigateTo('home')} />;
      case 'emr':
        return <EmrScreen onBack={() => navigateTo('home')} />;
      default:
        return <Dashboard onNavigate={navigateTo} />;
    }
  };

  return (
    <Layout activeScreen={currentScreen} onNavigate={navigateTo}>
      {renderScreen()}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={modalContent.title} 
        message={modalContent.message} 
      />
    </Layout>
  );
}

export default App;