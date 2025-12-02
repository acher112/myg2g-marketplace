export const CATEGORIES = [
  { 
    id: 'discord', 
    name: 'Discord Accounts', 
    icon: '💬',
    image: '/images/categories/discord.png',
    color: 'from-indigo-500 to-purple-600',
    description: 'Aged Discord accounts with Nitro and custom usernames'
  },
  { 
    id: 'reddit', 
    name: 'Reddit Accounts', 
    icon: '🔴',
    image: '/images/categories/reddit.png',
    color: 'from-orange-500 to-red-600',
    description: 'High karma Reddit accounts for marketing'
  },
  { 
    id: 'steam', 
    name: 'Steam Accounts', 
    icon: '🎮',
    image: '/images/categories/steam.png',
    color: 'from-blue-500 to-cyan-600',
    description: 'Steam accounts with games and items'
  },
  { 
    id: 'fortnite', 
    name: 'Fortnite Accounts', 
    icon: '⚡',
    image: '/images/categories/fortnite.png',
    color: 'from-purple-500 to-pink-600',
    description: 'Fortnite accounts with rare skins and V-Bucks'
  },
  { 
    id: 'valorant', 
    name: 'Valorant Accounts', 
    icon: '🎯',
    image: '/images/categories/valorant.png',
    color: 'from-red-500 to-pink-600',
    description: 'Valorant accounts with ranks and skins'
  },
  { 
    id: 'pubg', 
    name: 'PUBG Accounts', 
    icon: '🔫',
    image: '/images/categories/pubg.png',
    color: 'from-yellow-500 to-orange-600',
    description: 'PUBG Mobile and PC accounts with UC and outfits'
  },
  { 
    id: 'gta', 
    name: 'GTA V Accounts', 
    icon: '🚗',
    image: '/images/categories/gta.png',
    color: 'from-green-500 to-teal-600',
    description: 'GTA V accounts with money and unlocks'
  },
  { 
    id: 'apex', 
    name: 'Apex Legends', 
    icon: '🎪',
    image: '/images/categories/apex.png',
    color: 'from-red-600 to-orange-600',
    description: 'Apex Legends accounts with heirlooms and skins'
  },
  { 
    id: 'cod', 
    name: 'Call of Duty', 
    icon: '💥',
    image: '/images/categories/cod.png',
    color: 'from-gray-700 to-gray-900',
    description: 'COD accounts with unlocks and prestige'
  },
  { 
    id: 'epic', 
    name: 'Epic Games', 
    icon: '🎲',
    image: '/images/categories/epic.png',
    color: 'from-slate-600 to-gray-700',
    description: 'Epic Games accounts with free games library'
  }
];

export const getCategoryById = (id) => {
  return CATEGORIES.find(cat => cat.id === id);
};