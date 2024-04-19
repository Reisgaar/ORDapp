import packageInfo from '../../package.json';

export const environment = {
  production: false,
  network: 'testnet',
  chainId: 97,
  infuraId: '',
  version: packageInfo.version,
  name: packageInfo.name,

  pak: '7dc5e591a6b88f482a88', // Pinata API Key
  pask: '18843ecc21149f7dbc9849ecbf58b237b7430fefc47c34c7517665b30dea136a', // Pinata API Secret Key

  // Wallets abled to upload proposals to governance
  allowedWalletsToUploadProposals: [
    '0xE130f543Bb1c4F0802d511486eAFEc467E9DeCBf',
    '0x2aBcbdF5a10082F311D666EC58aD1C90948a2F4a',
    '0x58d36262f91e1ABFE565922C953BBa05FEd8F1b3'
  ],
  // Governance Mailer API
  mailerApi: 'https://governancemailer.nexxyolabs.net/',

  // Partnership Mailer API
  partnerMailerApi: 'https://weborbackendmarketplacepartners.azurewebsites.net/api/',

  // Blockchain Bridge API
  blockchainBridgeApi: 'https://nld002.backend.blockchainbridge.ne2.dev-nexxyolabs.net/',

  // Graph API Testnet
  graphURI: 'https://api.thegraph.com/subgraphs/name/nexxyolabsmikelariceta/marketplace-with-lands-new',
  graphURImarketplace: 'https://api.thegraph.com/subgraphs/name/nexxyolabsmikelariceta/marketplace-with-lands-new',
  // graphURImarketplace: 'https://api.thegraph.com/subgraphs/name/nexxyolabsibaicastanon/onlylands',
  graphURIUndergroundMarket: 'https://api.thegraph.com/subgraphs/name/nexxyolabsmikelariceta/blackmarket-bsctestnet',
  graphURIpartners: 'https://api.thegraph.com/subgraphs/name/nexxyolabsmikelariceta/partners-or-hashapon',
  graphURIgovernance: 'https://api.thegraph.com/subgraphs/name/nexxyolabsmikelariceta/governance-chapel',
  graphURIcrafting: 'https://api.thegraph.com/subgraphs/name/nexxyolabsmikelariceta/crafting-new',
  graphURIlands: 'https://api.thegraph.com/subgraphs/name/nexxyolabsibaicastanon/onlylands',
  graphURIPools: 'https://api.thegraph.com/subgraphs/name/outerringblockchain/orpools'
};
