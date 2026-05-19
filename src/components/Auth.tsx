import React, { useState } from 'react';
import { storage, PackageTier } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ShieldCheck, User, Lock, Phone, UserPlus } from 'lucide-react';
import GlassCard from './GlassCard';

interface AuthProps {
  onSuccess: (userId: string) => void;
  onGoToLanding: () => void;
}

const ADMIN_CREDENTIALS = {
  username: '0112973841',
  password: 'ISINDU316711'
};

type AuthMode = 'login' | 'register' | 'admin';

const Auth: React.FC<AuthProps> = ({ onSuccess, onGoToLanding }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [refCode, setRefCode] = useState(new URLSearchParams(window.location.search).get('ref') || '');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const profiles = storage.getProfiles();

    if (mode === 'admin') {
      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        let admin = profiles.find(p => p.username === ADMIN_CREDENTIALS.username);
        if (!admin) {
          admin = {
            id: 'admin-root',
            username: ADMIN_CREDENTIALS.username,
            phone_number: 'SYSTEM',
            package_tier: 'ndovu',
            balance: 1000000,
            referral_code: 'ORBIT_ADMIN',
            status: 'active',
            is_admin: true,
            created_at: new Date().toISOString()
          };
          storage.setProfiles([...profiles, admin]);
        }
        storage.setCurrentUser(admin.id);
        onSuccess(admin.id);
        toast.success('System Administrator Authenticated');
        return;
      } else {
        toast.error('Invalid Administrator Credentials');
        return;
      }
    }

    if (mode === 'login') {
      const user = profiles.find(p => p.username === username && p.phone_number === phone);
      if (user) {
        storage.setCurrentUser(user.id);
        onSuccess(user.id);
        toast.success(`Welcome back, ${user.username}!`);
      } else {
        toast.error('Invalid credentials. Check username and phone number.');
      }
    } else {
      // Register logic
      if (username === ADMIN_CREDENTIALS.username) return toast.error('Username reserved');
      if (profiles.find(p => p.username === username)) return toast.error('Username taken');
      
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        username,
        phone_number: phone,
        package_tier: 'none' as PackageTier,
        balance: 0,
        referral_code: Math.random().toString(36).substr(2, 6).toUpperCase(),
        referred_by: refCode ? (profiles.find(p => p.referral_code === refCode)?.id) : undefined,
        status: 'pending' as const,
        is_admin: false,
        created_at: new Date().toISOString()
      };

      storage.setProfiles([...profiles, newUser]);
      storage.setCurrentUser(newUser.id);
      onSuccess(newUser.id);
      toast.success('Account created successfully!');
    }
  };

  const getTitle = () => {
    if (mode === 'admin') return 'Admin Access';
    if (mode === 'login') return 'Welcome Back';
    return 'Create Account';
  };

  const getSubtitle = () => {
    if (mode === 'admin') return 'Authorized Personnel Only';
    if (mode === 'login') return 'Login to your MetaOrbit portal';
    return 'Join the fastest growing agency network';
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-6">
      <div className="absolute top-6 left-6">
        <button onClick={onGoToLanding} className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors">← Back</button>
      </div>
      
      <GlassCard className="w-full max-w-md border-white/5 shadow-2xl relative">
        {mode === 'admin' && (
          <div className="absolute -top-4 -right-4 bg-red-600/20 text-red-500 border border-red-500/30 p-2 rounded-xl backdrop-blur-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
        )}

        <div className="text-center mb-8">
          <h2 className={`text-3xl font-black mb-2 ${mode === 'admin' ? 'text-red-500' : 'text-white'}`}>
            {getTitle()}
          </h2>
          <p className="text-gray-400">
            {getSubtitle()}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-gray-300 flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-500" /> Username
            </Label>
            <Input 
              required
              className="bg-white/5 border-white/10 text-white focus:border-cyan-500/50 h-12" 
              placeholder={mode === 'admin' ? "Admin Username" : "e.g. orbit_warrior"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          {mode !== 'admin' && (
            <div className="space-y-2">
              <Label className="text-gray-300 flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-500" /> Phone Number (M-Pesa)
              </Label>
              <Input 
                required
                className="bg-white/5 border-white/10 text-white focus:border-cyan-500/50 h-12" 
                placeholder="07..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-gray-300 flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-500" /> Password
            </Label>
            <Input 
              required
              type="password"
              className="bg-white/5 border-white/10 text-white focus:border-cyan-500/50 h-12" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {mode === 'register' && (
             <div className="space-y-2">
              <Label className="text-gray-300 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-cyan-500" /> Referral Code
              </Label>
              <Input 
                className="bg-white/5 border-white/10 text-white focus:border-cyan-500/50 h-12" 
                placeholder="REF123"
                value={refCode}
                onChange={(e) => setRefCode(e.target.value)}
              />
            </div>
          )}

          <Button 
            className={`w-full font-bold h-12 mt-4 shadow-lg border-none transition-all ${
              mode === 'admin' 
                ? 'bg-red-600 hover:bg-red-500 shadow-red-900/20' 
                : 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-900/20'
            }`}
          >
            {mode === 'register' ? 'Join the Orbit' : 'Authenticate'}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
          <div className="flex flex-col gap-3 text-center text-sm">
            {mode === 'admin' ? (
              <button 
                onClick={() => setMode('login')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Back to Standard Login
              </button>
            ) : (
              <>
                <p className="text-gray-400">
                  {mode === 'login' ? "New to the platform? " : "Already have an account? "}
                  <button 
                    onClick={() => {
                      setMode(mode === 'login' ? 'register' : 'login');
                      setUsername('');
                      setPassword('');
                      setPhone('');
                    }}
                    className="text-cyan-400 font-bold hover:underline ml-1"
                  >
                    {mode === 'login' ? 'Create Account' : 'Login Now'}
                  </button>
                </p>
                <button 
                  onClick={() => setMode('admin')}
                  className="text-xs text-gray-500 hover:text-red-400 transition-colors uppercase tracking-widest font-bold"
                >
                  Admin Portal Access
                </button>
              </>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default Auth;