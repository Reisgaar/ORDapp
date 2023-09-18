import { Injectable } from '@angular/core';
import { ConnectionService } from '../connection/connection.service';
import { contractAddresses } from 'src/app/constants/contractAddresses';
// Abi
import { default as ERC721 } from 'src/app/shared/contracts/nft/ERC721.json';

/**
 * Service to manage all functions related to NFT with smart contract
 */
@Injectable({
  providedIn: 'root'
})
export class NftService {

  constructor(
    private connectionService: ConnectionService
  ) { }

  async hasBalanceOfNft(user: string, nftContractAddress: string): Promise<boolean> {
    const balance = await this.connectionService.readContract(nftContractAddress, ERC721.abi, 'balanceOf', [user]);
    if (parseInt(balance) > 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Gets the metadata of the NFT
   * @param tokenId : id of the token
   * @param contract : the contract of the NFT
   * @returns
   */
  async getNftData(tokenId: any, contractAddress: string): Promise<any> {
    try {
      const tokenMetadataURI = await this.connectionService.readContract(contractAddress, ERC721.abi, 'tokenURI', [tokenId]);
      const tokenMetadata = await fetch(tokenMetadataURI).then((response) => response.json());
      tokenMetadata.id = tokenId;
      tokenMetadata.contractAddress = contractAddress;
      return tokenMetadata;
    } catch (error) {
      console.log('REPEAT GET NFT DATA');
      return await this.getNftData(tokenId, contractAddress);
    }
  }

  /**
   * Gets the owner of the NFT
   * @param tokenId id of the NFT
   * @param contractAddress address of the NFT smart contract
   * @returns owner address
   */
  async getOwner(tokenId: any, contractAddress: string): Promise<string> {
    try {
      const owner = await this.connectionService.readContract(contractAddress, ERC721.abi, 'ownerOf', [tokenId]);
      if (owner) {return owner;}
      else {return await this.getOwner(tokenId, contractAddress);}
    } catch (error) {
      return await this.getOwner(tokenId, contractAddress);
    }
  }

  /**
   * Gets the first owner of the NFT
   * @param tokenId id of the NFT
   * @param contractAddress address of the NFT smart contract
   * @returns first owner address
   */
  async getFirstOwner(tokenId: any, contractAddress: string): Promise<string> {
    if (Object.values(contractAddresses).some((nft: any) => nft.toLowerCase() === contractAddress.toLowerCase())) {
      try {
        const firstOwner = await this.connectionService.readContract(contractAddress, ERC721.abi, 'getFirstOwner', [tokenId]);
        if (firstOwner) {return firstOwner;}
        else {return await this.getFirstOwner(tokenId, contractAddress);}
      } catch (error) {
        return await this.getFirstOwner(tokenId, contractAddress);
      }
    } else {
      return undefined;
    }
  }

  /**
   * Get the address by category name
   * @param {string} category : the category of the OR NFT
   * @returns {string} : the address of the NFT contract
   */
  async getNftAddressByCategoryName(category: string): Promise<string> {
    // DOWHEN: New OR NFT added, add new nft to the switch clause
    switch (category.toLowerCase()) {
      case 'weapons':
      case 'weapon':
        return contractAddresses.weapon;
      case 'armors':
      case 'armor':
        return contractAddresses.armor;
      case 'spacevehicles':
      case 'spacevehicle':
        return contractAddresses.spaceVehicle;
      case 'landvehicles':
      case 'landvehicle':
        return contractAddresses.landVehicle;
      case 'cosmetics':
      case 'cosmetic':
        return contractAddresses.cosmetic;
      case 'clanbadges':
      case 'clanbadge':
      case 'clan':
        return contractAddresses.clanBadge;
      case 'exocredits':
      case 'exocredit':
      case 'exo':
        return contractAddresses.exocredit;
      case 'lands':
      case 'land':
        return contractAddresses.land;
      case 'keys':
      case 'key':
        return contractAddresses.holdtelKey;
      default:
        return 'No address found';
    }
  }

  /**
   * Get the category name by the NFT address
   * @param {string} address : the address of the NFT contract
   * @returns {string} : the category of the OR NFT
   */
  async getCategoryByNftAddress(address: string): Promise<string> {
    // DOWHEN: New OR NFT added, add new nft to the switch clause
    switch (address.toLowerCase()) {
      case contractAddresses.weapon.toLowerCase():
        return 'weapon';
      case contractAddresses.armor.toLowerCase():
        return 'armor';
      case contractAddresses.spaceVehicle.toLowerCase():
        return 'spaceVehicle';
      case contractAddresses.landVehicle.toLowerCase():
        return 'landVehicle';
      case contractAddresses.cosmetic.toLowerCase():
        return 'cosmetic'.toLowerCase();
      case contractAddresses.clanBadge.toLowerCase():
        return 'clan';
      case contractAddresses.exocredit.toLowerCase():
        return 'exo';
      case contractAddresses.land.toLowerCase():
        return 'land';
      case contractAddresses.holdtelKey.toLowerCase():
        return 'key';
      default:
        return 'Category not found';
    }
  }
}
