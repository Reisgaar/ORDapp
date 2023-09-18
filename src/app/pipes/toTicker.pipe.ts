import { Pipe, PipeTransform } from '@angular/core';
import { contractAddresses } from '../constants/contractAddresses';

/**
 * Pipe to change contract adress to ticker
 */
@Pipe({name: 'toTicker'})
export class ToTickerPipe implements PipeTransform {

  /**
   * Changes an erc20 contract address for it's ticker
   * @param {string} value : erc20 contract address
   * @returns {string} : the ticker of the erc20
   */
  transform(value: string): string {
    switch (value.toLowerCase()) {
      case contractAddresses.sck.toLowerCase():
        return 'SCK';
      case contractAddresses.gq.toLowerCase():
        return 'GQ';
      case contractAddresses.busd.toLowerCase():
        return 'BUSD';
      case contractAddresses.bnb.toLowerCase():
        return 'BNB';
      default:
        return '';
    }
  }
}
