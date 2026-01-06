
export enum Rarity {
  COMMON = 'COMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY'
}

export interface GachaItem {
  id: string;
  name: string;
  rarity: Rarity;
  type: 'Weapon' | 'Character' | 'Item' | 'Currency';
  imageUrl: string;
  description: string;
  duration?: string;
  isClaimed?: boolean;
  reclaimValue?: {
    amount: number;
    currency: 'points' | 'cash';
  };
}

export interface DropRate {
  rarity: Rarity;
  chance: number;
}

export interface UserStats {
  points: number;
  cash: number;
  totalOpened: number;
  pityCount: number;
}
