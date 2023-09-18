/*
 * Filters only for OR Marketplace
 */

export const AllFilter = {
  tier : ['Tier1', 'Tier2', 'Tier3', 'Tier4', 'Tier5'],
  rarity: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'],
  collection: ['Early Explorers', 'Great Silver City Lands', 'GoldStar Holdtel Collection'],
  armor: ['Helmet', 'Chest', 'Shoulders', 'Arms', 'Forearms', 'Gloves', 'Legs', 'Kneepads', 'Boots'],
  weapon: ['Assault Rifle', 'Assault SMG', 'Blade', 'Blunt', 'High Rate SMG', 'Knife', 'Light Machinegun', 'Pistol', 'Precision Rifle', 'Repeater Shotgun', 'Revolver', 'Shotgun', 'Sniper Rifle'],
  vehicle: ['Land Vehicle', 'Space Vehicle'],
  currency: ['Exocredit'],
  land: ['Nano', 'Micro', 'Standard', 'Macro', 'Mega'],
  key: ['Junior', 'Standard', 'Executive', 'Deluxe', 'Royal']
};

export const OrWeaponFilter = {
  type: ['Assault Rifle', 'Assault SMG', 'Blade', 'Blunt', 'High Rate SMG', 'Knife', 'Light Machinegun', 'Pistol', 'Precision Rifle', 'Repeater Shotgun', 'Revolver', 'Shotgun', 'Sniper Rifle'],
  tier : ['Tier1', 'Tier2', 'Tier3', 'Tier4', 'Tier5'],
  rarity: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'],
  collection: ['Early Explorers']
};

export const OrArmorFilter = {
  type: ['Helmet', 'Chest', 'Shoulders', 'Arms', 'Forearms', 'Gloves', 'Legs', 'Kneepads', 'Boots'],
  tier : ['Tier1', 'Tier2', 'Tier3', 'Tier4', 'Tier5'],
  rarity: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'],
  collection: ['Early Explorers']
};

export const OrVehicleFilter = {
  type: ['Land Vehicle', 'Space Vehicle'],
  collection: ['Early Explorers']
};

export const OrCosmeticFilter = {
  type: ['Filter 1', 'Filter 2', 'Filter 3', 'Filter 4'],
  collection: ['Early Explorers']
};

export const OrClanFilter = {
  collection: ['Early Explorers']
};

export const OrExoFilter = {
  collection: ['Early Explorers']
};

export const OrLandFilter = {
  collection: ['Great Silver City Lands'],
  sector: ['Alpha', 'Beta', 'Gamma', 'Delta'],
  size: ['Nano', 'Micro', 'Standard', 'Macro', 'Mega']
};

export const OrKeyFilter = {
  collection: ['GoldStar Holdtel Collection'],
  size: ['Junior', 'Standard', 'Executive', 'Deluxe', 'Royal']
};
