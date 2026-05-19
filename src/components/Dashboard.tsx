import React, { useState } from 'react';
import { Profile, storage, Task } from '@/lib/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Wallet, 
  Users, 
  User, 
  PlayCircle, 
  Gamepad2, 
  Trophy, 
  Share2, 
  Youtube,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Play,
  ExternalLink,
  X,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import GlassCard from './GlassCard';

type Tab = 'home' | 'earn' | 'team' | 'profile';

const Dashboard: React.FC<{ user: Profile, onLogout: () => void, onRefresh: () => void }> = ({ user, onLogout, onRefresh }) => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const profiles = storage.getProfiles();
  const referrals = profiles.filter(p => p.referred_by === user.id);
  const activeReferrals = referrals.filter(p => p.status === 'active');

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'youtube': return <Youtube className="w-5 h-5 text-red-500" />;
      case 'article': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'image': return <ImageIcon className="w-5 h-5 text-emerald-500" />;
      case 'trivia': return <Gamepad2 className="w-5 h-5 text-purple-500" />;
      default: return <Play className="w-5 h-5 text-cyan-500" />;
    }
  };

  const renderHome = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black">Hello, {user.username} 👋</h2>
          <p className="text-gray-400 text-sm">Welcome to your Orbit Dashboard</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
          <User className="text-cyan-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="bg-gradient-to-br from-cyan-900/40 to-black/40 border-cyan-500/20">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Current Balance</p>
          <h3 className="text-3xl font-black text-cyan-400">KES {user.balance.toFixed(2)}</h3>
          <div className="mt-4 flex gap-2">
            <Button size="sm" className="bg-white/10 hover:bg-white/20 text-xs h-8">Withdraw</Button>
            <Button size="sm" className="bg-white/10 hover:bg-white/20 text-xs h-8">History</Button>
          </div>
        </GlassCard>
        
        <GlassCard className="bg-gradient-to-br from-purple-900/40 to-black/40 border-purple-500/20">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Today's Profit</p>
          <h3 className="text-3xl font-black text-purple-400">KES 0.00</h3>
          <p className="text-[10px] text-gray-500 mt-1">Refreshes every 24h</p>
        </GlassCard>

        <GlassCard className="bg-gradient-to-br from-yellow-900/40 to-black/40 border-yellow-500/20">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Team Size</p>
          <h3 className="text-3xl font-black text-yellow-400">{referrals.length} <span className="text-sm font-normal text-gray-500">Members</span></h3>
          <p className="text-[10px] text-gray-500 mt-1">{activeReferrals.length} active</p>
        </GlassCard>
      </div>

      <GlassCard className="border-white/5 bg-white/2">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold">Earning Overview</h4>
          <span className="text-xs text-cyan-400 cursor-pointer">View Details</span>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Task Rewards', value: 'KES 0.00', icon: PlayCircle, color: 'text-blue-400' },
            { label: 'Referral Bonus', value: 'KES 0.00', icon: Users, color: 'text-green-400' },
            { label: 'Spin Winnings', value: 'KES 0.00', icon: Trophy, color: 'text-yellow-400' }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <span className="font-bold">{item.value}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );

  const renderEarn = () => {
    const tasks = storage.getTasks();
    const isCompleted = (taskId: string) => tasks.find(t => t.id === taskId)?.completed_by.includes(user.id);

    const handleTaskCompletion = (task: Task) => {
      if (isCompleted(task.id)) return toast.info('Task already completed');
      
      toast.promise(
        new Promise((resolve) => {
          setTimeout(() => {
            const updatedTasks = tasks.map(t => 
              t.id === task.id ? { ...t, completed_by: [...t.completed_by, user.id] } : t
            );
            storage.setTasks(updatedTasks);
            
            const profiles = storage.getProfiles();
            const updatedProfiles = profiles.map(p => 
              p.id === user.id ? { ...p, balance: p.balance + task.reward } : p
            );
            storage.setProfiles(updatedProfiles);
            resolve(true);
            onRefresh();
            setSelectedTask(null);
          }, 5000);
        }),
        {
          loading: `Processing task... Please wait for 5 seconds`,
          success: `Credited KES ${task.reward.toFixed(2)} to your balance!`,
          error: 'Error processing task'
        }
      );
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <GlassCard className="p-4 text-center cursor-pointer border-cyan-500/20" onClick={() => toast.info("Trivia starts at 8 PM daily!")}>
            <Gamepad2 className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
            <h4 className="font-bold text-sm">Daily Trivia</h4>
            <p className="text-[10px] text-gray-500">Live in 4h</p>
          </GlassCard>
          <GlassCard className="p-4 text-center cursor-pointer border-yellow-500/20" onClick={() => toast.info("Spin available in 14 hours")}>
            <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
            <h4 className="font-bold text-sm">Spin Wheel</h4>
            <p className="text-[10px] text-gray-500">1 Spin Ready</p>
          </GlassCard>
        </div>

        <h3 className="font-black text-xl mb-4">Your Tier Tasks</h3>
        <div className="space-y-4">
          {tasks.map((task) => {
            const completed = isCompleted(task.id);
            const canAccess = task.required_tier === 'fox' || 
                             (task.required_tier === 'simba' && (user.package_tier === 'simba' || user.package_tier === 'ndovu')) ||
                             (task.required_tier === 'ndovu' && user.package_tier === 'ndovu');

            return (
              <GlassCard 
                key={task.id} 
                className={`p-4 ${completed ? 'opacity-50' : ''} ${!canAccess ? 'grayscale blur-[1px]' : ''}`}
                onClick={() => canAccess && !completed && setSelectedTask(task)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                      {getTaskIcon(task.type)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{task.title}</h4>
                      <p className="text-xs text-gray-400">Reward: KES {task.reward.toFixed(2)}</p>
                    </div>
                  </div>
                  {completed ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                  ) : !canAccess ? (
                    <div className="text-[10px] font-black text-gray-500 uppercase">Locked</div>
                  ) : (
                    <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500 text-xs font-bold">
                      Start
                    </Button>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Task Modal */}
        <AnimatePresence>
          {selectedTask && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                onClick={() => setSelectedTask(null)}
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#121212] shadow-2xl"
              >
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-xl bg-white/5">
                      {getTaskIcon(selectedTask.type)}
                    </div>
                    <h3 className="text-lg font-bold">{selectedTask.title}</h3>
                  </div>
                  <button onClick={() => setSelectedTask(null)} className="p-2 rounded-full hover:bg-white/10">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6">
                  <p className="text-sm text-gray-400 mb-6">{selectedTask.description}</p>
                  
                  <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40 mb-8">
                    {selectedTask.type === 'youtube' && selectedTask.content_url && (
                      <div className="aspect-video w-full">
                        <iframe 
                          src={selectedTask.content_url}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                    
                    {selectedTask.type === 'article' && selectedTask.content_url && (
                      <div className="p-8 text-center">
                        <FileText className="w-12 h-12 text-blue-500 mx-auto mb-4 opacity-50" />
                        <Button 
                          onClick={() => window.open(selectedTask.content_url, '_blank')}
                          className="bg-blue-600 hover:bg-blue-500"
                        >
                          Visit Site <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    )}

                    {selectedTask.type === 'image' && selectedTask.content_url && (
                      <img src={selectedTask.content_url} className="w-full object-cover max-h-[300px]" alt="Asset" />
                    )}

                    {selectedTask.type === 'trivia' && (
                      <div className="p-8 text-center">
                        <Gamepad2 className="w-12 h-12 text-purple-500 mx-auto mb-4 opacity-50" />
                        <p className="text-xs text-gray-500 mb-4">Click below to start the timer and claim reward.</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between text-xs px-2">
                      <span className="text-gray-500">Processing Time</span>
                      <span className="text-cyan-400 flex items-center gap-1 font-bold"><Clock className="w-3 h-3" /> 5 Seconds</span>
                    </div>
                    <Button 
                      onClick={() => handleTaskCompletion(selectedTask)}
                      className="w-full bg-cyan-600 hover:bg-cyan-500 font-bold h-12 rounded-xl"
                    >
                      Complete Task & Earn KES {selectedTask.reward.toFixed(2)}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderTeam = () => {
    const refLink = `${window.location.origin}?ref=${user.referral_code}`;

    return (
      <div className="space-y-6">
        <GlassCard className="bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border-white/5">
          <h3 className="font-bold text-lg mb-2">Refer and Earn</h3>
          <p className="text-sm text-gray-400 mb-6">Earn 10% instant commission when your friends activate their accounts.</p>
          
          <div className="flex items-center gap-2 p-3 bg-black/40 rounded-xl border border-white/10 mb-4">
            <span className="flex-1 text-sm font-mono truncate">{refLink}</span>
            <Button size="icon" variant="ghost" className="shrink-0" onClick={() => {
              navigator.clipboard.writeText(refLink);
              toast.success('Referral link copied!');
            }}>
              <Share2 className="w-4 h-4 text-cyan-400" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1 bg-[#25D366] hover:bg-[#128C7E] h-10 gap-2">
              WhatsApp
            </Button>
            <Button className="flex-1 bg-[#1877F2] hover:bg-[#0E52B0] h-10 gap-2">
              Facebook
            </Button>
          </div>
        </GlassCard>

        <h3 className="font-black text-xl mb-4">Your Downlines</h3>
        <div className="space-y-2">
          {referrals.length === 0 ? (
            <p className="text-center text-gray-500 py-10">No referrals yet. Start sharing!</p>
          ) : (
            referrals.map((ref) => (
              <GlassCard key={ref.id} className="p-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold">
                      {ref.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{ref.username}</p>
                      <p className="text-[10px] text-gray-500">{new Date(ref.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className={`text-[10px] font-bold px-2 py-1 rounded-full ${ref.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                    {ref.status.toUpperCase()}
                  </div>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="flex flex-col items-center py-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 p-1 mb-4 shadow-2xl">
          <div className="w-full h-full rounded-full bg-[#121212] flex items-center justify-center">
            <span className="text-3xl font-black text-white">{user.username.slice(0, 2).toUpperCase()}</span>
          </div>
        </div>
        <h2 className="text-2xl font-black">{user.username}</h2>
        <p className="text-cyan-400 font-bold uppercase text-xs tracking-widest">{user.package_tier === 'none' ? 'Guest' : user.package_tier}</p>
      </div>

      <div className="space-y-2">
        {[
          { icon: Settings, label: 'Account Settings' },
          { icon: Wallet, label: 'Withdrawal History' },
          { icon: Share2, label: 'Marketing Assets' },
          { icon: ShieldCheck, label: 'Privacy & Security' }
        ].map((item, i) => (
          <GlassCard key={i} className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/10">
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5 text-gray-400" />
              <span className="font-medium">{item.label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </GlassCard>
        ))}
      </div>

      <Button variant="destructive" className="w-full h-12 font-bold gap-2 rounded-xl mt-8" onClick={onLogout}>
        <LogOut className="w-4 h-4" /> Sign Out
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6 pb-28">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'home' && renderHome()}
        {activeTab === 'earn' && renderEarn()}
        {activeTab === 'team' && renderTeam()}
        {activeTab === 'profile' && renderProfile()}
      </motion.div>

      {/* Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 z-50">
        <div className="max-w-md mx-auto bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-2 flex justify-between shadow-2xl">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'earn', icon: Wallet, label: 'Earn' },
            { id: 'team', icon: Users, label: 'Team' },
            { id: 'profile', icon: User, label: 'Profile' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex flex-col items-center p-2 rounded-2xl transition-all duration-300 w-16 ${activeTab === tab.id ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <tab.icon className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-bold">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;