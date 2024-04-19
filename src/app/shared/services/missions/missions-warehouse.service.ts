import { Injectable } from '@angular/core';
import { ConnectionService } from '../connection/connection.service';
import { DialogService } from '../dialog.service';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { TokenService } from '../token/token.service';
import { waitForTransaction } from '@wagmi/core';
// Abi
import { default as Warehouse } from 'src/app/shared/contracts/missions/Warehouse.json';

@Injectable({
  providedIn: 'root'
})
export class MissionsWarehouseService {

  constructor(
    private connectionService: ConnectionService,
    private tokenService: TokenService,
    private dialogService: DialogService
  ) { }

  /**
   * Get the warehouse info of the connected user
   * @returns 
   */
  async getUserWarehouseInfo(): Promise<any> {
    const userAddr = this.connectionService.getWalletAddress();
    const warehouseInfo = await this.connectionService.readContract(contractAddresses.warehouse, Warehouse.abi, 'warehouseUsersInfo', [userAddr]);
    const warehouseLimits = await this.getWarehouseLimits();
    return {
      level: warehouseInfo.warehouseLevel,
      resources: { 
        food: { amount: warehouseInfo.food, limit: warehouseLimits[warehouseInfo.warehouseLevel].food },
        fuel: { amount: warehouseInfo.fuel, limit: warehouseLimits[warehouseInfo.warehouseLevel].fuel },
        treasures: { amount: warehouseInfo.treasures, limit: warehouseLimits[warehouseInfo.warehouseLevel].treasures }
      },
      limits: warehouseLimits
    };
  }

  /**
   * Get the resources limits for all level
   * @returns limits
   */
  async getWarehouseLimits(): Promise<any> {
    const level0 = await this.connectionService.readContract(contractAddresses.warehouse, Warehouse.abi, 'warehouseLevels', [0]);
    const level1 = await this.connectionService.readContract(contractAddresses.warehouse, Warehouse.abi, 'warehouseLevels', [1]);
    const level2 = await this.connectionService.readContract(contractAddresses.warehouse, Warehouse.abi, 'warehouseLevels', [2]);
    const level3 = await this.connectionService.readContract(contractAddresses.warehouse, Warehouse.abi, 'warehouseLevels', [3]);
    return [
      { food: level0.foodLimit, fuel: level0.fuelLimit, treasures: level0.treasuresLimit },
      { food: level1.foodLimit, fuel: level1.fuelLimit, treasures: level1.treasuresLimit },
      { food: level2.foodLimit, fuel: level2.fuelLimit, treasures: level2.treasuresLimit },
      { food: level3.foodLimit, fuel: level3.fuelLimit, treasures: level3.treasuresLimit }
    ]
  }

  /**
   * Upgrades the garage level
   * @param level the level to upgrade to
   */
  async upgradeLevel(level: number): Promise<any> {
    console.log('upgrading warehouse level');
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      const userAddr = this.connectionService.getWalletAddress();
      const prices = await this.getUpgradePrices(level);
      const allowed = await this.tokenService.tokenApprovement(contractAddresses.warehouse, userAddr, 'GQ', prices.gq);
      if (allowed === true) {
        const formattedUSD = parseFloat(parseFloat(this.connectionService.fromWei(prices.usd)).toFixed(4)).toLocaleString('en-GB');
        const formattedGQ = parseFloat(parseFloat(this.connectionService.fromWei(prices.gq)).toFixed(4)).toLocaleString('en-GB');
        let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'missionAreaImprovePrice', formattedUSD + '$ (approx. ' + formattedGQ + ' GQ)');
        try {
          const tx = await this.connectionService.writeContract(contractAddresses.warehouse, Warehouse.abi, 'improveWarehouseLevel', []);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('warehouseAreaImprove', 'waitTransaction', '');
          await waitForTransaction(tx);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('warehouseAreaImprove', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
        } catch (error: any) {
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
        }
      }
    }
  }

  /**
   * Get the prices (GQ & USD) of the upgrade to given level
   * @param level 
   * @returns object with prices on GQ & USD
   */
  async getUpgradePrices(level: number): Promise<any> {
    const levelData = await this.connectionService.readContract(contractAddresses.warehouse, Warehouse.abi, 'warehouseLevels', [level]);
    const gqPrice = await this.connectionService.readContract(contractAddresses.warehouse, Warehouse.abi, 'getImproveWarehouseLevelPrice', [level]);
    return {
      usd: levelData.price,
      gq: gqPrice
    };
  }
}
