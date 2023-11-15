import { Pipe, PipeTransform } from '@angular/core';
import { SpeciesService } from '../shared/services/species/species.service';

/**
 * Pipe to get wallet first number
 */
@Pipe({name: 'walletSpecie'})
export class WalletSpeciePipe implements PipeTransform {

  constructor(private speciesService: SpeciesService) {}

  /**
   * Gets the specie of the wallet address
   * @param {string} wallet : the wallet address
   * @returns {string} : specie name
   */
  async transform(wallet: any): Promise<string> {
    try {
      let specie = (await this.speciesService.getWalletSpecie(wallet)).toLowerCase();
      if (specie && specie !== '') {
        return specie;
      } else {
        return '';
      }
    } catch (error) {
      return '';
    }
  }
}
