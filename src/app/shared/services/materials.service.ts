import { Injectable } from '@angular/core';
import { contractAddresses } from 'src/app/constants/contractAddresses';

@Injectable({
  providedIn: 'root'
})
export class MaterialsService {

  constructor() { }

    /**
     * Changes an erc20 contract address for it's name
     * @param {string} value : erc20 contract address
     * @returns {string} : the ticker of the erc20
     */
    materialAddressToName(value: string): string {
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

  /**
   * Changes an erc20 contractAddress/name for it's ticker
   * @param {string} value : erc20 contract address
   * @returns {string} : the ticker of the erc20
   */
  materialToTicker(value: string): string {
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
