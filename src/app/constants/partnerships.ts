// Data of all OR Partners
export const partners: any = {

  // Example of partner to replicate for each partner (don't delete)
  noPartner: {
    // Boolean to show in front or not
    show: false,
    // Boolean to set active or not
    launched: false,
    // Partner data, strings
    name: 'No Partner',
    nameToShow: 'nó pärtnèr', // Used if name has any accent or similar
    color: '#1a3341',
    website: '',
    // Images, file name with extension, strings
    logo: '',
    header: '',
    button: '',
    // Tradeable NFTs, Array of strings
    nfts: [],
    // NFT, Array of strings
    burneable: [],
    redeemable: [],
    // Filters to apply on searching, Object { filterName: filter(string) }
    filter: {},
    // If redeemable NFT is able to collect on some place
    canReceiveOnStore: true,
    address: {
      name: 'Name of the place',
      street: '',
      zipCode: '',
      city: '',
      state: '',
      country: ''
    }
  },

  // HASHAPON
  hashapon: {
    show: false,
    launched: false,
    name: 'hashapon',
    nameToShow: 'hashapon',
    color: '#501496',
    website: 'http://testnl.ovh/',
    logo: 'hashapon_logo.png',
    header: 'hashapon_header.png',
    button: 'hashapon_button.png',
    nfts: [
      '0x2CE9A2DED7958fb4ed28A56CAaC60663BFDd8a06'
    ],
    burneable: [],
    redeemable: [],
    filter: {
      type: ['Ursid', 'Feline', 'Canid', 'Bird', 'Primate', 'Reptile', 'Marsupial', 'Rodent'],
      age: ['Egg', 'Baby', 'Young', 'Adult']
    }
  },

  // BASKONIA
  baskonia: {
    show: true,
    launched: true,
    name: 'baskonia',
    nameToShow: 'baskonia',
    color: '#A6192E',
    website: 'https://www.baskonia.com/',
    logo: 'baskonia_logo.svg',
    header: 'baskonia_header.png',
    button: 'baskonia_button.png',
    nfts: [
      '0xeDe33e0DB8f61B6C905640Ab0735861F9c4350eD'
    ],
    burneable: [],
    redeemable: ['0xeDe33e0DB8f61B6C905640Ab0735861F9c4350eD'],
    filter: {
    },
    canReceiveOnStore: true,
    address: {
      name: 'Baskonia Alavés Store',
      street: 'General Alava Kalea, 1',
      zipCode: '01005',
      city: 'Gasteiz',
      state: 'Araba',
      country: 'España'
    }
  },

//   alaves: {
//     show: false,
//     launched: false,
//     name: 'alaves',
//     nameToShow: 'alavés',
//     color: '#152f88',
//     website: 'https://www.deportivoalaves.com/',
//     logo: 'alaves_logo.png',
//     header: 'alaves_header.png',
//     button: 'alaves_button.png',
//     nfts: [
//       '0xFd9CA6BBeC5F5a9CD7C890F6e89b1ace23209BAe'
//     ],
//     burneable: [],
//     redeemable: ['0xFd9CA6BBeC5F5a9CD7C890F6e89b1ace23209BAe'],
//     filter: {
//       type: ['Pack Partido'],
//       collection: ['La Liga 2022', 'Copa del Rey 2022']
//     },
//     canReceiveOnStore: true,
//     address: {
//       name: 'Baskonia Alavés Store',
//       street: 'General Alava Kalea, 1',
//       zipCode: '01005',
//       city: 'Gasteiz',
//       state: 'Araba',
//       country: 'España'
//     }
//   }

};
