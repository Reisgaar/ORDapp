import { Pipe, PipeTransform } from '@angular/core';
import { contractAddresses } from '../constants/contractAddresses';

/**
 * Pipe to change contract adress to ticker
 */
@Pipe({name: 'nftContractToName'})
export class NftContractToNamePipe implements PipeTransform {

  /**
   * Changes an OR NFT contract address for it's name
   * @param {string} value : NFT contract address
   * @returns {string} : the name of the NFT
   */
  transform(value: string): string {
    switch (value.toLowerCase()) {
      case contractAddresses.weapon.toLowerCase():
        return 'Weapon';
      case contractAddresses.armor.toLowerCase():
        return 'Armor';
      case contractAddresses.spaceVehicle.toLowerCase():
        return 'Space Vehicle';
      case contractAddresses.landVehicle.toLowerCase():
        return 'Land Vehicle';
      case contractAddresses.cosmetic.toLowerCase():
        return 'Cosmetic';
      case contractAddresses.clanBadge.toLowerCase():
        return 'Clan Badge';
      case contractAddresses.exocredit.toLowerCase():
        return 'Exocredit';
      case contractAddresses.land.toLowerCase():
        return 'Land';
      case contractAddresses.holdtelKey.toLowerCase():
        return 'Holdtel Key';
      default:
        return 'Unknown Address';
    }
  }
}
