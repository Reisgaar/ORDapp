import { Ipool } from '../interfaces/ipool';
import { contractAddresses } from './contractAddresses';

export const dexDataConstantsTotalPools: Ipool[] = [
  {
    type: 'iron',
    address: contractAddresses.LPIRONMET, // OJO
    stakedTokenImg: 'assets/images/materials/iron.png',
    subsidiaryTokenImg1: 'assets/images/materials/metano.png',
    subsidiaryTokenImg2: 'assets/images/materials/iron.png',
    rewardTokenImg: 'assets/images/materials/iron.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMIRON,
    subsidiaryTokenSymbol1: 'MET',
    subsidiaryTokenSymbol2: 'IRON'
  },
  {
    type: 'iron',
    address: contractAddresses.LPIRONPLU, // OJO
    stakedTokenImg: 'assets/images/materials/iron.png',
    subsidiaryTokenImg1: 'assets/images/materials/plutonio.png',
    subsidiaryTokenImg2: 'assets/images/materials/iron.png',
    rewardTokenImg: 'assets/images/materials/iron.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMIRON,
    subsidiaryTokenSymbol1: 'PLU',
    subsidiaryTokenSymbol2: 'IRON'

  },
  {
    type: 'iron',
    address: contractAddresses.LPIRONARG, // OJO
    stakedTokenImg: 'assets/images/materials/iron.png',
    subsidiaryTokenImg1: 'assets/images/materials/argon.png',
    subsidiaryTokenImg2: 'assets/images/materials/iron.png',
    rewardTokenImg: 'assets/images/materials/iron.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMIRON,
    subsidiaryTokenSymbol1: 'ARG',
    subsidiaryTokenSymbol2: 'IRON'

  },
  {
    type: 'iron',
    address: contractAddresses.LPIRONCAR, // OJO
    stakedTokenImg: 'assets/images/materials/iron.png',
    subsidiaryTokenImg1: 'assets/images/materials/carbono.png',
    subsidiaryTokenImg2: 'assets/images/materials/iron.png',
    rewardTokenImg: 'assets/images/materials/iron.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMIRON,
    subsidiaryTokenSymbol1: 'CAR',
    subsidiaryTokenSymbol2: 'IRON'

  },
  {
    type: 'iron',
    address: contractAddresses.LPIRONACE, // OJO
    stakedTokenImg: 'assets/images/materials/iron.png',
    subsidiaryTokenImg1: 'assets/images/materials/acetileno.png',
    subsidiaryTokenImg2: 'assets/images/materials/iron.png',
    rewardTokenImg: 'assets/images/materials/iron.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMIRON,
    subsidiaryTokenSymbol1: 'ACE',
    subsidiaryTokenSymbol2: 'IRON'

  },
  {
    type: 'iron',
    address: contractAddresses.LPIRONVAN, // OJO
    stakedTokenImg: 'assets/images/materials/iron.png',
    subsidiaryTokenImg1: 'assets/images/materials/iron.png',
    subsidiaryTokenImg2: 'assets/images/materials/vanadio.png',
    rewardTokenImg: 'assets/images/materials/iron.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMIRON,
    subsidiaryTokenSymbol1: 'IRON',
    subsidiaryTokenSymbol2: 'VAN'

  },
  {
    type: 'iron',
    address: contractAddresses.LPIRONNIC, // OJO
    stakedTokenImg: 'assets/images/materials/iron.png',
    subsidiaryTokenImg1: 'assets/images/materials/iron.png',
    subsidiaryTokenImg2: 'assets/images/materials/niquel.png',
    rewardTokenImg: 'assets/images/materials/iron.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMIRON,
    subsidiaryTokenSymbol1: 'IRON',
    subsidiaryTokenSymbol2: 'NIC'
  },

  // Added 20221125
  {
    type: 'notReward',
    address: contractAddresses.LPIRONHYD, // OJO
    stakedTokenImg: 'assets/images/materials/iron.png',
    subsidiaryTokenImg1: 'assets/images/materials/hidrogeno.png',
    subsidiaryTokenImg2: 'assets/images/materials/iron.png',
    rewardTokenImg: 'assets/images/materials/iron.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMIRON,
    subsidiaryTokenSymbol1: 'HDR',
    subsidiaryTokenSymbol2: 'IRON'
  },
  {
    type: 'notReward',
    address: contractAddresses.LPIRONOXY, // OJO
    stakedTokenImg: 'assets/images/materials/iron.png',
    subsidiaryTokenImg1: 'assets/images/materials/iron.png',
    subsidiaryTokenImg2: 'assets/images/materials/oxigeno.png',
    rewardTokenImg: 'assets/images/materials/iron.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMIRON,
    subsidiaryTokenSymbol1: 'IRON',
    subsidiaryTokenSymbol2: 'OXY'
  },
  {
    type: 'notReward',
    address: contractAddresses.LPIRONSIL, // OJO
    stakedTokenImg: 'assets/images/materials/iron.png',
    subsidiaryTokenImg1: 'assets/images/materials/iron.png',
    subsidiaryTokenImg2: 'assets/images/materials/silicio.png',
    rewardTokenImg: 'assets/images/materials/iron.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMIRON,
    subsidiaryTokenSymbol1: 'IRON',
    subsidiaryTokenSymbol2: 'SIL'
  },
  {
    type: 'notReward',
    address: contractAddresses.LPIRONCHR, // OJO
    stakedTokenImg: 'assets/images/materials/iron.png',
    subsidiaryTokenImg1: 'assets/images/materials/iron.png',
    subsidiaryTokenImg2: 'assets/images/materials/cromo.png',
    rewardTokenImg: 'assets/images/materials/iron.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMIRON,
    subsidiaryTokenSymbol1: 'IRON',
    subsidiaryTokenSymbol2: 'CHR'
  },
  {
    type: 'notReward',
    address: contractAddresses.LPIRONHEL, // OJO
    stakedTokenImg: 'assets/images/materials/iron.png',
    subsidiaryTokenImg1: 'assets/images/materials/iron.png',
    subsidiaryTokenImg2: 'assets/images/materials/helio.png',
    rewardTokenImg: 'assets/images/materials/iron.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMIRON,
    subsidiaryTokenSymbol1: 'IRON',
    subsidiaryTokenSymbol2: 'HEL'
  },
  {
    type: 'notReward',
    address: contractAddresses.LPIRONALUM, // OJO
    stakedTokenImg: 'assets/images/materials/iron.png',
    subsidiaryTokenImg1: 'assets/images/materials/iron.png',
    subsidiaryTokenImg2: 'assets/images/materials/aluminio.png',
    rewardTokenImg: 'assets/images/materials/iron.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMIRON,
    subsidiaryTokenSymbol1: 'IRON',
    subsidiaryTokenSymbol2: 'ALU'
  },
  {
    type: 'notReward',
    address: contractAddresses.LPIRONCOB, // OJO
    stakedTokenImg: 'assets/images/materials/iron.png',
    subsidiaryTokenImg1: 'assets/images/materials/iron.png',
    subsidiaryTokenImg2: 'assets/images/materials/cobalto.png',
    rewardTokenImg: 'assets/images/materials/iron.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMIRON,
    subsidiaryTokenSymbol1: 'IRON',
    subsidiaryTokenSymbol2: 'COB'
  },
  // END added 20221125

  {
    type: 'copper',
    address: contractAddresses.LPCOPMET, // OJO
    stakedTokenImg: 'assets/images/materials/copper.png',
    subsidiaryTokenImg1: 'assets/images/materials/metano.png',
    subsidiaryTokenImg2: 'assets/images/materials/copper.png',
    rewardTokenImg: 'assets/images/materials/copper.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMCOP,
    subsidiaryTokenSymbol1: 'MET',
    subsidiaryTokenSymbol2: 'COP'
  },
  {
    type: 'copper',
    address: contractAddresses.LPCOPPLU, // OJO
    stakedTokenImg: 'assets/images/materials/copper.png',
    subsidiaryTokenImg1: 'assets/images/materials/plutonio.png',
    subsidiaryTokenImg2: 'assets/images/materials/copper.png',
    rewardTokenImg: 'assets/images/materials/copper.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMCOP,
    subsidiaryTokenSymbol1: 'PLU',
    subsidiaryTokenSymbol2: 'COP'
  },
  {
    type: 'copper',
    address: contractAddresses.LPCOPARG, // OJO
    stakedTokenImg: 'assets/images/materials/copper.png',
    subsidiaryTokenImg1: 'assets/images/materials/argon.png',
    subsidiaryTokenImg2: 'assets/images/materials/copper.png',
    rewardTokenImg: 'assets/images/materials/copper.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMCOP,
    subsidiaryTokenSymbol1: 'ARG',
    subsidiaryTokenSymbol2: 'COP'
  },
  {
    type: 'copper',
    address: contractAddresses.LPCOPCAR, // OJO
    stakedTokenImg: 'assets/images/materials/copper.png',
    subsidiaryTokenImg1: 'assets/images/materials/carbono.png',
    subsidiaryTokenImg2: 'assets/images/materials/copper.png',
    rewardTokenImg: 'assets/images/materials/copper.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMCOP,
    subsidiaryTokenSymbol1: 'CAR',
    subsidiaryTokenSymbol2: 'COP'
  },
  {
    type: 'copper',
    address: contractAddresses.LPCOPACE, // OJO
    stakedTokenImg: 'assets/images/materials/copper.png',
    subsidiaryTokenImg1: 'assets/images/materials/acetileno.png',
    subsidiaryTokenImg2: 'assets/images/materials/copper.png',
    rewardTokenImg: 'assets/images/materials/copper.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMCOP,
    subsidiaryTokenSymbol1: 'ACE',
    subsidiaryTokenSymbol2: 'COP'
  },
  {
    type: 'copper',
    address: contractAddresses.LPCOPVAN, // OJO
    stakedTokenImg: 'assets/images/materials/copper.png',
    subsidiaryTokenImg1: 'assets/images/materials/copper.png',
    subsidiaryTokenImg2: 'assets/images/materials/vanadio.png',
    rewardTokenImg: 'assets/images/materials/copper.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMCOP,
    subsidiaryTokenSymbol1: 'COP',
    subsidiaryTokenSymbol2: 'VAN'
  },
  {
    type: 'copper',
    address: contractAddresses.LPCOPNIC, // OJO
    stakedTokenImg: 'assets/images/materials/copper.png',
    subsidiaryTokenImg1: 'assets/images/materials/copper.png',
    subsidiaryTokenImg2: 'assets/images/materials/niquel.png',
    rewardTokenImg: 'assets/images/materials/copper.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMCOP,
    subsidiaryTokenSymbol1: 'COP',
    subsidiaryTokenSymbol2: 'NIC'
  },

  // Added 20221125

  {
    type: 'notReward',
    address: contractAddresses.LPCOPHYD, // OJO
    stakedTokenImg: 'assets/images/materials/copper.png',
    subsidiaryTokenImg1: 'assets/images/materials/copper.png',
    subsidiaryTokenImg2: 'assets/images/materials/hidrogeno.png',
    rewardTokenImg: 'assets/images/materials/copper.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMCOP,
    subsidiaryTokenSymbol1: 'COP',
    subsidiaryTokenSymbol2: 'HDR'
  },
  {
    type: 'notReward',
    address: contractAddresses.LPCOPOXY, // OJO
    stakedTokenImg: 'assets/images/materials/copper.png',
    subsidiaryTokenImg1: 'assets/images/materials/copper.png',
    subsidiaryTokenImg2: 'assets/images/materials/oxigeno.png',
    rewardTokenImg: 'assets/images/materials/copper.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMCOP,
    subsidiaryTokenSymbol1: 'COP',
    subsidiaryTokenSymbol2: 'OXY'
  },
  {
    type: 'notReward',
    address: contractAddresses.LPCOPSIL, // OJO
    stakedTokenImg: 'assets/images/materials/copper.png',
    subsidiaryTokenImg1: 'assets/images/materials/copper.png',
    subsidiaryTokenImg2: 'assets/images/materials/silicio.png',
    rewardTokenImg: 'assets/images/materials/copper.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMCOP,
    subsidiaryTokenSymbol1: 'COP',
    subsidiaryTokenSymbol2: 'SIL'
  },
  {
    type: 'notReward',
    address: contractAddresses.LPCOPCHR, // OJO
    stakedTokenImg: 'assets/images/materials/copper.png',
    subsidiaryTokenImg1: 'assets/images/materials/copper.png',
    subsidiaryTokenImg2: 'assets/images/materials/cromo.png',
    rewardTokenImg: 'assets/images/materials/copper.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMCOP,
    subsidiaryTokenSymbol1: 'COP',
    subsidiaryTokenSymbol2: 'CHR'
  },
  {
    type: 'notReward',
    address: contractAddresses.LPCOPHEL, // OJO
    stakedTokenImg: 'assets/images/materials/copper.png',
    subsidiaryTokenImg1: 'assets/images/materials/copper.png',
    subsidiaryTokenImg2: 'assets/images/materials/helio.png',
    rewardTokenImg: 'assets/images/materials/copper.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMCOP,
    subsidiaryTokenSymbol1: 'COP',
    subsidiaryTokenSymbol2: 'HEL'
  },
  {
    type: 'notReward',
    address: contractAddresses.LPCOPALUM, // OJO
    stakedTokenImg: 'assets/images/materials/copper.png',
    subsidiaryTokenImg1: 'assets/images/materials/copper.png',
    subsidiaryTokenImg2: 'assets/images/materials/aluminio.png',
    rewardTokenImg: 'assets/images/materials/copper.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMCOP,
    subsidiaryTokenSymbol1: 'COP',
    subsidiaryTokenSymbol2: 'ALU'
  },
  {
    type: 'notReward',
    address: contractAddresses.LPCOPCOB, // OJO
    stakedTokenImg: 'assets/images/materials/copper.png',
    subsidiaryTokenImg1: 'assets/images/materials/copper.png',
    subsidiaryTokenImg2: 'assets/images/materials/cobalto.png',
    rewardTokenImg: 'assets/images/materials/copper.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMCOP,
    subsidiaryTokenSymbol1: 'COP',
    subsidiaryTokenSymbol2: 'COB'
  },

  // END added 20221125

  {
    type: 'iron',
    address: contractAddresses.LPMETPLU, // OJO
    stakedTokenImg: 'assets/images/materials/iron.png',
    subsidiaryTokenImg1: 'assets/images/materials/metano.png',
    subsidiaryTokenImg2: 'assets/images/materials/plutonio.png',
    rewardTokenImg: 'assets/images/materials/iron.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMIRON,
    subsidiaryTokenSymbol1: 'MET',
    subsidiaryTokenSymbol2: 'PLU'
  },
  {
    type: 'copper',
    address: contractAddresses.LPARGCAR, // OJO
    stakedTokenImg: 'assets/images/materials/copper.png',
    subsidiaryTokenImg1: 'assets/images/materials/argon.png',
    subsidiaryTokenImg2: 'assets/images/materials/carbono.png',
    rewardTokenImg: 'assets/images/materials/copper.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMCOP,
    subsidiaryTokenSymbol1: 'ARG',
    subsidiaryTokenSymbol2: 'CAR'
  },
  {
    type: 'iron',
    address: contractAddresses.LPACEVAN, // OJO
    stakedTokenImg: 'assets/images/materials/iron.png',
    subsidiaryTokenImg1: 'assets/images/materials/acetileno.png',
    subsidiaryTokenImg2: 'assets/images/materials/vanadio.png',
    rewardTokenImg: 'assets/images/materials/iron.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMIRON,
    subsidiaryTokenSymbol1: 'ACE',
    subsidiaryTokenSymbol2: 'VAN'
  },
  {
    type: 'copper',
    address: contractAddresses.LPVANNIC, // OJO
    stakedTokenImg: 'assets/images/materials/copper.png',
    subsidiaryTokenImg1: 'assets/images/materials/vanadio.png',
    subsidiaryTokenImg2: 'assets/images/materials/niquel.png',
    rewardTokenImg: 'assets/images/materials/copper.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMCOP,
    subsidiaryTokenSymbol1: 'VAN',
    subsidiaryTokenSymbol2: 'NIC'
  },

  // Added 20221125

  {
    type: 'notReward',
    address: contractAddresses.LPHYDOXY, // OJO
    stakedTokenImg: 'assets/images/materials/hidrogeno.png',
    subsidiaryTokenImg1: 'assets/images/materials/hidrogeno.png',
    subsidiaryTokenImg2: 'assets/images/materials/oxigeno.png',
    rewardTokenImg: 'assets/images/materials/hidrogeno.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMCOP,
    subsidiaryTokenSymbol1: 'HDR',
    subsidiaryTokenSymbol2: 'OXY'
  },
  {
    type: 'notReward',
    address: contractAddresses.LPOXYCAR, // OJO
    stakedTokenImg: 'assets/images/materials/oxigeno.png',
    subsidiaryTokenImg1: 'assets/images/materials/oxigeno.png',
    subsidiaryTokenImg2: 'assets/images/materials/carbono.png',
    rewardTokenImg: 'assets/images/materials/oxigeno.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMCOP,
    subsidiaryTokenSymbol1: 'OXY',
    subsidiaryTokenSymbol2: 'CAR'
  },
  {
    type: 'notReward',
    address: contractAddresses.LPSILCHR, // OJO
    stakedTokenImg: 'assets/images/materials/silicio.png',
    subsidiaryTokenImg1: 'assets/images/materials/silicio.png',
    subsidiaryTokenImg2: 'assets/images/materials/cromo.png',
    rewardTokenImg: 'assets/images/materials/silicio.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMCOP,
    subsidiaryTokenSymbol1: 'SIL',
    subsidiaryTokenSymbol2: 'CHR'
  },
  {
    type: 'notReward',
    address: contractAddresses.LPHELMET, // OJO
    stakedTokenImg: 'assets/images/materials/helio.png',
    subsidiaryTokenImg1: 'assets/images/materials/helio.png',
    subsidiaryTokenImg2: 'assets/images/materials/metano.png',
    rewardTokenImg: 'assets/images/materials/helio.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMCOP,
    subsidiaryTokenSymbol1: 'HEL',
    subsidiaryTokenSymbol2: 'MET'
  },
  {
    type: 'notReward',
    address: contractAddresses.LPALUCOB, // OJO
    stakedTokenImg: 'assets/images/materials/aluminio.png',
    subsidiaryTokenImg1: 'assets/images/materials/aluminio.png',
    subsidiaryTokenImg2: 'assets/images/materials/cobalto.png',
    rewardTokenImg: 'assets/images/materials/aluminio.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMCOP,
    subsidiaryTokenSymbol1: 'ALU',
    subsidiaryTokenSymbol2: 'COB'
  },
  {
    type: 'notReward',
    address: contractAddresses.LPALUPLU, // OJO
    stakedTokenImg: 'assets/images/materials/aluminio.png',
    subsidiaryTokenImg1: 'assets/images/materials/aluminio.png',
    subsidiaryTokenImg2: 'assets/images/materials/plutonio.png',
    rewardTokenImg: 'assets/images/materials/aluminio.png',
    multiplier: 1,
    factory: contractAddresses.FACTORY,
    farm: contractAddresses.FARMCOP,
    subsidiaryTokenSymbol1: 'ALU',
    subsidiaryTokenSymbol2: 'PLU'
  }
];
