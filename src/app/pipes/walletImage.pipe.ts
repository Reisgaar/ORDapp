import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to get wallet first number
 */
@Pipe({name: 'walletFirstNum'})
export class WalletFirstNumPipe implements PipeTransform {

    /**
     * Gets the first number of given wallet address
     * @param {string} wallet : the wallet address
     * @returns {number} : wallet first number
     */
    transform(wallet: any): number {
        let num = 0;
        for (let i = 1; i < wallet.length; i++) {
          if (!isNaN(wallet.charAt(i))) {
            num = parseInt(wallet.charAt(i), 0);
            break;
          }
        }
        return num;
    }
}
