import { Injectable } from '@angular/core';
import { ConnectionService } from '../connection/connection.service';
import { DialogService } from '../dialog.service';
import { CraftingUtilsService } from './crafting-utils.service';
import { TokenService } from '../token/token.service';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { waitForTransaction } from '@wagmi/core';
// Abi
import { default as Assembly } from 'src/app/shared/contracts/crafting/CraftingAssembly.json';
import { default as Rarity } from 'src/app/shared/contracts/crafting/CraftingRarityController.json';

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
    let price = await this.connectionService.readContract(contractAddresses.craftingRarityController, Rarity.abi, 'rarityBoosterPrices', [tier, rarityBoosterId]);
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
  async startAssembly(materials: any, poolId: number, rarityBooster: number): Promise<any> {
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      const userAddr = this.connectionService.getWalletAddress();
      const materialsAllowed = await this.craftingUtilsService.checkAllowanceOfRequiredMaterials(materials, contractAddresses.craftingResourcesController, userAddr);
      if (materialsAllowed) {
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
      // TODO: Set price to acceleration process
      const allowed = await this.tokenService.tokenApprovement(contractAddresses.craftingAssembly, userAddr, 'GQ', '10000000000000000000000000000000000000000000000000');
      let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'craftingAssemblySkip', '');
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
