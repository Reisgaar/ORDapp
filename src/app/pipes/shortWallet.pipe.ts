import { Pipe, PipeTransform } from '@angular/core';
import { contractAddresses } from '../constants/contractAddresses';

/**
 * Pipe to shorten a wallet to format '0xXXX...XXX'
 */
@Pipe({name: 'shortWallet'})
export class ShortWalletPipe implements PipeTransform {

    constructor() {}

    /**
     *
     * @param {string} value : wallet address
     * @returns {string} : shortened wallet
     */
    transform(value: string): string {
      if (value.toLowerCase() === contractAddresses.craftingCreation.toLowerCase() || value.toLowerCase() === contractAddresses.craftingStyling.toLowerCase() || value.toLowerCase() === contractAddresses.craftingAssembly.toLowerCase()) {
        return 'Crafting';
      } else if (value === '0x0000000000000000000000000000000000000000') {
        return '';
      } else {
        return value.slice(0, 5) + '...' + value.slice(-3);
      }
    }
}
