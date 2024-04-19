// Materials list, name and image file name
export const minerals = [
  { name: 'Acetylene', image: 'acetylene.png' },
  { name: 'Aluminium', image: 'aluminium.png' },
  { name: 'Argon', image: 'argon.png' },
  { name: 'Carbon', image: 'carbon.png' },
  { name: 'Chromium', image: 'chromium.png' },
  { name: 'Cobalt', image: 'cobalt.png' },
  { name: 'Copper', image: 'copper.png' },
  { name: 'Helium', image: 'helium.png' },
  { name: 'Hydrogen', image: 'hydrogen.png' },
  { name: 'Iron', image: 'iron.png' },
  { name: 'Methane', image: 'methane.png' },
  { name: 'Nickel', image: 'nickel.png' },
  { name: 'Oxygen', image: 'oxygen.png' },
  { name: 'Plutonium', image: 'plutonium.png' },
  { name: 'Silicon', image: 'silicon.png' },
  { name: 'Vanadium', image: 'vanadium.png' },
];

// Materials list, name and image file name
export const userOwnedMaterials = {
  acetylene: { name: 'Acetylene', image: 'acetylene.png', amount: '0' },
  aluminium: { name: 'Aluminium', image: 'aluminium.png', amount: '0' },
  argon: { name: 'Argon', image: 'argon.png', amount: '0' },
  carbon: { name: 'Carbon', image: 'carbon.png', amount: '0' },
  chromium: { name: 'Chromium', image: 'chromium.png', amount: '0' },
  cobalt: { name: 'Cobalt', image: 'cobalt.png', amount: '0' },
  copper: { name: 'Copper', image: 'copper.png', amount: '0' },
  helium: { name: 'Helium', image: 'helium.png', amount: '0' },
  hydrogen: { name: 'Hydrogen', image: 'hydrogen.png', amount: '0' },
  iron: { name: 'Iron', image: 'iron.png', amount: '0' },
  methane: { name: 'Methane', image: 'methane.png', amount: '0' },
  nickel: { name: 'Nickel', image: 'nickel.png', amount: '0' },
  oxygen: { name: 'Oxygen', image: 'oxygen.png', amount: '0' },
  plutonium: { name: 'Plutonium', image: 'plutonium.png', amount: '0' },
  silicon: { name: 'Silicon', image: 'silicon.png', amount: '0' },
  vanadium: { name: 'Vanadium', image: 'vanadium.png', amount: '0' },
};

export const rarityBoosterProbabilities = {
  t1: [
    { common: 99, uncommon: 0.99, rare: 0.01, epic: 0, legendary: 0 },
    { common: 0, uncommon: 90, rare: 10, epic: 0, legendary: 0 },
    { common: 0, uncommon: 70, rare: 30, epic: 0, legendary: 0 },
    { common: 0, uncommon: 0, rare: 100, epic: 0, legendary: 0 },
    { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0 }
  ],
  t2: [
    { common: 97, uncommon: 2, rare: 0.99, epic: 0.01, legendary: 0 },
    { common: 0, uncommon: 90, rare: 9.9, epic: 0.1, legendary: 0 },
    { common: 0, uncommon: 0, rare: 70, epic: 30, legendary: 0 },
    { common: 0, uncommon: 0, rare: 0, epic: 100, legendary: 0 },
    { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0 }
  ],
  t3:[
    { common: 97, uncommon: 2, rare: 0.9, epic: 0.099, legendary: 0.001 },
    { common: 0, uncommon: 90, rare: 9, epic: 0.99, legendary: 0.01 },
    { common: 0, uncommon: 0, rare: 90, epic: 9.9, legendary: 0.1 },
    { common: 0, uncommon: 0, rare: 0, epic: 70, legendary: 30 },
    { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 100 }
  ]
}

// All crafteable item list
export const crafteableItemList = ['blade', 'blunt', 'knife', 'pistol', 'revolver', 'shotgun', 'repeaterShotgun', 'assaultSMG', 'highRateSMG', 'assaultRifle', 'lightMachinegun', 'sniperRifle', 'precisionRifle', 'helmet', 'chest', 'shoulders', 'forearms', 'arms', 'gloves', 'legs', 'kneepads', 'boots'];

// Weapon list
export const weaponList = ['blade', 'blunt', 'knife', 'pistol', 'revolver', 'shotgun', 'repeaterShotgun', 'assaultSMG', 'highRateSMG', 'assaultRifle', 'lightMachinegun', 'sniperRifle', 'precisionRifle'];

// Armor list
export const armorList = ['helmet', 'chest', 'shoulders', 'forearms', 'arms', 'gloves', 'legs', 'kneepads', 'boots'];


// Enums to get names
export const armorEnum = ['helmet', 'chest', 'shoulders', 'forearms', 'arms', 'gloves', 'legs', 'kneepads', 'boots'];
export const weaponPartEnum = ["hilt", "crossGuard", "blade", "head", "grip", "barrel", "body", "magazine", "reflexSight", "holographicSight", "laserPointer", "silencer", "stock", "x4Sight", "bayonetta", "striker", "bipod", "grenadeLauncher", "attachedShotgun", "sniperSight", "barrelBrake"];
export const weaponEnum = ["knife", "blade", "blunt", "pistol", "revolver", "shotgun", "repeaterShotgun", "assaultSMG", "highRateSMG", "lightMachinegun", "assaultRifle", "sniperRifle", "precisionRifle"];
export const elementEnum = ["B","L","M","P"];

// Order of the parts for each weapon to mount the the image
export const weaponPartsOrder = {
  knife: ['hilt', 'blade', 'crossGuard'],
  blade: ['hilt', 'blade', 'crossGuard'],
  blunt: ['hilt', 'head'],
  pistol: ['magazine', 'grip', 'x4Sight', 'holographicSight', 'reflexSight', 'laserPointer', 'body', 'barrel', 'silencer'],
  revolver: ['body', 'magazine', 'laserPointer', 'barrel', 'grip'],
  shotgun: ['grip', 'stock', 'body', 'barrel', 'holographicSight', 'reflexSight'],
  repeaterShotgun: ['grip', 'magazine', 'stock', 'body', 'barrel', 'holographicSight', 'reflexSight'],
  assaultSMG: ['stock', 'grip', 'magazine', 'body', 'barrel', 'bayonetta', 'silencer', 'laserPointer', 'x4Sight', 'holographicSight', 'reflexSight'],
  highRateSMG: ['magazine', 'grip', 'barrel', 'laserPointer', 'stock', 'body', 'silencer'],
  lightMachinegun: ['striker', 'stock', 'bipod', 'barrel', 'body', 'x4Sight', 'holographicSight', 'reflexSight', 'grip', 'magazine'],
  assaultRifle: ['stock', 'grip', 'magazine', 'body', 'barrel', 'x4Sight', 'holographicSight', 'reflexSight', 'silencer', 'laserPointer', 'grenadeLauncher', 'attachedShotgun', 'bayonetta'],
  sniperRifle: ['grip', 'magazine', 'stock', 'body', 'barrel', 'sniperSight', 'bipod', 'laserPointer', 'barrelBrake', 'silencer'],
  precisionRifle: ['stock', 'grip', 'magazine', 'body', 'bipod', 'barrel', 'sniperSight', 'silencer', 'laserPointer']
};

// Order of parts to send to styling Smart Contract
export const stylingPartsOrder = {
  knife: [ 'hilt', 'crossGuard', 'blade' ],
  blade: [ 'hilt', 'crossGuard', 'blade' ],
  blunt: [ 'hilt', 'head' ],
  pistol: [ 'grip', 'barrel', 'body', 'magazine', 'reflexSight', 'holographicSight', 'x4Sight', 'laserPointer', 'silencer' ],
  revolver: [ 'grip', 'barrel', 'body', 'magazine', 'laserPointer' ],
  shotgun: [ 'grip', 'stock', 'barrel', 'body', 'reflexSight', 'holographicSight' ],
  repeaterShotgun: [ 'grip', 'stock', 'barrel', 'body', 'magazine', 'reflexSight', 'holographicSight' ],
  assaultSMG: [ 'grip', 'stock', 'barrel', 'body', 'magazine', 'reflexSight', 'holographicSight', 'x4Sight', 'laserPointer', 'bayonetta', 'silencer' ],
  highRateSMG: [ 'grip', 'stock', 'barrel', 'body', 'magazine', 'laserPointer', 'silencer' ],
  lightMachinegun: [ 'grip', 'stock', 'barrel', 'striker', 'body', 'magazine', 'reflexSight', 'holographicSight', 'x4Sight', 'bipod' ],
  assaultRifle: [ 'grip', 'stock', 'barrel', 'body', 'magazine', 'reflexSight', 'holographicSight', 'x4Sight', 'laserPointer', 'bayonetta', 'grenadeLauncher', 'attachedShotgun', 'silencer' ],
  sniperRifle: [ 'grip', 'stock', 'barrel', 'body', 'magazine', 'sniperSight', 'laserPointer', 'bipod', 'silencer', 'barrelBrake' ],
  precisionRifle: [ 'grip', 'stock', 'barrel', 'body', 'magazine', 'sniperSight', 'laserPointer', 'bipod', 'silencer' ],
};

// Material cost for each weapon/tier
export const collectionZeroMaterialReward = {
  t1: { step1: { iron: 700, copper: 700 }, step2: { nickel: 700, carbon: 700 }, step3: { vanadium: 700 } },
  t2: { step1: { iron: 750, copper: 750 }, step2: { hydrogen: 750 }, step3: { methane: 750, helium: 750 } },
  t3: { step1: { iron: 1000, copper: 1000 }, step2: { oxygen: 1000, chromium: 1000 }, step3: { plutonium: 1000, acetylene: 1000, cobalt: 1000 } }
};


// Material cost for each weapon/tier
export const craftingMaterialCost = {
  knife: {
    t1: { step1: { iron: 1000, copper: 1000 }, step2: { nickel: 1000, carbon: 500 }, step3: { vanadium: 1000 } },
    t2: { step1: { iron: 3000, copper: 3000 }, step2: { hydrogen: 2500, methane: 1000 }, step3: { helium: 3000 } },
    t3: { step1: { iron: 10000, copper: 10000 }, step2: { oxygen: 3000, silicon: 2000 }, step3: { plutonium: 1500, argon: 1000 } }
  },
  blade: {
    t1: { step1: { iron: 1000, copper: 1000 }, step2: { nickel: 1000, carbon: 2000 }, step3: { vanadium: 1000 } },
    t2: { step1: { iron: 2000, copper: 1000 }, step2: { hydrogen: 2500, methane: 1000 }, step3: { helium: 3000 } },
    t3: { step1: { iron: 10000, copper: 10000 }, step2: { oxygen: 3000, chromium: 2000 }, step3: { acetylene: 2000, aluminium: 1500 } }
  },
  blunt: {
    t1: { step1: { iron: 1000, copper: 1000 }, step2: { nickel: 1000 }, step3: { vanadium: 1000 } },
    t2: { step1: { iron: 3000, copper: 3000 }, step2: { carbon: 1000, hydrogen: 2500 }, step3: { methane: 1000, helium: 3000 } },
    t3: { step1: { iron: 10000, copper: 10000 }, step2: { oxygen: 3000, chromium: 2000 }, step3: { plutonium: 1000, acetylene: 2000, cobalt: 1500 } }
  },
  pistol: {
    t1: { step1: { iron: 1000, copper: 1000 }, step2: { nickel: 1000, carbon: 2000 }, step3: { vanadium: 1000 } },
    t2: { step1: { iron: 3000, copper: 3000 }, step2: { hydrogen: 2500, methane: 1000 }, step3: { helium: 3000 } },
    t3: { step1: { iron: 10000, copper: 10000 }, step2: { oxygen: 3000, chromium: 2000 }, step3: { acetylene: 2000, aluminium: 1500 } }
  },
  revolver: {
    t1: { step1: { iron: 1000, copper: 1000 }, step2: { nickel: 1000, carbon: 500 }, step3: { vanadium: 1000 } },
    t2: { step1: { iron: 3000, copper: 3000 }, step2: { hydrogen: 2500, methane: 1000 }, step3: { helium: 3000 } },
    t3: { step1: { iron: 10000, copper: 10000 }, step2: { oxygen: 3000, silicon: 2000 }, step3: { plutonium: 1500, argon: 1000 } }
  },
  shotgun: {
    t1: { step1: { iron: 1000, copper: 1000 }, step2: { nickel: 1000 }, step3: { vanadium: 1000 } },
    t2: { step1: { iron: 3000, copper: 3000 }, step2: { carbon: 1000, hydrogen: 2500 }, step3: { methane: 1000, helium: 3000 } },
    t3: { step1: { iron: 10000, copper: 10000 }, step2: { oxygen: 3000, chromium: 2000 }, step3: { plutonium: 1000, acetylene: 2000, cobalt: 1500 } }
  },
  repeaterShotgun: {
    t1: { step1: { iron: 1000, copper: 1000 }, step2: { nickel: 1000, carbon: 2000 }, step3: { vanadium: 1000 } },
    t2: { step1: { iron: 3000, copper: 3000 }, step2: { hydrogen: 2500, methane: 1000 }, step3: { helium: 3000 } },
    t3: { step1: { iron: 10000, copper: 10000 }, step2: { oxygen: 3000, chromium: 2000 }, step3: { acetylene: 2000, aluminium: 1500 } }
  },
  assaultSMG: {
    t1: { step1: { iron: 1000, copper: 1000 }, step2: { nickel: 1000, carbon: 500 }, step3: { vanadium: 1000 } },
    t2: { step1: { iron: 3000, copper: 3000 }, step2: { hydrogen: 2500, methane: 1000 }, step3: { helium: 3000 } },
    t3: { step1: { iron: 10000, copper: 10000 }, step2: { oxygen: 3000, silicon: 2000 }, step3: { plutonium: 1500, argon: 1000 } }
  },
  highRateSMG: {
    t1: { step1: { iron: 1000, copper: 1000 }, step2: { nickel: 1000 }, step3: { vanadium: 1000 } },
    t2: { step1: { iron: 3000, copper: 3000 }, step2: { carbon: 1000, hydrogen: 2500 }, step3: { methane: 1000, helium: 3000 } },
    t3: { step1: { iron: 10000, copper: 10000 }, step2: { oxygen: 3000, chromium: 2000 }, step3: { plutonium: 1000, acetylene: 2000, cobalt: 1500 } }
  },
  lightMachinegun: {
    t1: { step1: { iron: 1000, copper: 1000 }, step2: { nickel: 1000, carbon: 2000 }, step3: { vanadium: 1000 } },
    t2: { step1: { iron: 3000, copper: 3000 }, step2: { hydrogen: 2500, methane: 1000 }, step3: { helium: 3000 } },
    t3: { step1: { iron: 10000, copper: 10000 }, step2: { oxygen: 3000, chromium: 2000 }, step3: { acetylene: 2000, aluminium: 1500 } }
  },
  assaultRifle: {
    t1: { step1: { iron: 1000, copper: 1000 }, step2: { nickel: 1000, carbon: 500 }, step3: { vanadium: 1000 } },
    t2: { step1: { iron: 3000, copper: 3000 }, step2: { hydrogen: 2500, methane: 1000 }, step3: { helium: 3000 } },
    t3: { step1: { iron: 10000, copper: 10000 }, step2: { oxygen: 3000, silicon: 2000 }, step3: { plutonium: 1500, argon: 1000 } }
  },
  sniperRifle: {
    t1: { step1: { iron: 1000, copper: 1000 }, step2: { nickel: 1000 }, step3: { vanadium: 1000 } },
    t2: { step1: { iron: 3000, copper: 3000 }, step2: { carbon: 1000, hydrogen: 2500 }, step3: { methane: 1000, helium: 3000 } },
    t3: { step1: { iron: 10000, copper: 10000 }, step2: { oxygen: 3000, chromium: 2000 }, step3: { plutonium: 1000, acetylene: 2000, cobalt: 1500 } }
  },
  precisionRifle: {
    t1: { step1: { iron: 1000, copper: 1000 }, step2: { nickel: 1000, carbon: 2000 }, step3: { vanadium: 1000 } },
    t2: { step1: { iron: 3000, copper: 3000 }, step2: { hydrogen: 2500, methane: 1000 }, step3: { helium: 3000 } },
    t3: { step1: { iron: 10000, copper: 10000 }, step2: { oxygen: 3000, chromium: 2000 }, step3: { acetylene: 2000, aluminium: 1500 } }
  },
  helmet: {
    t1: { step1: { iron: 800, copper: 800 }, step2: { nickel: 800 }, step3: { vanadium: 800 } },
    t2: { step1: { iron: 2400, copper: 2400 }, step2: { carbon: 800, hydrogen: 2000 }, step3: { methane: 800, helium: 2400 } },
    t3: { step1: { iron: 8000, copper: 8000 }, step2: { oxygen: 2400, chromium: 1600 }, step3: { plutonium: 800, acetylene: 1600, cobalt: 1200 } }
  },
  chest: {
    t1: { step1: { iron: 800, copper: 800 }, step2: { nickel: 800 }, step3: { vanadium: 800 } },
    t2: { step1: { iron: 2400, copper: 2400 }, step2: { carbon: 800, hydrogen: 2000 }, step3: { methane: 800, helium: 2400 } },
    t3: { step1: { iron: 8000, copper: 8000 }, step2: { oxygen: 2400, chromium: 1600 }, step3: { plutonium: 800, acetylene: 1600, cobalt: 1200 } }
  },
  shoulders: {
    t1: { step1: { iron: 800, copper: 800 }, step2: { nickel: 800, carbon: 1600 }, step3: { vanadium: 800 } },
    t2: { step1: { iron: 1600, copper: 800 }, step2: { hydrogen: 2000, methane: 800 }, step3: { helium: 2400 } },
    t3: { step1: { iron: 8000, copper: 8000 }, step2: { oxygen: 2400, chromium: 1600 }, step3: { acetylene: 1600, aluminium: 1200 } }
  },
  forearms: {
    t1: { step1: { iron: 800, copper: 800 }, step2: { nickel: 800, carbon: 400 }, step3: { vanadium: 800 } },
    t2: { step1: { iron: 2400, copper: 2400 }, step2: { hydrogen: 2000, methane: 800 }, step3: { helium: 2400 } },
    t3: { step1: { iron: 8000, copper: 8000 }, step2: { oxygen: 2400, silicon: 1600 }, step3: { plutonium: 1200, argon: 800 } }
  },
  arms: {
    t1: { step1: { iron: 800, copper: 800 }, step2: { nickel: 800, carbon: 1600 }, step3: { vanadium: 800 } },
    t2: { step1: { iron: 1600, copper: 800 }, step2: { hydrogen: 2000, methane: 800 }, step3: { helium: 2400 } },
    t3: { step1: { iron: 8000, copper: 8000 }, step2: { oxygen: 2400, chromium: 1600 }, step3: { acetylene: 1600, aluminium: 1200 } }
  },
  gloves: {
    t1: { step1: { iron: 800, copper: 800 }, step2: { nickel: 800, carbon: 400 }, step3: { vanadium: 800 } },
    t2: { step1: { iron: 2400, copper: 2400 }, step2: { hydrogen: 2000, methane: 800 }, step3: { helium: 2400 } },
    t3: { step1: { iron: 8000, copper: 8000 }, step2: { oxygen: 2400, silicon: 1600 }, step3: { plutonium: 1200, argon: 800 } }
  },
  legs: {
    t1: { step1: { iron: 800, copper: 800 }, step2: { nickel: 800, carbon: 1600 }, step3: { vanadium: 800 } },
    t2: { step1: { iron: 1600, copper: 800 }, step2: { hydrogen: 2000, methane: 800 }, step3: { helium: 2400 } },
    t3: { step1: { iron: 8000, copper: 8000 }, step2: { oxygen: 2400, chromium: 1600 }, step3: { acetylene: 1600, aluminium: 1200 } }
  },
  kneepads: {
    t1: { step1: { iron: 800, copper: 800 }, step2: { nickel: 800, carbon: 400 }, step3: { vanadium: 800 } },
    t2: { step1: { iron: 2400, copper: 2400 }, step2: { hydrogen: 2000, methane: 800 }, step3: { helium: 2400 } },
    t3: { step1: { iron: 8000, copper: 8000 }, step2: { oxygen: 2400, silicon: 1600 }, step3: { plutonium: 1200, argon: 800 } }
  },
  boots: {
    t1: { step1: { iron: 800, copper: 800 }, step2: { nickel: 800 }, step3: { vanadium: 800 } },
    t2: { step1: { iron: 2400, copper: 2400 }, step2: { carbon: 800, hydrogen: 2000 }, step3: { methane: 800, helium: 2400 } },
    t3: { step1: { iron: 8000, copper: 8000 }, step2: { oxygen: 2400, chromium: 1600 }, step3: { plutonium: 800, acetylene: 1600, cobalt: 1200 } }
  }
};

export const weaponPartsInfo = [
  {
    knife: {
      blade: ['M01','M02','M03','M04','M05'],
      crossGuard: ['P01','P02','P03','P04','P05','P06','P07','P08','P09','P10'],
      hilt: ['M01','M02','M03','M04','M05'],
      accessories: {  },
      sights: {  },
      underBarrel: {  }
    },
    blade: {
      blade: ['M01','M02','M03','M04','M05'],
      crossGuard: ['P01','P02','P03','P04','P05','P06','P07','P08','P09','P10'],
      hilt: ['M01','M02','M03','M04','M05'],
      accessories: {  },
      sights: {  },
      underBarrel: {  }
    },
    blunt: {
      head: ['M01','M02','M03','M04','M05'],
      hilt: ['M01','M02','M03','M04','M05'],
      accessories: {  },
      sights: {  },
      underBarrel: {  }
    },
    pistol: {
      barrel: ['B01','B02','B03','B04','B05'],
      body: ['B01','B02','B03','B04','B05'],
      grip: ['B01','B02','B03','B04','B05'],
      magazine: ['B01','B02','B03','B04','B05'],
      accessories: {
        silencer: ['B01','B02','B03','B04','B05'],
      },
      sights: {
        holographicSight: ['B01','B02','B03'],
        reflexSight: ['B01','B02','B03'],
        x4Sight: ['B01','B02','B03'],
      },
      underBarrel: {
        laserPointer: ['P01','P02','P03'],
      }
    },
    revolver: {
      barrel: ['B01','B02','B03','B04','B05'],
      body: ['B01','B02','B03','B04','B05'],
      grip: ['B01','B02','B03','B04','B05'],
      magazine: ['B01','B02','B03','B04','B05'],
      accessories: {
        laserPointer: ['P01','P02','P03'],
      },
      sights: {  },
      underBarrel: {  }
    },
    shotgun: {
      barrel: ['B01','B02','B03','B04','B05','B06','B07','B08','B09','B10'],
      body: ['B01','B02','B03','B04','B05','B06','B07','B08','B09','B10'],
      grip: ['B01','B02','B03','B04','B05','B06','B07','B08','B09','B10'],
      stock: ['B01','B02','B03','B04','B05','B06','B07','B08','B09','B10'],
      accessories: {  },
      sights: {
        holographicSight: ['B01','B02','B03'],
        reflexSight: ['B01','B02','B03'],
      },
      underBarrel: {  }
    },
    repeaterShotgun: {
      barrel: ['B01','B02','B03','B04','B05','B06','B07','B08','B09','B10'],
      body: ['B01','B02','B03','B04','B05','B06','B07','B08','B09','B10'],
      grip: ['B01','B02','B03','B04','B05','B06','B07','B08','B09','B10'],
      magazine: ['B01','B02','B03','B04','B05','B06','B07','B08','B09','B10'],
      stock: ['B01','B02','B03','B04','B05','B06','B07','B08','B09','B10'],
      accessories: {  },
      sights: {
        holographicSight: ['B01','B02','B03'],
        reflexSight: ['B01','B02','B03'],
      },
      underBarrel: {  }
    },
    assaultSMG: {
      barrel: ['B01','B02','B03','B04','B05'],
      body: ['B01','B02','B03','B04','B05'],
      grip: ['B01','B02','B03','B04','B05'],
      magazine: ['B01','B02','B03','B04','B05'],
      stock: ['B01','B02','B03','B04','B05'],
      accessories: {
        silencer: ['B01','B02','B03','B04','B05'],
      },
      sights: {
        holographicSight: ['B01','B02','B03'],
        reflexSight: ['B01','B02','B03'],
        x4Sight: ['B01','B02','B03'],
      },
      underBarrel: {
        bayonetta: ['B01','B02','B03','B04','B05'],
        laserPointer: ['B01','B02','B03'],
      }
    },
    highRateSMG: {
      barrel: ['B01','B02','B03','B04','B05'],
      body: ['B01','B02','B03','B04','B05'],
      grip: ['B01','B02','B03','B04','B05'],
      magazine: ['B01','B02','B03','B04','B05'],
      stock: ['B01','B02','B03','B04','B05'],
      accessories: {
        silencer: ['B01','B02','B03','B04','B05'],
      },
      sights: {  },
      underBarrel: {
        laserPointer: ['B01','B02','B03'],
      }
    },
    lightMachinegun: {
      striker: ['P01'],
      stock: ['B01','B02','B03','B04','B05'],
      barrel: ['B01','B02','B03','B04','B05'],
      body: ['B01','B02','B03','B04','B05'],
      grip: ['B01','B02','B03','B04','B05'],
      magazine: ['B01','B02','B03','B04','B05'],
      accessories: {  },
      sights: {
        holographicSight: ['B01','B02','B03'],
        reflexSight: ['B01','B02','B03'],
        x4Sight: ['B01','B02','B03'],
      },
      underBarrel: {
        bipod: ['P01','P02','P03'],
      }
    },
    assaultRifle: {
      barrel: ['B01','B02','B03','B04','B05'],
      body: ['B01','B02','B03','B04','B05'],
      grip: ['B01','B02','B03','B04','B05'],
      magazine: ['B01','B02','B03','B04','B05'],
      stock: ['B01','B02','B03','B04','B05'],
      accessories: {
        silencer: ['B01','B02','B03','B04','B05'],
      },
      sights: {
        holographicSight: ['B01','B02','B03'],
        reflexSight: ['B01','B02','B03'],
        x4Sight: ['B01','B02','B03'],
      },
      underBarrel: {
        attachedShotgun: ['B01','B02','B03'],
        bayonetta: ['B01','B02','B03','B04','B05'],
        grenadeLauncher: ['B01','B02','B03'],
        laserPointer: ['B01','B02','B03'],
      }
    },
    sniperRifle: {
      barrel: ['B01','B02','B03','B04','B05'],
      body: ['B01','B02','B03','B04','B05'],
      grip: ['B01','B02','B03','B04','B05'],
      magazine: ['B01','B02','B03','B04','B05'],
      stock: ['B01','B02','B03','B04','B05'],
      accessories: {
        barrelBrake: ['B01','B02','B03','B04','B05'],
        silencer: ['B01','B02','B03','B04','B05'],
      },
      sights: {
        sniperSight: ['B01','B02','B03','B04','B05'],
      },
      underBarrel: {
        bipod: ['B01','B02','B03'],
        laserPointer: ['B01','B02','B03'],
      }
    },
    precisionRifle: {
      barrel: ['B01','B02','B03','B04','B05'],
      body: ['B01','B02','B03','B04','B05'],
      grip: ['B01','B02','B03','B04','B05'],
      magazine: ['B01','B02','B03','B04','B05'],
      stock: ['B01','B02','B03','B04','B05'],
      accessories: {
        silencer: ['B01','B02','B03','B04','B05'],
      },
      sights: {
        sniperSight: ['B01','B02','B03','B04','B05'],
      },
      underBarrel: {
        bipod: ['B01','B02','B03'],
        laserPointer: ['B01','B02','B03'],
      }
    }
  },


  {
    knife: {
      blade: ['L01','L02','L03','L04','L05'],
      crossGuard: ['P01','P02','P03','P04','P05','P06','P07','P08','P09','P10'],
      hilt: ['L01','L02','L03','L04','L05'],
      accessories: {  },
      sights: {  },
      underBarrel: {  }
    },
    blade: {
      blade: ['L01','L02','L03','L04','L05'],
      crossGuard: ['P01','P02','P03','P04','P05','P06','P07','P08','P09','P10'],
      hilt: ['L01','L02','L03','L04','L05'],
      accessories: {  },
      sights: {  },
      underBarrel: {  }
    },
    blunt: {
      head: ['L01','L02','L03','L04','L05'],
      hilt: ['L01','L02','L03','L04','L05'],
      accessories: {  },
      sights: {  },
      underBarrel: {  }
    },
    pistol: {
      barrel: ['L01','L02','L03','L04','L05'],
      body: ['L01','L02','L03','L04','L05'],
      grip: ['L01','L02','L03','L04','L05'],
      magazine: ['L01','L02','L03','L04','L05'],
      accessories: {
        silencer: ['L01','L02','L03','L04','L05'],
      },
      sights: {
        holographicSight: ['L01','L02'],
        reflexSight: ['L01','L02'],
        x4Sight: ['L01','L02'],
      },
      underBarrel: {
        laserPointer: ['P01','P02','P03'],
      }
    },
    revolver: {
      barrel: ['L01','L02','L03','L04','L05'],
      body: ['L01','L02','L03','L04','L05'],
      grip: ['L01','L02','L03','L04','L05'],
      magazine: ['L01','L02','L03','L04','L05'],
      accessories: {
        laserPointer: ['P01','P02','P03'],
      },
      sights: {  },
      underBarrel: {  }
    },
    assaultSMG: {
      barrel: ['L01','L02','L03','L04','L05'],
      body: ['L01','L02','L03','L04','L05'],
      grip: ['L01','L02','L03','L04','L05'],
      magazine: ['L01','L02','L03','L04','L05'],
      stock: ['L01','L02','L03','L04','L05'],
      accessories: {
        silencer: ['L01','L02','L03','L04','L05'],
      },
      sights: {
        holographicSight: ['L01','L02'],
        reflexSight: ['L01','L02'],
        x4Sight: ['L01','L02'],
      },
      underBarrel: {
        bayonetta: ['L01','L02','L03','L04','L05'],
        laserPointer: ['L01','L02','L03'],
      }
    },
    highRateSMG: {
      barrel: ['L01','L02','L03','L04','L05'],
      body: ['L01','L02','L03','L04','L05'],
      grip: ['L01','L02','L03','L04','L05'],
      magazine: ['L01','L02','L03','L04','L05'],
      stock: ['L01','L02','L03','L04','L05'],
      accessories: {
        silencer: ['L01','L02','L03','L04','L05'],
      },
      sights: {  },
      underBarrel: {
        laserPointer: ['L01','L02','L03'],
      }
    },
    lightMachinegun: {
      striker: ['P01'],
      stock: ['L01','L02','L03','L04','L05'],
      barrel: ['L01','L02','L03','L04','L05'],
      body: ['L01','L02','L03','L04','L05'],
      grip: ['L01','L02','L03','L04','L05'],
      magazine: ['L01','L02','L03','L04','L05'],
      accessories: {  },
      sights: {
        holographicSight: ['L01','L02'],
        reflexSight: ['L01','L02'],
        x4Sight: ['L01','L02'],
      },
      underBarrel: {
        bipod: ['P01','P02','P03'],
      }
    },
    assaultRifle: {
      barrel: ['L01','L02','L03','L04','L05'],
      body: ['L01','L02','L03','L04','L05'],
      grip: ['L01','L02','L03','L04','L05'],
      magazine: ['L01','L02','L03','L04','L05'],
      stock: ['L01','L02','L03','L04','L05'],
      accessories: {
        silencer: ['L01','L02','L03','L04','L05'],
      },
      sights: {
        holographicSight: ['L01','L02'],
        reflexSight: ['L01','L02'],
        x4Sight: ['L01','L02'],
      },
      underBarrel: {
        attachedShotgun: ['L01','L02','L03'],
        bayonetta: ['L01','L02','L03','L04','L05'],
        grenadeLauncher: ['L01','L02','L03'],
        laserPointer: ['L01','L02','L03'],
      }
    },
    sniperRifle: {
      barrel: ['L01','L02','L03','L04','L05'],
      body: ['L01','L02','L03','L04','L05'],
      grip: ['L01','L02','L03','L04','L05'],
      magazine: ['L01','L02','L03','L04','L05'],
      stock: ['L01','L02','L03','L04','L05'],
      accessories: {
        barrelBrake: ['L01','L02','L03','L04','L05'],
        silencer: ['L01','L02','L03','L04','L05'],
      },
      sights: {
        sniperSight: ['L01','L02','L03','L04','L05'],
      },
      underBarrel: {
        bipod: ['L01','L02','L03'],
        laserPointer: ['L01','L02','L03'],
      }
    },
    precisionRifle: {
      barrel: ['L01','L02','L03','L04','L05'],
      body: ['L01','L02','L03','L04','L05'],
      grip: ['L01','L02','L03','L04','L05'],
      magazine: ['L01','L02','L03','L04','L05'],
      stock: ['L01','L02','L03','L04','L05'],
      accessories: {
        silencer: ['L01','L02','L03','L04','L05'],
      },
      sights: {
        sniperSight: ['L01','L02','L03','L04','L05'],
      },
      underBarrel: {
        bipod: ['L01','L02','L03'],
        laserPointer: ['L01','L02','L03'],
      }
    }
  }
];
