import { Injectable } from '@angular/core';
import { ConnectionService } from '../connection/connection.service';
import { contractAddresses } from 'src/app/constants/contractAddresses';
// Abi
import { default as SBT } from 'src/app/shared/contracts/nft/SoulBoundToken.json';

/**
 * Service to manage functions related to NFT achievents
 */
@Injectable({
  providedIn: 'root'
})
export class MedalsService {

  constructor(
    private connectionService: ConnectionService
  ) { }

  /**
   * Get all the achievements (medals and banners)
   * @param {string} userAddr : the user wallet address
   * @returns {any} : object with all the achievements
   */
  async getAchievements(userAddr: string): Promise<any> {
    const medals = await this.getMedals(userAddr);
    const banners = await this.getBanners(userAddr);
    const all = {
      ...medals,
      ...banners
    };
    return all;
  }

  /**
   * Get all the medals
   * @param {string} userAddr : the user wallet address
   * @returns {any} : object with all the medals
   */
  async getMedals(userAddr: string): Promise<any> {
    const firstVoter = await this.hasBalanceOf(userAddr, contractAddresses.firstVoter);
    const clanBadge = await this.hasBalanceOf(userAddr, contractAddresses.clanBadge);
    const medals = {
      firstVoter,
      clanBadge
    };
    return medals;
  }

  /**
   * Check if user has balance of an NFT
   * @param {string} userAddr : the user wallet address
   * @param {string} nftAddress : the address of the NFT
   * @returns {any} : true if has balance
   */
  async hasBalanceOf(userAddr: string, nftAddress: string): Promise<any> {
    const balance = await this.connectionService.readContract(nftAddress, SBT.abi, 'balanceOf', [userAddr]);
    if (parseInt(balance, 0) > 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Get banners of a user
   * @param {string} userAddr : the user wallet address
   * @returns {any} : object with user banners
   */
  async getBanners(userAddr: string): Promise<any> {
    const banners: {[index: string]:any} = {};
    const bannerUris = await this.connectionService.readContract(contractAddresses.bannerBearer, SBT.abi, 'getUrisByAddress', [userAddr]);
    for (const b of bannerUris) {
      try {
        const data = await fetch(b).then((response) => response.json());
        banners[data.species.replaceAll(' ', '') + 'Banner'] = true;
      } catch (error: any) { console.log(error); }
    }
    return banners;
  }
}
