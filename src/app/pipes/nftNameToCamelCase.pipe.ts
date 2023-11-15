import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to change weapon name to it's camel case
 */
@Pipe({name: 'nftNameToCamelCase'})
export class NftNameToCamelCase implements PipeTransform {

  /**
   * Changes the weapon name to camel case
   * @param {string} value : the name string
   * @returns {string} : the name on camelCase
   */
  transform(value: string): string {
    switch (value.toLowerCase()) {
      case 'blade':
        return 'blade';
      case 'blunt':
        return 'blunt';
      case 'knife':
        return 'knife';
      case 'pistol':
        return 'pistol';
      case 'revolver':
        return 'revolver';
      case 'shotgun':
        return 'shotgun';
      case 'repeater shotgun':
        return 'repeaterShotgun';
      case 'assault smg':
        return 'assaultSMG';
      case 'assault smg':
        return 'assaultSmg';
      case 'high rate smg':
        return 'highRateSMG';
      case 'assault rifle':
        return 'assaultRifle';
      case 'light machinegun':
        return 'lightMachinegun';
      case 'sniper rifle':
        return 'sniperRifle';
      case 'precision rifle':
        return 'precisionRifle';
      case 'helmet':
        return 'helmet';
      case 'chest':
        return 'chest';
      case 'shoulders':
        return 'shoulders';
      case 'forearms':
        return 'forearms';
      case 'arms':
        return 'arms';
      case 'gloves':
        return 'gloves';
      case 'legs':
        return 'legs';
      case 'kneepads':
        return 'kneepads';
      case 'boots':
        return 'boots';
      default:
        return value;
    }
  }
}
