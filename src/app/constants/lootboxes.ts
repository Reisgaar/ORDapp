// Each lootbox data
export const lootboxData = [
  {
    id: '0',
    name: 'Mystery',
    image_url: 'assets/images/lootbox/t0.png',
    rewards: [
      { data: '78% 500 Random Materials', quantity: '78%', image: 'assets/images/lootbox/rewards/t1materials.png' },
      { data: '7.5% Tier 1 Armor Piece', quantity: '7.5%', image: 'assets/images/lootbox/rewards/armor1.png' },
      { data: '7.5% Tier 1 Common Weapon', quantity: '7.5%', image: 'assets/images/lootbox/rewards/weapon1.png' },
      { data: '5% Tier 1 Uncommon Weapon', quantity: '5%', image: 'assets/images/lootbox/rewards/weapon2.png' },
      { data: '2% Tier 2 Rare Weapon', quantity: '2%', image: 'assets/images/lootbox/rewards/weapon3.png' }
    ],
    text: 'lootbox.tierM'
  },
  {
    id: '1',
    name: 'Tier 1',
    image_url: 'assets/images/lootbox/t1.png',
    rewards: [
      { data: 'Tier 1 Common Weapon', quantity: '1', image: 'assets/images/lootbox/rewards/weapon1.png' },
      { data: 'Tier 1 Common Armor piece', quantity: '1', image: 'assets/images/lootbox/rewards/armor1.png' },
      { data: 'Between 1 and 100 exocredits', quantity: '1-100', image: 'assets/images/lootbox/rewards/exocredit.png' },
      { data: '1000 Tier 1 Basic Materials', quantity: '1000', image: 'assets/images/lootbox/rewards/t1materials.png' }
    ],
    text: 'lootbox.tier1'
  },
  {
    id: '2',
    name: 'Tier 2',
    image_url: 'assets/images/lootbox/t2.png',
    rewards: [
      { data: 'Tier 2 Common Weapon', quantity: '1', image: 'assets/images/lootbox/rewards/weapon2.png' },
      { data: '2 Tier 1 Uncommon Armor pieces', quantity: '2', image: 'assets/images/lootbox/rewards/armor2.png' },
      { data: 'Between 20 and 250 exocredits', quantity: '20-250', image: 'assets/images/lootbox/rewards/exocredit.png' },
      { data: '4000 Tier 1 Materials', quantity: '4000', image: 'assets/images/lootbox/rewards/t1materials.png' }
    ],
    text: 'lootbox.tier2'
  },
  {
    id: '3',
    name: 'Tier 3',
    image_url: 'assets/images/lootbox/t3.png',
    rewards: [
      { data: 'Tier 2 Uncommon Weapon', quantity: '1', image: 'assets/images/lootbox/rewards/weapon3.png' },
      { data: '3 Tier 2 Common Armor pieces', quantity: '3', image: 'assets/images/lootbox/rewards/armor3.png' },
      { data: 'Between 100 and 300 exocredits', quantity: '100-300', image: 'assets/images/lootbox/rewards/exocredit.png' },
      { data: '5000 Tier 2 Materials', quantity: '5000', image: 'assets/images/lootbox/rewards/t2materials.png' }
    ],
    text: 'lootbox.tier3'
  },
  {
    id: '4',
    name: 'Tier 4',
    image_url: 'assets/images/lootbox/t4.png',
    rewards: [
      { data: '1 Land Vehicle', quantity: '1', image: 'assets/images/lootbox/rewards/vehicle-land.png' },
      { data: 'Tier 2 Rare Weapon', quantity: '1', image: 'assets/images/lootbox/rewards/weapon4.png' },
      { data: '4 Tier 2 Common Armor pieces', quantity: '4', image: 'assets/images/lootbox/rewards/armor4.png' },
      { data: 'Between 150 and 400 exocredits', quantity: '150-400', image: 'assets/images/lootbox/rewards/exocredit.png' },
      { data: '8000 Tier 2 Materials', quantity: '8000', image: 'assets/images/lootbox/rewards/t2materials.png' }
    ],
    text: 'lootbox.tier4'
  },
  {
    id: '5',
    name: 'Tier 5',
    image_url: 'assets/images/lootbox/t5.png',
    rewards: [
      { data: '1 Space Vehicle', quantity: '1', image: 'assets/images/lootbox/rewards/vehicle-space.png' },
      { data: '1 Land Vehicle', quantity: '1', image: 'assets/images/lootbox/rewards/vehicle-land.png' },
      { data: 'Tier 2 Epic Weapon', quantity: '1', image: 'assets/images/lootbox/rewards/weapon5.png' },
      { data: '6 Tier 2 Common Armor pieces', quantity: '6', image: 'assets/images/lootbox/rewards/armor5.png' },
      { data: 'Between 200 and 500 exocredits', quantity: '200-500', image: 'assets/images/lootbox/rewards/exocredit.png' },
      { data: '10000 Tier 3 Materials', quantity: '10000', image: 'assets/images/lootbox/rewards/t3materials.png' }
    ],
    text: 'lootbox.tier5'
  },
  {
    id: '6',
    name: 'Clan',
    image_url: 'assets/images/lootbox/t6.png',
    rewards: [
      { data: '1 Clan Badge', quantity: '1', image: 'assets/images/lootbox/rewards/clanStone.png' },
      { data: '1 Clan Spaceship', quantity: '1', image: 'assets/images/lootbox/rewards/vehicle-clan.png' },
      { data: 'Tier 2 Complete Armor Set', quantity: '1', image: 'assets/images/lootbox/rewards/armor6.png' },
      { data: 'Tier 3 Legendary Weapon', quantity: '1', image: 'assets/images/lootbox/rewards/weapon6.png' },
      { data: 'Between 5.000 and 10.000 exocredits', quantity: '5000-10000', image: 'assets/images/lootbox/rewards/exocredit.png' }
    ],
    text: 'lootbox.tierC'
  },
];
