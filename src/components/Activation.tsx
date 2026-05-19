import React, { useState } from 'react';
import { storage, PackageTier } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Wallet, Info, Copy } from 'lucide-react';
import GlassCard from './GlassCard';

const PACKAGES = [
  { 
    id: 'fox', 
    name: 'FOX', 
    price: 500, 
    color: 'cyan' as const, 
    icon: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c29b3a99-c255-487a-af1b-1a60f81c4ab1/fox-icon-bac6e402-1779166482663.webp',
    benefits: ['Basic earning', 'Daily Tasks']
  },
  { 
    id: 'simba', 
    name: 'SIMBA', 
    price: 1000, 
    color: 'gold' as const, 
    popular: true,
    icon: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c29b3a99-c255-487a-af1b-1a60f81c4ab1/simba-icon-c9c992f4-1779166482541.webp',
    benefits: ['2x task rewards', 'Priority Payouts', 'Weekly Bonuses']
  },
  { 
    id: 'ndovu', 
    name: 'NDOVU', 
    price: 2000, 
    color: 'purple' as const, 
    icon: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c29b3a99-c255-487a-af1b-1a60f81c4ab1/ndovu-icon-52ea4554-1779166482256.webp',
    benefits: ['Max task rewards', 'Admin Support', 'Elite Bonuses']
  }
];

const Activation: React.FC<{ userId: string, onRefresh: () => void }> = ({ userId, onRefresh }) => {
  const [selectedPackage, setSelectedPackage] = useState<typeof PACKAGES[0] | null>(null);
  const [mpesaCode, setMpesaCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const pendingTx = storage.getTransactions().find(t => t.user_id === userId && t.status === 'pending' && t.type === 'activation');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage || !mpesaCode) return;

    setSubmitting(true);
    const tx = {
      id: Math.random().toString(36).substr(2, 9),
      user_id: userId,
      amount: selectedPackage.price,
      mpesa_code: mpesaCode.toUpperCase(),
      type: 'activation' as const,
      status: 'pending' as const,
      package_tier: selectedPackage.id as PackageTier,
      timestamp: new Date().toISOString()
    };

    const txs = storage.getTransactions();
    if (txs.find(t => t.mpesa_code === tx.mpesa_code)) {
      toast.error('This transaction code has already been used.');
      setSubmitting(false);
      return;
    }

    storage.setTransactions([...txs, tx]);
    toast.success('Activation request submitted! Please wait for admin approval.');
    setSubmitting(false);
    onRefresh();
  };

  if (pendingTx) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center p-6 text-center">
        <GlassCard className="max-w-md w-full p-10">
          <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Info className="w-10 h-10 text-yellow-500 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-white">Verification in Progress</h2>
          <p className="text-gray-400 mb-6">
            We are verifying your transaction <b>{pendingTx.mpesa_code}</b>. This usually takes 5-30 minutes. 
            Once approved, you'll get full access to the earning hub.
          </p>
          <Button variant="outline" className="w-full border-white/10" onClick={onRefresh}>Refresh Status</Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] p-6 pb-24">
      <h2 className="text-3xl font-black mb-2 text-center text-white">Activate Your Orbit</h2>
      <p className="text-gray-400 text-center mb-10">Select a package to start earning today</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
        {PACKAGES.map((pkg) => (
          <GlassCard 
            key={pkg.id} 
            glowColor={pkg.color}
            className={selectedPackage?.id === pkg.id ? 'border-2 border-white/50' : ''}
            onClick={() => setSelectedPackage(pkg)}
          >
            {pkg.popular && (
              <div className="absolute top-4 right-4 bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                Most Popular
              </div>
            )}
            <img src={pkg.icon} className="w-16 h-16 mb-4 mx-auto" alt={pkg.name} />
            <h3 className="text-2xl font-black text-center mb-1">{pkg.name}</h3>
            <p className="text-center text-gray-400 mb-4">KES {pkg.price}</p>
            <ul className="space-y-2 mb-6">
              {pkg.benefits.map((b, i) => (
                <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full bg-${pkg.color}-400`} />
                  {b}
                </li>
              ))}
            </ul>
          </GlassCard>
        ))}
      </div>

      {selectedPackage && (
        <GlassCard className="max-w-xl mx-auto border-cyan-500/30">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <Wallet className="text-green-500" />
            </div>
            <div>
              <h4 className="font-bold text-lg">Payment Instructions</h4>
              <p className="text-sm text-gray-400">Complete payment to activate {selectedPackage.name}</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 mb-6 space-y-4 border border-white/5">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Step 1</span>
              <span className="text-white text-sm">Lipa na M-Pesa</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Step 2</span>
              <span className="text-white text-sm">Buy Goods & Services</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Till Number</span>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 font-black text-xl">5441898</span>
                <Copy className="w-4 h-4 cursor-pointer text-gray-500" onClick={() => {
                  navigator.clipboard.writeText('5441898');
                  toast.success('Till number copied!');
                }} />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Amount</span>
              <span className="text-white font-bold">KES {selectedPackage.price}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>M-Pesa Transaction Code</Label>
              <Input 
                required
                placeholder="e.g. RBM7..."
                className="bg-white/5 border-white/10 text-white uppercase"
                value={mpesaCode}
                onChange={(e) => setMpesaCode(e.target.value)}
              />
            </div>
            <Button 
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold h-12"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Code'}
            </Button>
          </form>
        </GlassCard>
      )}
    </div>
  );
};

export default Activation;