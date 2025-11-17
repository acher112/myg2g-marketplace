export const CATEGORIES = [
  { 
    id: 'discord', 
    name: 'Discord Accounts', 
    icon: '💬', 
    color: 'from-indigo-500 to-purple-600',
    description: 'Aged Discord accounts with Nitro and custom usernames'
  },
  { 
    id: 'reddit', 
    name: 'Reddit Accounts', 
    icon: '🔴', 
    color: 'from-orange-500 to-red-600',
    description: 'High karma Reddit accounts for marketing'
  },
  { 
    id: 'steam', 
    name: 'Steam Accounts', 
    icon: '🎮', 
    color: 'from-blue-500 to-cyan-600',
    description: 'Steam accounts with games and items'
  },
  { 
    id: 'fortnite', 
    name: 'Fortnite Accounts', 
    icon: '⚡', 
    color: 'from-purple-500 to-pink-600',
    description: 'Fortnite accounts with rare skins and V-Bucks'
  },
  { 
    id: 'valorant', 
    name: 'Valorant Accounts', 
    icon: '🎯', 
    color: 'from-red-500 to-pink-600',
    description: 'Valorant accounts with ranks and skins'
  },
  { 
    id: 'pubg', 
    name: 'PUBG Accounts', 
    icon: '🔫', 
    color: 'from-yellow-500 to-orange-600',
    description: 'PUBG Mobile and PC accounts with UC and outfits'
  },
  { 
    id: 'gta', 
    name: 'GTA V Accounts', 
    icon: '🚗', 
    color: 'from-green-500 to-teal-600',
    description: 'GTA V accounts with money and unlocks'
  },
  { 
    id: 'apex', 
    name: 'Apex Legends', 
    icon: '🎪', 
    color: 'from-red-600 to-orange-600',
    description: 'Apex Legends accounts with heirlooms and skins'
  },
  { 
    id: 'cod', 
    name: 'Call of Duty', 
    icon: '💥', 
    color: 'from-gray-700 to-gray-900',
    description: 'COD accounts with unlocks and prestige'
  },
  { 
    id: 'epic', 
    name: 'Epic Games', 
    icon: '🎲', 
    color: 'from-slate-600 to-gray-700',
    description: 'Epic Games accounts with free games library'
  }
];

export const getCategoryById = (id) => {
  return CATEGORIES.find(cat => cat.id === id);
};