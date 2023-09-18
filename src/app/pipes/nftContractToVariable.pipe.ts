import { Pipe, PipeTransform } from '@angular/core';
import { contractAddresses } from '../constants/contractAddresses';

/**
 * Pipe to change contract adress to ticker
 */
@Pipe({name: 'nftContractToVariable'})
export class NftContractToVariablePipe implements PipeTransform {

  /**
   * Changes an OR NFT contract address for it's name
   * @param {string} value : NFT contract address
   * @returns {string} : the name of the NFT
   */
  transform(value: string): string {
    switch (value.toLowerCase()) {
      case contractAddresses.weapon.toLowerCase():
        return 'weapon';
      case contractAddresses.armor.toLowerCase():
        return 'armor';
      case contractAddresses.spaceVehicle.toLowerCase():
        return 'spaceVehicle';
      case contractAddresses.landVehicle.toLowerCase():
        return 'landVehicle';
      case contractAddresses.cosmetic.toLowerCase():
        return 'cosmetic';
      case contractAddresses.clanBadge.toLowerCase():
        return 'clanBadge';
      case contractAddresses.exocredit.toLowerCase():
        return 'exocredit';
      case contractAddresses.land.toLowerCase():
        return 'land';
      case contractAddresses.holdtelKey.toLowerCase():
        return 'holdtelKey';
      default:
        return 'unknown';
    }
  }
}
