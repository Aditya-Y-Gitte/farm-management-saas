import { 
  Home, 
  PawPrint, 
  Droplets, 
  CheckSquare, 
  Coins, 
  Tractor, 
  Box, 
  Settings, 
  User, 
  LogOut,
  Leaf,
  LucideIcon 
} from 'lucide-react';

export type NavSection = 'primary' | 'secondary' | 'action';

export type NavTranslationKey = 
  | 'navigation:home'
  | 'navigation:animals'
  | 'navigation:milk'
  | 'navigation:tasks'
  | 'navigation:finance'
  | 'navigation:crops'
  | 'navigation:inventory'
  | 'navigation:settings'
  | 'navigation:profile'
  | 'navigation:logout'
  | 'navigation:more'
  | 'navigation:feed';

export interface NavItem {
  id: string;
  translationKey: NavTranslationKey;
  path?: string;
  icon: LucideIcon;
  section: NavSection;
  enabled: boolean;
  requiresAuth?: boolean;
}

export const NAVIGATION_CONFIG: NavItem[] = [
  // Primary (Mobile Bottom Nav + Top of Sidebar)
  {
    id: 'home',
    translationKey: 'navigation:home',
    path: '/dashboard',
    icon: Home,
    section: 'primary',
    enabled: true,
  },
  {
    id: 'livestock',
    translationKey: 'navigation:animals',
    path: '/livestock',
    icon: PawPrint,
    section: 'primary',
    enabled: true,
  },
  {
    id: 'dairy',
    translationKey: 'navigation:milk',
    path: '/dairy',
    icon: Droplets,
    section: 'primary',
    enabled: true,
  },
  {
    id: 'tasks',
    translationKey: 'navigation:tasks',
    path: '/tasks',
    icon: CheckSquare,
    section: 'primary',
    enabled: true, // Mark enabled so it shows up in navigation
  },
  
  // Secondary (More Menu + Bottom of Sidebar)
  {
    id: 'finances',
    translationKey: 'navigation:finance',
    path: '/finances',
    icon: Coins,
    section: 'secondary',
    enabled: true,
  },
  {
    id: 'feed',
    translationKey: 'navigation:feed',
    path: '/feed',
    icon: Leaf,
    section: 'secondary',
    enabled: true,
  },
  {
    id: 'crops',
    translationKey: 'navigation:crops',
    path: '/crops',
    icon: Tractor,
    section: 'secondary',
    enabled: false,
  },
  {
    id: 'inventory',
    translationKey: 'navigation:inventory',
    path: '/inventory',
    icon: Box,
    section: 'secondary',
    enabled: false,
  },
  {
    id: 'settings',
    translationKey: 'navigation:settings',
    path: '/settings',
    icon: Settings,
    section: 'secondary',
    enabled: false, // Settings doesn't exist yet, disable for now
  },
  {
    id: 'profile',
    translationKey: 'navigation:profile',
    path: '/profile',
    icon: User,
    section: 'secondary',
    enabled: false, // Profile page doesn't exist yet, disable for now
  },

  // Actions (Logout)
  {
    id: 'logout',
    translationKey: 'navigation:logout',
    icon: LogOut,
    section: 'action',
    enabled: true,
  }
];

export const getPrimaryNavigation = () => NAVIGATION_CONFIG.filter(n => n.section === 'primary' && n.enabled);
export const getSecondaryNavigation = () => NAVIGATION_CONFIG.filter(n => n.section === 'secondary' && n.enabled);
export const getActionNavigation = () => NAVIGATION_CONFIG.filter(n => n.section === 'action' && n.enabled);
