import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type PackageTier = 'none' | 'fox' | 'simba' | 'ndovu';
export type UserStatus = 'pending' | 'active';
export type TransactionType = 'activation' | 'withdrawal';
export type TransactionStatus = 'pending' | 'approved' | 'rejected';
export type TaskType = 'youtube' | 'tiktok' | 'trivia' | 'article' | 'image';

export interface Profile {
  id: string;
  username: string;
  phone_number: string;
  package_tier: PackageTier;
  balance: number;
  referral_code: string;
  referred_by?: string;
  status: UserStatus;
  is_admin: boolean;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  mpesa_code: string;
  type: TransactionType;
  status: TransactionStatus;
  package_tier?: PackageTier;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  type: TaskType;
  required_tier: PackageTier;
  content_url?: string;
  completed_by: string[]; // user ids
}

// Initial Mock Data with realistic content
const INITIAL_TASKS: Task[] = [
  // FOX TASKS
  { 
    id: 'f1', 
    title: 'Welcome to MetaOrbit', 
    description: 'Watch our official introduction video to understand how MetaOrbit works.',
    reward: 15.50, 
    type: 'youtube', 
    required_tier: 'fox', 
    content_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    completed_by: [] 
  },
  { 
    id: 'f2', 
    title: 'Daily Tech News', 
    description: 'Read the latest tech news and earn rewards for staying informed.',
    reward: 10.25, 
    type: 'article', 
    required_tier: 'fox', 
    content_url: 'https://techcrunch.com/',
    completed_by: [] 
  },
  { 
    id: 'f3', 
    title: 'Basic Orbit Trivia', 
    description: 'Answer 5 simple questions about our platform.',
    reward: 20.00, 
    type: 'trivia', 
    required_tier: 'fox', 
    completed_by: [] 
  },
  
  // SIMBA TASKS
  { 
    id: 's1', 
    title: 'Entrepreneurship 101', 
    description: 'Watch this masterclass on starting a digital agency.',
    reward: 45.00, 
    type: 'youtube', 
    required_tier: 'simba', 
    content_url: 'https://www.youtube.com/embed/7o8Xz9A_v8k',
    completed_by: [] 
  },
  { 
    id: 's2', 
    title: 'Creative Design Showcase', 
    description: 'View these high-converting ad designs and analyze their impact.',
    reward: 35.75, 
    type: 'image', 
    required_tier: 'simba', 
    content_url: 'https://images.unsplash.com/photo-1551288049-bbbda546697a?auto=format&fit=crop&q=80&w=1000',
    completed_by: [] 
  },
  { 
    id: 's3', 
    title: 'Advanced Market Trivia', 
    description: 'Test your knowledge on current market trends.',
    reward: 60.00, 
    type: 'trivia', 
    required_tier: 'simba', 
    completed_by: [] 
  },
  
  // NDOVU TASKS
  { 
    id: 'n1', 
    title: 'Elite Wealth Management', 
    description: 'Access the exclusive Ndovu strategy for long-term financial growth.',
    reward: 120.00, 
    type: 'youtube', 
    required_tier: 'ndovu', 
    content_url: 'https://www.youtube.com/embed/W6NZfCO5SIk',
    completed_by: [] 
  },
  { 
    id: 'n2', 
    title: 'Future of Decentralized Finance', 
    description: 'Read our comprehensive whitepaper on the future of DeFi and earning.',
    reward: 200.00, 
    type: 'article', 
    required_tier: 'ndovu', 
    content_url: 'https://ethereum.org/en/defi/',
    completed_by: [] 
  },
  { 
    id: 'n3', 
    title: 'Ndovu Masterclass Quiz', 
    description: 'Exclusive trivia for Ndovu members with high stakes.',
    reward: 250.00, 
    type: 'trivia', 
    required_tier: 'ndovu', 
    completed_by: [] 
  },
];

export const storage = {
  getProfiles: (): Profile[] => JSON.parse(localStorage.getItem('mo_profiles') || '[]'),
  setProfiles: (profiles: Profile[]) => localStorage.setItem('mo_profiles', JSON.stringify(profiles)),
  
  getTransactions: (): Transaction[] => JSON.parse(localStorage.getItem('mo_transactions') || '[]'),
  setTransactions: (transactions: Transaction[]) => localStorage.setItem('mo_transactions', JSON.stringify(transactions)),
  
  getTasks: (): Task[] => {
    const tasks = localStorage.getItem('mo_tasks');
    if (!tasks) {
      localStorage.setItem('mo_tasks', JSON.stringify(INITIAL_TASKS));
      return INITIAL_TASKS;
    }
    return JSON.parse(tasks);
  },
  setTasks: (tasks: Task[]) => localStorage.setItem('mo_tasks', JSON.stringify(tasks)),

  getSettings: () => JSON.parse(localStorage.getItem('mo_settings') || '{"withdrawalsEnabled": true}'),
  setSettings: (settings: any) => localStorage.setItem('mo_settings', JSON.stringify(settings)),

  getCurrentUser: (): Profile | null => {
    const userId = localStorage.getItem('mo_current_user_id');
    if (!userId) return null;
    return storage.getProfiles().find(p => p.id === userId) || null;
  },
  setCurrentUser: (userId: string | null) => {
    if (userId) localStorage.setItem('mo_current_user_id', userId);
    else localStorage.removeItem('mo_current_user_id');
  }
};