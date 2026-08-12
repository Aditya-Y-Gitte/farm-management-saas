/// <summary>
/// Centralized application configuration.
/// Adding a new module = adding one entry to the `modules` array below.
/// Everything else (sidebar, routing, API endpoints) derives from this config.
/// </summary>

export interface AppModule {
  id: string;
  label: string;
  icon: string;          // Emoji or icon identifier
  path: string;          // Route path
  apiBasePath: string;   // API endpoint prefix
  enabled: boolean;      // Feature flag
  description: string;
}

export interface AppConfig {
  appName: string;
  appVersion: string;
  apiGatewayUrl: string;
  googleClientId: string;
  modules: AppModule[];
  defaultModule: string;  // Module ID to show after login
}

const config: AppConfig = {
  appName: 'Farm Management SaaS',
  appVersion: '2.0.0',
  apiGatewayUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  googleClientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',

  defaultModule: 'dashboard',

  modules: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: '/dashboard',
      apiBasePath: '/api/gateway/metrics',
      enabled: true,
      description: 'Farm overview with aggregated metrics from all services'
    },
    {
      id: 'livestock',
      label: 'Livestock',
      icon: '🐄',
      path: '/livestock',
      apiBasePath: '/api/catalog/livestock',
      enabled: true,
      description: 'Manage farm animals — add, edit, track health & vaccinations'
    },
    {
      id: 'dairy',
      label: 'Dairy',
      icon: '🥛',
      path: '/dairy',
      apiBasePath: '/api/production/dairy',
      enabled: true,
      description: 'Track daily milk production, quality, and trends'
    },
    // --- Future Modules (disabled by default) ---
    {
      id: 'crops',
      label: 'Crops',
      icon: '🌾',
      path: '/crops',
      apiBasePath: '/api/production/crops',
      enabled: false,
      description: 'Track planting, harvesting, and crop yields'
    },
    {
      id: 'finances',
      label: 'Finances',
      icon: '💰',
      path: '/finances',
      apiBasePath: '/api/finance',
      enabled: true,
      description: 'Income, expenses, and profitability tracking'
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: '📦',
      path: '/inventory',
      apiBasePath: '/api/catalog/inventory',
      enabled: false,
      description: 'Feed, medicine, and supply management'
    }
  ]
};

// Helper: get only enabled modules
export const getEnabledModules = (): AppModule[] =>
  config.modules.filter(m => m.enabled);

// Helper: find module by ID
export const getModuleById = (id: string): AppModule | undefined =>
  config.modules.find(m => m.id === id);

// Helper: find module by path
export const getModuleByPath = (path: string): AppModule | undefined =>
  config.modules.find(m => m.path === path);

export default config;
