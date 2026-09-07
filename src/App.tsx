import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileBottomBar } from './components/MobileBottomBar';
import { FloatingQuickMenu } from './components/FloatingQuickMenu';
import { ReservationWizard } from './components/ReservationWizard';
import { HomeView } from './views/HomeView';
import { AboutView } from './views/AboutView';
import { ServiceListView } from './views/ServiceListView';
import { ServiceDetailView } from './views/ServiceDetailView';
import { PortfolioView } from './views/PortfolioView';
import { ReviewView } from './views/ReviewView';
import { LoginView } from './views/LoginView';
import { RegisterView } from './views/RegisterView';
import { MyPageView } from './views/MyPageView';
import { AdminView } from './views/AdminView';
import { EventView } from './views/EventView';
import { MascotScrollTrigger } from './components/MascotScrollTrigger';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white font-sans antialiased">
      {/* Sticky Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && <HomeView />}
        {currentView === 'about' && <AboutView />}
        {currentView === 'services' && <ServiceListView />}
        {currentView === 'service-detail' && <ServiceDetailView />}
        {currentView === 'portfolio' && <PortfolioView />}
        {currentView === 'review' && <ReviewView />}
        {currentView === 'event' && <EventView />}
        {currentView === 'reservation' && <ReservationWizard />}
        {currentView === 'login' && <LoginView />}
        {currentView === 'register' && <RegisterView />}
        {currentView === 'mypage' && <MyPageView />}
        {currentView === 'admin' && <AdminView />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mascot Scroll Trigger (Pops up when user scrolls down, links to EventView) */}
      {currentView !== 'reservation' && currentView !== 'event' && <MascotScrollTrigger />}

      {/* Floating Quick Action Menu (Phone, KakaoTalk, Instagram, Blog with hover tooltips) */}
      {currentView !== 'reservation' && <FloatingQuickMenu />}

      {/* Fixed Mobile Bottom CTA Bar (Only visible on mobile, hidden during reservation wizard) */}
      {currentView !== 'reservation' && <MobileBottomBar />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
