import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, ShieldCheck, TrendingUp, Users, Youtube, FileText, Image as ImageIcon, Gamepad2, Play, ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { storage, Task } from '@/lib/storage';
import GlassCard from './GlassCard';

interface LandingPageProps {
  onJoin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onJoin }) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const tasks = storage.getTasks();

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'youtube': return <Youtube className="w-6 h-6 text-red-500" />;
      case 'article': return <FileText className="w-6 h-6 text-blue-500" />;
      case 'image': return <ImageIcon className="w-6 h-6 text-emerald-500" />;
      case 'trivia': return <Gamepad2 className="w-6 h-6 text-purple-500" />;
      default: return <Play className="w-6 h-6 text-cyan-500" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'fox': return 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10';
      case 'simba': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      case 'ndovu': return 'text-purple-400 border-purple-400/30 bg-purple-400/10';
      default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white selection:bg-cyan-500/30 pb-20">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/c29b3a99-c255-487a-af1b-1a60f81c4ab1/hero-bg-8edff606-1779166482926.webp" 
            className="w-full h-full object-cover opacity-40"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/0 via-[#121212]/50 to-[#121212]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            MetaOrbit <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Agencies</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-xl mx-auto">
            The ultimate Multi-Income Stream platform. Start earning from tasks, referrals, and more today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onJoin}
              size="lg" 
              className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-full px-8 h-14 text-lg font-bold shadow-[0_0_20px_rgba(0,242,255,0.4)]"
            >
              Start Earning Now
            </Button>
            <a href="#tasks">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white/20 bg-white/5 backdrop-blur-md rounded-full px-8 h-14 text-lg font-bold w-full sm:w-auto"
              >
                Browse Tasks
              </Button>
            </a>
          </div>
        </motion.div>

        {/* Floating Stats */}
        <div className="absolute bottom-10 left-0 right-0 z-10 px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            <GlassCard className="py-4 text-center">
              <p className="text-cyan-400 font-bold text-xl">KES 10.5M+</p>
              <p className="text-xs text-gray-400 uppercase tracking-widest">Total Payouts</p>
            </GlassCard>
            <GlassCard className="py-4 text-center">
              <p className="text-purple-400 font-bold text-xl">25k+</p>
              <p className="text-xs text-gray-400 uppercase tracking-widest">Active Earners</p>
            </GlassCard>
            <GlassCard className="py-4 text-center hidden md:block">
              <p className="text-yellow-400 font-bold text-xl">150+</p>
              <p className="text-xs text-gray-400 uppercase tracking-widest">Daily Tasks</p>
            </GlassCard>
            <GlassCard className="py-4 text-center hidden md:block">
              <p className="text-emerald-400 font-bold text-xl">99.9%</p>
              <p className="text-xs text-gray-400 uppercase tracking-widest">Uptime Rate</p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Task Feed Section */}
      <section id="tasks" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">Available Earning <span className="text-cyan-400">Tasks</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Every task you see below is an opportunity to grow your balance. High-tier members get access to exclusive high-reward tasks.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <GlassCard 
              key={task.id} 
              className="group hover:border-cyan-500/50 cursor-pointer transition-all duration-500"
              onClick={() => setSelectedTask(task)}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  {getTaskIcon(task.type)}
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getTierColor(task.required_tier)}`}>
                  {task.required_tier} TIER
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">{task.title}</h3>
              <p className="text-sm text-gray-400 line-clamp-2 mb-6">{task.description}</p>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest">Reward</span>
                  <span className="text-xl font-black text-emerald-400">KES {task.reward.toFixed(2)}</span>
                </div>
                <Button size="sm" className="rounded-full bg-cyan-600 hover:bg-cyan-500 text-xs font-bold">
                  View Details
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Task Detail Modal */}
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
              className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl border border-white/10 bg-[#121212] shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-xl bg-white/5">
                    {getTaskIcon(selectedTask.type)}
                  </div>
                  <h3 className="text-xl font-bold">{selectedTask.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedTask(null)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex-1 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="block text-[10px] text-emerald-500/70 uppercase tracking-widest font-bold mb-1">Total Reward</span>
                    <span className="text-2xl font-black text-emerald-400">KES {selectedTask.reward.toFixed(2)}</span>
                  </div>
                  <div className="flex-1 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                    <span className="block text-[10px] text-cyan-500/70 uppercase tracking-widest font-bold mb-1">Required Tier</span>
                    <span className="text-2xl font-black text-cyan-400 uppercase">{selectedTask.required_tier}</span>
                  </div>
                </div>

                <p className="text-gray-400 mb-8 leading-relaxed">{selectedTask.description}</p>

                {/* Media Preview Area */}
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40">
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
                      <FileText className="w-16 h-16 text-blue-500 mx-auto mb-4 opacity-50" />
                      <h4 className="text-lg font-bold mb-4">External Article Entry</h4>
                      <p className="text-sm text-gray-500 mb-6">This task requires you to read a specific article on our partner network. Click the button below to open it.</p>
                      <Button 
                        onClick={() => window.open(selectedTask.content_url, '_blank')}
                        className="bg-blue-600 hover:bg-blue-500"
                      >
                        Open Article <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )}

                  {selectedTask.type === 'image' && selectedTask.content_url && (
                    <div className="flex flex-col">
                      <img 
                        src={selectedTask.content_url}
                        alt="Task Asset"
                        className="w-full object-cover max-h-[400px]"
                      />
                      <div className="p-4 text-center bg-black/60">
                        <p className="text-xs text-gray-400">High-resolution design asset for SIMBA members.</p>
                      </div>
                    </div>
                  )}

                  {selectedTask.type === 'trivia' && (
                    <div className="p-12 text-center">
                      <Gamepad2 className="w-16 h-16 text-purple-500 mx-auto mb-4 opacity-50" />
                      <h4 className="text-xl font-black mb-2">Ready to Play?</h4>
                      <p className="text-sm text-gray-500 mb-8">Answer 5 high-speed questions correctly to claim your reward. You have one attempt every 24 hours.</p>
                      <Button 
                        onClick={onJoin}
                        className="bg-purple-600 hover:bg-purple-500 rounded-full px-8"
                      >
                        Start Trivia Challenge
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 bg-white/5 border-t border-white/10 flex items-center justify-between">
                <p className="text-xs text-gray-500 font-medium italic">Login or register to complete this task and earn rewards.</p>
                <Button onClick={onJoin} className="bg-cyan-600 hover:bg-cyan-500 font-bold px-6">
                  Start Earning
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Why Section (kept for branding) */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">Platform Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Rocket, title: "Fast Activation", desc: "Instant manual verification for your payment via M-Pesa." },
            { icon: TrendingUp, title: "High Rewards", desc: "Up to 3x task rewards on higher package tiers." },
            { icon: ShieldCheck, title: "Secure Payouts", desc: "Reliable weekly withdrawals directly to your phone." }
          ].map((f, i) => (
            <GlassCard key={i} className="flex flex-col items-center text-center p-8">
              <f.icon className="w-12 h-12 text-cyan-400 mb-6" />
              <h3 className="text-xl font-bold mb-4">{f.title}</h3>
              <p className="text-gray-400">{f.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;