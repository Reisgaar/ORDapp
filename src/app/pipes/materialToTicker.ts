import { Pipe, PipeTransform } from '@angular/core';
import { contractAddresses } from '../constants/contractAddresses';

/**
 * Pipe to change contract adress to ticker
 */
@Pipe({name: 'materialToTicker'})
export class MaterialToTickerPipe implements PipeTransform {

  /**
   * Changes an erc20 contract address for it's ticker
   * @param {string} value : erc20 contract address
   * @returns {string} : the ticker of the erc20
   */
  transform(value: string): string {
    switch (value.toLowerCase()) {
      case 'acetylene':
      case contractAddresses.acetylene.toLowerCase():
        return 'ACE';
      case 'aluminium':
      case contractAddresses.aluminium.toLowerCase():
        return 'ALU';
      case 'argon':
      case contractAddresses.argon.toLowerCase():
        return 'ARG';
      case 'carbon':
      case contractAddresses.carbon.toLowerCase():
        return 'CAR';
      case 'chromium':
      case contractAddresses.chromium.toLowerCase():
        return 'CHR';
      case 'cobalt':
      case contractAddresses.cobalt.toLowerCase():
        return 'COB';
      case 'copper':
      case contractAddresses.copper.toLowerCase():
        return 'COP';
      case 'helium':
      case contractAddresses.helium.toLowerCase():
        return 'HEL';
      case 'hydrogen':
      case contractAddresses.hydrogen.toLowerCase():
        return 'HYD';
      case 'iron':
      case contractAddresses.iron.toLowerCase():
        return 'IRO';
      case 'nickel':
      case contractAddresses.nickel.toLowerCase():
        return 'NIC';
      case 'methane':
      case contractAddresses.methane.toLowerCase():
        return 'MET';
      case 'oxygen':
      case contractAddresses.oxygen.toLowerCase():
        return 'OXY';
      case 'plutonium':
      case contractAddresses.plutonium.toLowerCase():
        return 'PLU';
      case 'silicon':
      case contractAddresses.silicon.toLowerCase():
        return 'SIL';
      case 'vanadium':
      case contractAddresses.vanadium.toLowerCase():
        return 'VAN';
      default:
        return '';
    }
  }
}
