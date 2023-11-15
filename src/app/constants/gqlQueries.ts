import gql from 'graphql-tag';

// Provisional querry until lands are added to marketplace graph
export const landsOnWallet = gql`
  query LandsOnWallet($wallet: Bytes!) {
    lands: lands(first: 1000, where: {currentOwner: $wallet}) {
      id
      tokenId
      collectionId
      collectionName
      currentOwner
      district
      firstOwner
      fullTokenURI
      metadata {
        id
        uriString
      }
      nftContractAddress
      nftOn
      ring
      sector
      size
      tokenURI
    }
  }
`;


/*
 * GOVERNANCE QUERY
 */

export const getGovernanceProposals = gql`
  query getGovernanceProposals {
    createProposals(orderBy: block, orderDirection: desc) {
      block
      fullProposalURI
      id
      metadata {
        id
        uriString
      }
      proposalId
      proposalURI
      votes {
        amount
        answer
        block
        id
        proposalId
        user
      }
    }
  }
`;

export const CurrentVotesForUserByProposalId = gql`
  query CurrentVotesForUserByProposalId($proposalId: BigInt!, $user: Bytes!) {
    votes(first: 1000, where: {proposalId: $proposalId, user: $user}, orderBy: block) {
      block
      user
      proposalId
      amount
      answer
    }
  }
`;

// BLACK MARKET
export const getBlackMarketSales = gql`
  query getBlackMarketSales($materialAddresses: [Bytes!]!, $orderBy: Bytes!, $orderDirection: Bytes!, $ownerContains: Bytes!, $ownerNot: Bytes!) {
    sales(
      first: 1000,
      where: {isActive: true, material_in: $materialAddresses, owner_contains: $ownerContains, owner_not: $ownerNot},
      orderBy: $orderBy, orderDirection: $orderDirection
    ) {
      id
      isActive
      material
      owner
      price
      quantity
    }
  }
`;


// MARKETPLACE

/**
 * Get sales in the marketplace
 * @param $amount : amount of results wanted
 */
export const getSales = gql`
  query DirectSalesByBlock($amount: Int!, $nftContractAddress: [Bytes!]!) {
    sales: ongoingDirectSales(first: $amount, orderBy: block, orderDirection: desc, where: {nftContractAddress_in: $nftContractAddress}) {
      id
      block
      nftContractAddress
      tokenId
      fullTokenURI
      tokenURI
      metadata {
        uriString
      }
      nftSeller
      erc20Token
      buyPrice
      nftOn
    }
  }
`;

/**
 * Get auctions in the marketplace
 * @param $amount : amount of results wanted
 */
export const getAuctions = gql`
  query getAllAuctions($amount: Int!, $nftContractAddress: [Bytes!]!) {
    auctions: ongoingAuctions(first: 1000, orderBy: block, orderDirection: desc, where: {nftContractAddress_in: $nftContractAddress}) {
      id
      block
      nftContractAddress
      tokenId
      fullTokenURI
      tokenURI
      metadata {
        uriString
      }
      nftSeller
      erc20Token
      minPrice
      auctionBidPeriod
      bidIncreasePercentage
      feeRecipients
      feePercentages
      nftHighestBid
      nftHighestBidder
      bidsMade
      endTimeStamp
      nftOn
      walletsThatBid
    }
  }
`;

/**
 * Get hot auctions in the marketplace
 * @param $amount : amount of results wanted
 * @param $actualTimeStamp : actual time stamp in seconds
 */
export const getHotAuctions = gql`
  query getHotAuctions($amount: Int!, $actualTimeStamp: String!) {
    auctions: ongoingAuctions(first: $amount, orderBy: bidsMade, orderDirection: desc, where: {endTimeStamp_gt: $actualTimeStamp}) {
      id
      block
      nftContractAddress
      tokenId
      fullTokenURI
      tokenURI
      metadata {
        uriString
      }
      nftSeller
      erc20Token
      minPrice
      auctionBidPeriod
      bidIncreasePercentage
      feeRecipients
      feePercentages
      nftHighestBid
      nftHighestBidder
      bidsMade
      endTimeStamp
      nftOn
    }
  }
`;


// DOWHEN: New OR NFT added, add to next query the new nft part

/**
 * Get all the NFTs of a wallet
 * @param $wallet : wallet of user in lower case
 */
export const getWalletNfts = gql`
  query getWalletNfts($wallet: Bytes!, $armors: Bytes!, $clanBadges: Bytes!, $exocredits: Bytes!, $cosmetics: Bytes!, $landVehicles: Bytes!, $spaceVehicles: Bytes!, $weapons: Bytes!, $lands: Bytes!, $keys: Bytes!) {
    inventory: usersInventories(where: {id: $wallet}) {
      armors(first: 1000, where: {type_contains_nocase: $armors}) {
        id
        type
        nftContractAddress
        tier
        rarityId
        rarityName
        collectionId
        collectionName
        firstOwner
        piece
        fullTokenURI
        tokenURI
        metadata {uriString}
        activities {
          type
          from
          to
          buyPrice
          tokenId
          block
        }
        nftOn
      }
      clanBadges(first: 1000, where: {type_contains_nocase: $clanBadges}) {
        id
        type
        nftContractAddress
        firstOwner
        fullTokenURI
        tokenURI
        metadata {uriString}
        activities {
          type
          from
          to
          buyPrice
          tokenId
          block
        }
        nftOn
      }
      exocredits(first: 1000, where: {type_contains_nocase: $exocredits}) {
        id
        type
        nftContractAddress
        firstOwner
        fullTokenURI
        tokenURI
        metadata {uriString}
        activities {
          type
          from
          to
          buyPrice
          tokenId
          block
        }
        nftOn
      }
      cosmetics(first: 1000, where: {type_contains_nocase: $cosmetics}) {
        id
        type
        nftContractAddress
        tier
        rarityId
        rarityName
        collectionId
        collectionName
        firstOwner
        piece
        fullTokenURI
        tokenURI
        metadata {uriString}
        activities {
          type
          from
          to
          buyPrice
          tokenId
          block
        }
        nftOn
      }
      landVehicles(first: 1000, where: {type_contains_nocase: $landVehicles}) {
        id
        type
        nftContractAddress
        typeId
        typeName
        collectionId
        collectionName
        firstOwner
        fullTokenURI
        tokenURI
        metadata {uriString}
        activities {
          type
          from
          to
          buyPrice
          tokenId
          block
        }
        nftOn
      }
      spaceVehicles(first: 1000, where: {type_contains_nocase: $spaceVehicles}) {
        id
        type
        nftContractAddress
        typeId
        typeName
        collectionId
        collectionName
        firstOwner
        fullTokenURI
        tokenURI
        metadata {uriString}
        activities {
          type
          from
          to
          buyPrice
          tokenId
          block
        }
        nftOn
      }
      weapons(first: 1000, where: {type_contains_nocase: $weapons}) {
        id
        type
        nftContractAddress
        tier
        rarityId
        rarityName
        collectionId
        collectionName
        firstOwner
        piece
        fullTokenURI
        tokenURI
        metadata {uriString}
        activities {
          type
          from
          to
          buyPrice
          tokenId
          block
        }
        nftOn
      }
      lands(first: 1000, where: {type_contains_nocase: $lands}) {
        collectionId
        collectionName
        currentOwner
        district
        firstOwner
        fullTokenURI
        id
        metadata {
          id
          uriString
        }
        nftContractAddress
        nftOn
        ring
        sector
        size
        tokenId
        tokenURI
        type
      }
      orGoldStarKeys(first: 1000, where: {type_contains_nocase: $keys}) {
        id
        tokenId
        nftContractAddress
        firstOwner
        fullTokenURI
        tokenURI
        metadata {uriString}
        activities {
          type
          from
          to
          buyPrice
          tokenId
          block
        }
        nftOn
        type
      }
    }
  }
`;

/**
 * Get all the NFTs that a wallet has on sale
 * @param $wallet : wallet of user in lower case
 */
export const getWalletSales = gql`
  query getWalletSales($wallet: Bytes!, $nftContractAddress: [Bytes!]!) {
    sales: ongoingDirectSales(first: 1000, where: {nftSeller: $wallet, nftContractAddress_in: $nftContractAddress}, orderBy: block) {
      id
      block
      nftContractAddress
      tokenId
      fullTokenURI
      tokenURI
      metadata {
        uriString
      }
      nftSeller
      erc20Token
      buyPrice
      nftOn
    }
  }
`;

/**
 * Get all the NFTs that a wallet has on auction
 * @param $wallet : wallet of user in lower case
 */
export const getWalletAuctions = gql`
  query getWalletAuctions($wallet: Bytes!, $nftContractAddress: [Bytes!]!) {
    auctions: ongoingAuctions(first: 1000, where: {nftSeller: $wallet, nftContractAddress_in: $nftContractAddress}, orderBy: block, orderDirection: desc) {
      id
      block
      nftContractAddress
      tokenId
      fullTokenURI
      tokenURI
      metadata {
        uriString
      }
      nftSeller
      erc20Token
      minPrice
      auctionBidPeriod
      bidIncreasePercentage
      feeRecipients
      feePercentages
      nftHighestBid
      nftHighestBidder
      bidsMade
      endTimeStamp
      nftOn
    }
  }
`;

/**
 * Get all the NFTs that a wallet has bid on
 * @param $wallet : wallet of user in lower case
 */
export const getWalletDoneBids = gql`
  query getWalletDoneBids($wallet: Bytes!) {
    auctions: ongoingAuctions(first: 1000, where: {walletsThatBid_contains: [$wallet]}) {
      walletsThatBid
      tokenURI
      tokenId
      nftSeller
      nftOn
      nftHighestBidder
      nftHighestBid
      nftContractAddress
      minPrice
      id
      fullTokenURI
      feeRecipients
      feePercentages
      erc20Token
      endTimeStamp
      block
      bidsMade
      bidIncreasePercentage
      auctionBidPeriod
    }
  }
`;

// STATISTICS FOR MARKETPLACE


/**
 * Gets the data of the land owners
 */
export const getSalesHistoric = gql`
  query getSalesHistoric($first: Int!, $skip: Int!) {
    salesHistories(first: $first, skip: $skip) {
      block
      buyPrice
      buyer
      erc20Token
      nftContractAddress
      nftSeller
      tokenId
    }
  }
`;


// PARTNERS MARKETPLACE

/**
 * Get transfers of a Partner's NFT
 * @param $id : tokenId in hex + nftContractAddress
 */
export const getPartnersNftTransferData = gql`
  query getPartnersNftTransferData($id: Bytes!) {
    nfts: partnerNFTs(first: 1000, where: {id: $id}) {
      id
      activities(first: 1000) {
        id
        type
        from
        to
        buyPrice
        token
        block
      }
    }
  }
`;

/**
 * Get partner NFTs on a wallet
 * @param $nftAddresses : array of addresses of the NFTs
 * @param $wallet : user wallet on lower case
 */
export const getPartnerNftOnWallet = gql`
  query getPartnerNftOnWallet($nftAddresses: [Bytes!]!, $wallet: Bytes!) {
    response: usersInventories(where: {id: $wallet}) {
      nfts: partnerNFTs(first: 1000, where: {nftContractAddress_in: $nftAddresses }) {
        id
        tokenId
        nftContractAddress
        fullTokenURI
        tokenURI
        nftOn
        metadata { uriString }
        activities(first: 100) {
          type
          from
          to
          buyPrice
          token
          block
        }
      }
    }
  }
`;


/**
 * Get partner NFTs on sale
 * @param $nftAddresses : array of addresses of the NFTs
 * @param $wallet : user wallet on lower case
 */
export const getPartnerNftOnSale = gql`
  query getPartnerNftOnSale($nftAddresses: [Bytes!]!, $wallet: Bytes!) {
    response: ongoingPartnerDirectSales(first: 1000, where: {nftContractAddress_in: $nftAddresses}) {
      id
      block
      nftContractAddress
      tokenId
      tokenURI
      metadata { uriString }
      nftSeller
      erc20Token
      buyPrice
      tokenURI
      nftOn
    }
  }
`;

/**
 * Get partner NFTs on auction
 * @param $nftAddresses : array of addresses of the NFTs
 * @param $wallet : user wallet on lower case
 */
export const getPartnerNftOnAuction = gql`
  query getPartnerNftOnAuction($nftAddresses: [Bytes!]!, $wallet: Bytes!) {
    response: ongoingPartnerAuctions(first: 1000, where: {nftContractAddress_in: $nftAddresses})  {
      id
      block
      nftContractAddress
      tokenId
      tokenURI
      metadata { uriString }
      nftSeller
      erc20Token
      minPrice
      auctionBidPeriod
      bidIncreasePercentage
      feeRecipients
      feePercentages
      nftHighestBid
      nftHighestBidder
      bidsMade
      endTimeStamp
      nftOn
    }
  }
`;


/*
 * NFT DETAIL QUERY
 */

/**
 * Get all activities (sales, auctions and transfers) of an NFTs on sale
 * @param $id : id of the NFT
 * @param $nftContractAddress : Contract address of the NFT
 */
export const getNftTransferData = gql`
  query getNftTransferData($id: Bytes!, $nftContractAddress: Bytes!) {
    activities(first: 1000, where: {tokenId: $id, nftContractAddress: $nftContractAddress}) {
      id
      type
      from
      to
      buyPrice
      block
      token
      tokenId
      nftContractAddress
      txHash
    }
  }
`;


// CRAFTING QUERY

/**
 * Get all materials of a wallet
 * @param $wallet : User wallet on lower case
 */
export const getWalletMaterials = gql`
query getWalletMaterials($wallet: Bytes!){
    usersMaterials(where: {id: $wallet}) {
      acetylene
      aluminium
      argon
      carbon
      chromium
      cobalt
      copper
      hydrogen
      helium
      iron
      methane
      nickel
      oxygen
      plutonium
      silicon
      vanadium
    }
  }
`;

export const getWalletArmorAndWeaponsquery = gql`
  query getWalletArmorAndWeaponsquery($wallet: Bytes!) {
    inventory: usersInventories(where: {id: $wallet}) {
      armors(first: 1000) {
        id
        type
        nftContractAddress
        tier
        rarityId
        rarityName
        collectionId
        collectionName
        piece
        fullTokenURI
        tokenURI
        metadata {uriString}
      }
      weapons(first: 1000) {
        id
        type
        nftContractAddress
        tier
        rarityId
        rarityName
        collectionId
        collectionName
        piece
        fullTokenURI
        tokenURI
        metadata {uriString}
      }
    }
  }
`;


/*
 *  LANDS
 */

/**
 * Get all lands on auction
 * @param $size : Size of the land
 * @param $ring : Ring the land is on
 * @param $sector : Sector the land is on
 * @param $district : District the land is on
 * @param $orderBy : Order category
 * @param $orderDirection : Order direction can be asc or desc
 * @param $wallet : Array of user wallet on lower case
 */
export const getLandsOnAuction = gql`
query getLandsOnAuction($size: [Bytes!]!, $ring: Bytes!, $sector: Bytes!, $district: Bytes!, $orderBy: Bytes!, $orderDirection: Bytes!, $wallet: [Bytes!]!) {
    lands: ongoingLandAuctions(first: 1000, where: {size_in: $size, ring_contains: $ring, sector_contains: $sector, district_contains: $district, walletsThatBid_contains: $wallet}, orderBy: $orderBy, orderDirection: $orderDirection) {
      auctionContract
      counter
      tokenId
      bidIncreasePercentageInBP
      bidsMade
      block
      buyOutPercentageInBP
      buyOutStartTime
      startTimeStamp
      endTimeStamp
      auctionBidPeriod
      erc20Token
      fullTokenURI
      id
      minBuyOutPrice
      minPrice
      nftContractAddress
      nftHighestBid
      nftHighestBidder
      nftOn
      walletsThatBid
      tokenURI
      ring
      sector
      district
      size
    }
  }
`;

/**
 * Get all lands on determinated location auction
 * @param $ring : Ring the land is on
 * @param $sector : Sector the land is on
 * @param $district : District the land is on
 */
export const getAllLands = gql`
  query getAllLands($ring: Bytes!, $sector: Bytes!, $district: Bytes!) {
    lands(first: 1000, where: {ring_contains: $ring, sector_contains: $sector, district_contains: $district, firstOwner_contains: "", firstOwner_not_in: ["0x812eB91daE4b12cc76666E5F2a352F5A9b74e59B", "0xc401990ac9F051e4eB8F4A8AC0837CE784Cb5a24"]}) {
      id
      nftContractAddress
      nftOn
      fullTokenURI
      tokenURI
      firstOwner
      currentOwner
      size
      ring
      sector
      district
      tokenId
    }
  }
`;

/**
 * Gets one nft required to access each land
 * @param $wallet : User wallet on lower case
 */
export const getWalletLandWhitelist = gql`
  query getWalletNfts($wallet: Bytes!) {
    inventory: usersInventories(where: {id: $wallet}) {
      micro: weapons(first: 1, where: {tier_in: [1,2]}) {
        id
        type
        nftContractAddress
        tier
      }
      standard1: armors(first: 1, where: {tier: 2}) {
        id
        type
        nftContractAddress
        tier
      }
      standard2: landVehicles(first: 1) {
        id
        type
        nftContractAddress
      }
      macro: spaceVehicles(first: 1) {
        id
        type
        nftContractAddress
      }
      mega: clanBadges(first: 1) {
        id
        type
        nftContractAddress
      }
    }
  }
`;

/**
 * Gets one nft required to access each land
 * @param $wallet : User wallet on lower case
 */
export const getWalletLandsBySize = gql`
  query getWalletLandsBySize($wallet: Bytes!) {
    lands: usersInventories(first: 1000, where: {id: $wallet}) {
      nano: lands(first: 1000, where: {size: "Nano"}) {
        currentOwner
        nftContractAddress
        size
        tokenId
      }
      micro: lands(first: 1000, where: {size: "Micro"}) {
        currentOwner
        nftContractAddress
        size
        tokenId
      }
      standard: lands(first: 1000, where: {size: "Standard"}) {
        currentOwner
        nftContractAddress
        size
        tokenId
      }
      macro: lands(first: 1000, where: {size: "Macro"}) {
        currentOwner
        nftContractAddress
        size
        tokenId
      }
      mega: lands(first: 1000, where: {size: "Mega"}) {
        currentOwner
        nftContractAddress
        size
        tokenId
      }
    }
  }
`;

/**
 * Gets the data of the land auction sales
 */
export const getFinishedLandAuctions = gql`
  query getFinishedLandAuctions {
    salesData: finishedLandAuctions(first: 1000) {
      buyerWallet
      counter
      district
      endTimeStamp
      erc20Token
      finalPrice
      hasBeenBuyout
      id
      ring
      sector
      size
      startTimeStamp
      tokenId
      walletsThatBid
    }
  }
`;

/**
 * Gets the data of the land owners
 */
export const getLandOwners = gql`
  query getLandOwners {
    owners: lands(first: 1000) {
      currentOwner
    }
  }
`;

/**
 * HOLDTEL
 */

/**
 * Gets the data of the land owners
 */
export const getUserKeys = gql`
  query getUserKeys($wallet: Bytes!) {
    usersInventories(first: 1000, where: {id: $wallet}) {
      keys: orGoldStarKeys {
        size
        currentOwner
        fullTokenURI
        metadata {
          id
          uriString
        }
        tokenId
        type
      }
      preAlpha: preAlphaERC721s {
        currentOwner
        fullTokenURI
        metadata {
          id
          uriString
        }
        tokenId
        type
      }
    }
  }
`;

/**
 * Get Pools
 */
export const getPools = gql`
query getPools{
  pools: pools ( first: 1000, orderBy: endBlock, orderDirection: desc){
    id
    factory
    pool
    type
    startBlock
    endBlock
    stakedToken {
     id
      address
      symbol
      decimals
      LPToken {
        id
        token0
        token0Symbol
        token0Decimals
        token1
        token1Symbol
       token1Decimals
      }
    }
    rewardToken {
      id
      address
      symbol
      LPToken {
        id
        token0
        token0Symbol
       token0Decimals
        token1
        token1Symbol
        token1Decimals
      }
    }
  }
}
`;

// REPLACE PREVIOUS QUERY FOR MAINNET OR WHEN PREALPHA KEYS SET ON MAINNET
// query getUserKeys($wallet: Bytes!) {
//   usersInventories(first: 1000, where: {id: $wallet}) {
//     keys: orGoldStarKeys {
//       size
//       currentOwner
//     }
//     preAlpha: preAlphaERC721 {
//       currentOwner
//       fullTokenURI
//       metadata {
//         id
//         uriString
//       }
//       tokenId
//       type
//     }
//   }
// }
