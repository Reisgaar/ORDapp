import { Injectable } from '@angular/core';
import { ConnectionService } from '../connection/connection.service';
import { contractAddresses } from 'src/app/constants/contractAddresses';
// Abi
import { default as LootBox } from 'src/app/shared/contracts/lootbox/LootBox.json';
import { default as MisteryBox } from 'src/app/shared/contracts/lootbox/MisteryBox.json';
import { default as LootboxOraclePrices } from 'src/app/shared/contracts/lootbox/LootboxOraclePrices.json';

/**
 * Service to manage all functions related to lootbox-info from smart contract
 */
@Injectable({
  providedIn: 'root'
})
export class LootboxService {

  constructor(
    private connectionService: ConnectionService
  ) { }

  /**
   * Gets actual price in BUSD or SCK
   * @param {number} tier : selected lootbox tier
   * @param {number} paymentCoin : 0 for BUSD, 1 for SCK
   * @returns {any} : the price of the lootbox
   */
  async getLootboxPrice(tier: number, paymentCoin: number): Promise<any> {
    try {
      let price = await this.connectionService.readContract(contractAddresses.lootbox, LootBox.abi, 'getPriceByTier', [tier]);
      // If payment in SCK, change price value
      if (paymentCoin === 1) {
        let newPrice = await this.connectionService.readContract(contractAddresses.lootboxOraclePrices, LootboxOraclePrices.abi, 'getAmountsOutByBUSD', [price, contractAddresses.sck]);
        newPrice = this.connectionService.fromWei(newPrice);
        price = parseFloat(newPrice) / 2;
        price = this.connectionService.toWei(price.toString());
      }
      return price;
    } catch (error: any) {
      console.log(error);
    }
  }

  /**
   * Gets actual price of the mystery box
   * @returns {any} : the price of the lootbox
   */
  async getMisteryBoxPrice(): Promise<any> {
    try {
      let price = await this.connectionService.readContract(contractAddresses.lootboxOraclePrices, LootboxOraclePrices.abi, 'getAmountsOutByBUSD', ['3000000000000000000', contractAddresses.sck]);
      price = this.connectionService.fromWei(price);
      price = parseFloat(price);
      price = this.connectionService.toWei(price.toString());
      return price;
    } catch (error: any) { }
  }

  /**
   * Gets the lootbox total supply by Tier
   * @param {number} tier : selected lootbox tier
   * @returns {any} : the total supply
   */
  async getSupplyByTier(tier: number): Promise<any> {
    try {
      if(tier !== 0) {
        return this.connectionService.readContract(contractAddresses.lootbox, LootBox.abi, 'getRemainingSupplyByTier', [tier]);
      } else {
        return this.connectionService.readContract(contractAddresses.mysteryBox, MisteryBox.abi, 'supply', []);
      }
    } catch (error: any) { }
  }

  /**
   * Get the map of the discount whitelist
   * @returns {any} : the discount whitelist
   */
  async getDiscountWhiteList(): Promise<any> {
    try {
      return await this.connectionService.readContract(contractAddresses.lootbox, LootBox.abi, 'mapOfDiscountWhiteList', [this.connectionService.getWalletAddress()]);
    } catch (error: any) {}
  }

  /**
   * Get the map of the free whitelist
   * @returns {any} : the free whitelist
   */
  async getFreeWhiteList(): Promise<any> {
    try {
      return await this.connectionService.readContract(contractAddresses.lootbox, LootBox.abi, 'mapOfFreeWhiteList', [this.connectionService.getWalletAddress()]);
    } catch (error: any) {}
  }

}
