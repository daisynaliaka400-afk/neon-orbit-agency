import React, { useState } from 'react';
import { storage, Transaction, Profile } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Check, X, ShieldAlert, BarChart3, Settings } from 'lucide-react';
import GlassCard from './GlassCard';

const AdminDashboard: React.FC<{ onRefresh: () => void, onClose: () => void }> = ({ onRefresh, onClose }) => {
  const [activeView, setActiveView] = useState<'activations' | 'settings'>('activations');
  const transactions = storage.getTransactions().filter(t => t.status === 'pending');
  const profiles = storage.getProfiles();
  const settings = storage.getSettings();

  const handleApprove = (tx: Transaction) => {
    const allTxs = storage.getTransactions();
    const allProfiles = storage.getProfiles();
    
    // 1. Update user profile
    const userIndex = allProfiles.findIndex(p => p.id === tx.user_id);
    if (userIndex === -1) return;
    
    const user = allProfiles[userIndex];
    allProfiles[userIndex] = {
      ...user,
      status: 'active',
      package_tier: tx.package_tier || 'fox'
    };

    // 2. Handle referral commission
    if (user.referred_by) {
      const parentIndex = allProfiles.findIndex(p => p.id === user.referred_by);
      if (parentIndex !== -1) {
        const commission = tx.amount * 0.1;
        allProfiles[parentIndex].balance += commission;
        toast.info(`Commission of KES ${commission} awarded to ${allProfiles[parentIndex].username}`);
      }
    }

    // 3. Update transaction status
    const txIndex = allTxs.findIndex(t => t.id === tx.id);
    allTxs[txIndex].status = 'approved';

    storage.setProfiles(allProfiles);
    storage.setTransactions(allTxs);
    toast.success(`User ${user.username} activated!`);
    onRefresh();
  };

  const handleReject = (tx: Transaction) => {
    const allTxs = storage.getTransactions();
    const txIndex = allTxs.findIndex(t => t.id === tx.id);
    allTxs[txIndex].status = 'rejected';
    storage.setTransactions(allTxs);
    toast.error('Transaction rejected.');
    onRefresh();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#121212] overflow-y-auto p-6 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center border border-red-500/30">
              <ShieldAlert className="text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black">Admin Command</h2>
              <p className="text-gray-400 text-sm">System Control & Verification</p>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose} className="text-gray-400">Close</Button>
        </div>

        <div className="flex gap-4 mb-8">
          <Button 
            className={`flex-1 ${activeView === 'activations' ? 'bg-cyan-600' : 'bg-white/5 border-white/10'}`}
            onClick={() => setActiveView('activations')}
          >
            Activation Queue ({transactions.length})
          </Button>
          <Button 
            className={`flex-1 ${activeView === 'settings' ? 'bg-purple-600' : 'bg-white/5 border-white/10'}`}
            onClick={() => setActiveView('settings')}
          >
            Global Settings
          </Button>
        </div>

        {activeView === 'activations' ? (
          <div className="space-y-4">
            {transactions.length === 0 && (
              <div className="text-center py-20 opacity-50">
                <p>No pending activations</p>
              </div>
            )}
            {transactions.map((tx) => {
              const user = profiles.find(p => p.id === tx.user_id);
              return (
                <GlassCard key={tx.id} className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg">{user?.username}</span>
                        <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full uppercase">{tx.package_tier}</span>
                      </div>
                      <p className="text-sm text-gray-400">Code: <span className="text-white font-mono">{tx.mpesa_code}</span></p>
                      <p className="text-xs text-gray-500">{new Date(tx.timestamp).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-500 flex-1 md:flex-none"
                        onClick={() => handleApprove(tx)}
                      >
                        <Check className="w-4 h-4 mr-2" /> Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="flex-1 md:flex-none"
                        onClick={() => handleReject(tx)}
                      >
                        <X className="w-4 h-4 mr-2" /> Reject
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        ) : (
          <div className="space-y-6">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="font-bold">Withdrawal Toggle</h4>
                  <p className="text-sm text-gray-400">Enable or disable withdrawals globally</p>
                </div>
                <div 
                  onClick={() => {
                    storage.setSettings({ ...settings, withdrawalsEnabled: !settings.withdrawalsEnabled });
                    onRefresh();
                  }}
                  className={`w-14 h-8 rounded-full transition-colors duration-300 p-1 cursor-pointer ${settings.withdrawalsEnabled ? 'bg-green-500' : 'bg-gray-700'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full transition-transform duration-300 ${settings.withdrawalsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-sm uppercase text-gray-500">System Stats</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-xs text-gray-400">Total Users</p>
                    <p className="text-2xl font-black">{profiles.length}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-xs text-gray-400">Active Users</p>
                    <p className="text-2xl font-black text-green-400">{profiles.filter(p => p.status === 'active').length}</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;