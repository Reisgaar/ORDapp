import { Injectable } from '@angular/core';
import { ConnectionService } from '../connection/connection.service';
import { DialogService } from '../dialog.service';
import { CraftingUtilsService } from './crafting-utils.service';
import { TokenService } from '../token/token.service';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { waitForTransaction } from '@wagmi/core';
// Abi
import { default as Assembly } from 'src/app/shared/contracts/crafting/CraftingAssembly.json';
import { default as RarityController } from 'src/app/shared/contracts/crafting/CraftingRarityController.json';

@Injectable({
  providedIn: 'root'
})
export class CraftingAssemblyService {

  constructor(
    private connectionService: ConnectionService,
    private dialogService: DialogService,
    private craftingUtilsService: CraftingUtilsService,
    private tokenService: TokenService
  ) { }

  async getRarityPrice(tier: any, rarityBoosterId: number): Promise<any> {
    let price = await this.connectionService.readContract(contractAddresses.craftingRarityController, RarityController.abi, 'rarityBoosterPrices', [tier, rarityBoosterId]);
    if (typeof price !== 'string') {
      price = price.toString();
    }
    if (price !== '0') {
      return price;
    } else {
      return '';
    }
  }

  async getRarityPriceInGQ(tier: any, rarityBoosterId: number): Promise<any> {
    let price = await this.connectionService.readContract(contractAddresses.craftingAssembly, Assembly.abi, 'getRarityBoosterPriceInGQ', [tier, rarityBoosterId]);
    if (typeof price !== 'string') {
      price = price.toString();
    }
    if (price !== '0') {
      return price;
    } else {
      return '';
    }
  }

  /**
   * Starts the assembly step
   * @param materials materials needed to complete this step
   * @param poolId id of the pool
   * @param rarityBooster user rarity booster selection
   */
  async startAssembly(materials: any, poolId: number, rarityBooster: number, tier: number, matDiscount: number): Promise<any> {
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      const userAddr = this.connectionService.getWalletAddress();
      const materialsAllowed = await this.craftingUtilsService.checkAllowanceOfRequiredMaterials(materials, contractAddresses.craftingResourcesController, userAddr, matDiscount);
      let gqAllowed: boolean = true;
      console.log('Rarity booster:', rarityBooster)
      if (rarityBooster > 1) {
        const gqPrice = await this.connectionService.readContract(contractAddresses.craftingAssembly, Assembly.abi, 'getRarityBoosterPriceInGQ', [tier, rarityBooster]);
        gqAllowed = await this.tokenService.tokenApprovement(contractAddresses.craftingAssembly, userAddr, 'GQ', gqPrice);
      }
      if (materialsAllowed && gqAllowed) {
        let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'craftingAssemblyStart', '');
        try {
          const tx = await this.connectionService.writeContract(contractAddresses.craftingAssembly, Assembly.abi, 'startItemAssembly', [poolId, rarityBooster]);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('craftingAssembly', 'waitTransaction', '');
          await waitForTransaction(tx);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('craftingAssembly', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
        } catch (error: any) {
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
        }
      }
    }
  }

  /**
   * Accelerates the assembly process
   * @param poolId the id of the pool
   */
  async accelerateProcess(poolId: number): Promise<any> {
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      const userAddr = this.connectionService.getWalletAddress();
      const acceleratePrice = await this.getAccelerationPrice(userAddr, poolId);
      const allowed = await this.tokenService.tokenApprovement(contractAddresses.craftingAssembly, userAddr, 'GQ', acceleratePrice);
      const formattedValue = parseFloat(parseFloat(this.connectionService.fromWei(acceleratePrice)).toFixed(4)).toLocaleString('en-GB');
      let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'craftingAssemblySkip', formattedValue + ' GQ');
      if (allowed === true) {
        try {
          const tx = await this.connectionService.writeContract(contractAddresses.craftingAssembly, Assembly.abi, 'skipCraftingTime', [poolId]);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('craftingAssembly', 'waitTransaction', '');
          await waitForTransaction(tx);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('craftingAssembly', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
        } catch (error: any) {
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
        }
      }
    }
  }

  async getAccelerationPrice(userAddr: string, poolId: number): Promise<string> {
    return await this.connectionService.readContract(contractAddresses.craftingAssembly, Assembly.abi, 'getSkipCraftingTimePriceInGQ', [userAddr, poolId]);
  }

  /**
   * Ends the assembly process
   * @param poolId the id of the pool
   */
  async endProcess(poolId: number): Promise<any> {
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'craftingAssemblyEnd', '');
      try {
        const tx = await this.connectionService.writeContract(contractAddresses.craftingAssembly, Assembly.abi, 'claimItem', [poolId]);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('craftingAssembly', 'waitTransaction', '');
        await waitForTransaction(tx);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('craftingAssembly', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
      } catch (error: any) {
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
      }
    }
  }
}
