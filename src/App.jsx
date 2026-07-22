import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileNav } from './components/MobileNav';
import { LanguageSelection } from './components/LanguageSelection';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { TermsScreen } from './components/TermsScreen';
import { AccessDeniedScreen } from './components/AccessDeniedScreen';
import { HomeDashboard } from './components/HomeDashboard';
import { ArchivePage } from './components/ArchivePage';
import { LetterWriter } from './components/LetterWriter';
import { PaymentScreen } from './components/PaymentScreen';
import { SettingsPage } from './components/SettingsPage';

const MainContent = () => {
  const { currentView } = useApp();

  const renderView = () => {
    switch (currentView) {
      case 'language':
        return <LanguageSelection />;
      case 'login':
        return <LoginScreen />;
      case 'register':
        return <RegisterScreen />;
      case 'terms':
        return <TermsScreen />;
      case 'access-denied':
        return <AccessDeniedScreen />;
      case 'home':
        return <HomeDashboard />;
      case 'archive':
        return <ArchivePage />;
      case 'write':
        return <LetterWriter />;
      case 'payment':
        return <PaymentScreen />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <LanguageSelection />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <div className="flex-grow">
        {renderView()}
      </div>
      <Footer />
      <MobileNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
