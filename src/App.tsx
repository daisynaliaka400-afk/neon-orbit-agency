import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { storage, Profile } from '@/lib/storage';
import LandingPage from '@/components/LandingPage';
import Auth from '@/components/Auth';
import Dashboard from '@/components/Dashboard';
import Activation from '@/components/Activation';
import AdminDashboard from '@/components/AdminDashboard';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

type View = 'landing' | 'auth' | 'dashboard' | 'activation';

function App() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const user = storage.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      if (user.status === 'active') {
        setCurrentView('dashboard');
      } else {
        setCurrentView('activation');
      }
    } else {
      setCurrentView('landing');
    }
  }, [tick]);

  const handleAuthSuccess = (userId: string) => {
    setTick(t => t + 1);
  };

  const handleLogout = () => {
    storage.setCurrentUser(null);
    setCurrentUser(null);
    setCurrentView('landing');
    setTick(t => t + 1);
  };

  const refresh = () => setTick(t => t + 1);

  return (
    <div className="bg-[#121212] min-h-screen font-sans selection:bg-cyan-500/30 selection:text-white">
      {currentView === 'landing' && <LandingPage onJoin={() => setCurrentView('auth')} />}
      
      {currentView === 'auth' && (
        <Auth 
          onSuccess={handleAuthSuccess} 
          onGoToLanding={() => setCurrentView('landing')} 
        />
      )}
      
      {currentView === 'activation' && currentUser && (
        <Activation userId={currentUser.id} onRefresh={refresh} />
      )}
      
      {currentView === 'dashboard' && currentUser && (
        <Dashboard user={currentUser} onLogout={handleLogout} onRefresh={refresh} />
      )}

      {/* Admin Toggle (STRICT ROLE-BASED ACCESS CONTROL) */}
      {currentUser?.is_admin && (
        <Button 
          onClick={() => setShowAdmin(true)}
          className="fixed bottom-24 right-6 z-[60] w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] border-none p-0 flex items-center justify-center"
        >
          <Settings className="w-6 h-6 text-white" />
        </Button>
      )}

      {/* PROTECTED ADMIN VIEW */}
      {showAdmin && currentUser?.is_admin && (
        <AdminDashboard onRefresh={refresh} onClose={() => setShowAdmin(false)} />
      )}

      <Toaster position="top-center" theme="dark" richColors />
    </div>
  );
}

export default App;