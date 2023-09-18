import { Pipe, PipeTransform } from '@angular/core';
import { contractAddresses } from '../constants/contractAddresses';

/**
 * Pipe to change contract adress to ticker
 */
@Pipe({name: 'materialFromAddress'})
export class MaterialFromAddressPipe implements PipeTransform {

  /**
   * Changes an erc20 contract address for it's ticker
   * @param {string} value : erc20 contract address
   * @returns {string} : the ticker of the erc20
   */
  transform(value: string): string {
    switch (value.toLowerCase()) {
      case contractAddresses.acetylene.toLowerCase():
        return 'acetylene';
      case contractAddresses.aluminium.toLowerCase():
        return 'aluminium';
      case contractAddresses.argon.toLowerCase():
        return 'argon';
      case contractAddresses.carbon.toLowerCase():
        return 'carbon';
      case contractAddresses.chromium.toLowerCase():
        return 'chromium';
      case contractAddresses.cobalt.toLowerCase():
        return 'cobalt';
      case contractAddresses.copper.toLowerCase():
        return 'copper';
      case contractAddresses.helium.toLowerCase():
        return 'helium';
      case contractAddresses.hydrogen.toLowerCase():
        return 'hydrogen';
      case contractAddresses.iron.toLowerCase():
        return 'iron';
      case contractAddresses.nickel.toLowerCase():
        return 'nickel';
      case contractAddresses.methane.toLowerCase():
        return 'methane';
      case contractAddresses.oxygen.toLowerCase():
        return 'oxygen';
      case contractAddresses.plutonium.toLowerCase():
        return 'plutonium';
      case contractAddresses.silicon.toLowerCase():
        return 'silicon';
      case contractAddresses.vanadium.toLowerCase():
        return 'vanadium';
      default:
        return '';
    }
  }
}
