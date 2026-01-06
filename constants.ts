
import { GachaItem, Rarity, DropRate } from './types';

export const ITEMS: GachaItem[] = [
  {
    id: 'pass-card',
    name: 'BOOYAH PASS CARD',
    rarity: Rarity.LEGENDARY,
    type: 'Item',
    imageUrl: 'https://i.ibb.co/6P0S9pT/pass-card.png',
    description: 'Special pass card for exclusive rewards.',
    duration: 'Permanent',
    reclaimValue: { amount: 100, currency: 'cash' }
  },
  {
    id: 'bw-aug',
    name: 'AUG A3 Blonde Wave',
    rarity: Rarity.LEGENDARY,
    type: 'Weapon',
    imageUrl: 'https://picsum.photos/id/101/400/300',
    description: 'Exclusive legendary skin for the AUG A3.',
    duration: 'Permanent',
    reclaimValue: { amount: 250, currency: 'cash' }
  },
  {
    id: 'bw-kriss',
    name: 'Kriss S.V Blonde Wave',
    rarity: Rarity.LEGENDARY,
    type: 'Weapon',
    imageUrl: 'https://picsum.photos/id/102/400/300',
    description: 'Dual-wielded submachine guns.',
    duration: 'Permanent',
    reclaimValue: { amount: 250, currency: 'cash' }
  },
  {
    id: 'char-hide',
    name: 'Hide Blonde Wave',
    rarity: Rarity.EPIC,
    type: 'Character',
    imageUrl: 'https://picsum.photos/id/103/400/300',
    description: 'Special operative Hide.',
    duration: 'Permanent',
    reclaimValue: { amount: 50, currency: 'cash' }
  },
  {
    id: 'oa93-gold',
    name: 'OA-93 Gold',
    rarity: Rarity.EPIC,
    type: 'Weapon',
    imageUrl: 'https://picsum.photos/id/104/400/300',
    description: 'A golden variant OA-93.',
    duration: '7 Days',
    reclaimValue: { amount: 25, currency: 'cash' }
  },
  {
    id: 'token-x100',
    name: '100x Booyah Tokens',
    rarity: Rarity.RARE,
    type: 'Currency',
    imageUrl: 'https://picsum.photos/id/105/400/300',
    description: 'Stack of tokens.',
    reclaimValue: { amount: 1000, currency: 'points' }
  },
  {
    id: 'token-x20',
    name: '20x Booyah Tokens',
    rarity: Rarity.RARE,
    type: 'Currency',
    imageUrl: 'https://picsum.photos/id/106/400/300',
    description: 'Pack of tokens.',
    reclaimValue: { amount: 500, currency: 'points' }
  },
  {
    id: 'token-x10',
    name: '10x Booyah Tokens',
    rarity: Rarity.COMMON,
    type: 'Currency',
    imageUrl: 'https://picsum.photos/id/107/400/300',
    description: 'A few tokens.',
    reclaimValue: { amount: 200, currency: 'points' }
  },
  {
    id: 'token-x5',
    name: '5x Booyah Tokens',
    rarity: Rarity.COMMON,
    type: 'Currency',
    imageUrl: 'https://picsum.photos/id/108/400/300',
    description: 'Starter tokens.',
    reclaimValue: { amount: 100, currency: 'points' }
  }
];

export const DROP_RATES: DropRate[] = [
  { rarity: Rarity.LEGENDARY, chance: 0.05 },
  { rarity: Rarity.EPIC, chance: 0.15 },
  { rarity: Rarity.RARE, chance: 0.30 },
  { rarity: Rarity.COMMON, chance: 0.50 }
];

export const BOX_COST = 9;
