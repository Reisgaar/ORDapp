import { Injectable } from '@angular/core';
import { ConnectionService } from '../connection/connection.service';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { waitForTransaction } from '@wagmi/core';
import { DialogService } from '../dialog.service';
import { CraftingUtilsService } from './crafting-utils.service';
import { TokenService } from '../token/token.service';
// Abi
import { default as Creation } from 'src/app/shared/contracts/crafting/CraftingCreation.json';

@Injectable({
  providedIn: 'root'
})
export class CraftingCreationService {

  constructor(
    private connectionService: ConnectionService,
    private dialogService: DialogService,
    private craftingUtilsService: CraftingUtilsService,
    private tokenService: TokenService
  ) { }

  /**
   * Get price of the given pool
   * @param pool number of the pool
   * @returns price of the pool
   */
  async getPoolPrice(pool: number): Promise<any> {
    let price = await this.connectionService.readContract(contractAddresses.craftingCreation, Creation.abi, 'poolPrices', [pool]);
    if (price !== '0') { price = this.connectionService.fromWei(price); }
    return price.toString();
  }

  /**
   * Get price of the given pool in GQ
   * @param pool number of the pool
   * @returns price of the pool
   */
  async getPoolPriceInGQ(pool: number): Promise<any> {
    let price = await this.connectionService.readContract(contractAddresses.craftingCreation, Creation.abi, 'getPoolPriceInGQ', [pool]);
    if (price !== '0') { price = this.connectionService.fromWei(price); }
    return price.toString();
  }

  /**
   * Starts the creation step
   * @param materials materials needed to complete this step
   * @param poolId id of the pool
   * @param nftType the type of item to create (armor 0, weapon 1)
   * @param itemId the id of the item (type of weapon or type of armor)
   * @param tier the tier of the item to create
   * @param element the element of the item to create (bullet 0, laser 1, metal 2)
   */
  async startCrafting(materials: any, poolId: number, nftType: number, itemId: number, tier: number, element: number, matDiscount: number): Promise<any> {
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      const userAddr = this.connectionService.getWalletAddress();
      const gqPrice = await this.connectionService.readContract(contractAddresses.craftingCreation, Creation.abi, 'getPoolPriceInGQ', [poolId]);
      const gqAllowed = await this.tokenService.tokenApprovement(contractAddresses.craftingCreation, userAddr, 'GQ', gqPrice);
      if (!gqAllowed) { return; }
      const materialsAllowed = await this.craftingUtilsService.checkAllowanceOfRequiredMaterials(materials, contractAddresses.craftingResourcesController, userAddr, matDiscount);
      if (materialsAllowed) {
        let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'craftingCreationStart', '');
        try {
          const fee = await this.connectionService.readContract(contractAddresses.craftingCreation, Creation.abi, 'getCraftingFeeInBNB', []);
          const tx = await this.connectionService.writeContract(contractAddresses.craftingCreation, Creation.abi, 'createItem', [poolId, nftType, itemId, tier, element], fee);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('craftingCreation', 'waitTransaction', '');
          await waitForTransaction(tx);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('craftingCreation', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
          this.craftingUtilsService.setUserCraftedAmount(userAddr);
        } catch (error: any) {
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
        }
      }
    }
  }

  /**
   * Accelerates the creation process
   * @param poolId the id of the pool
   */
  async accelerateProcess(poolId: number): Promise<any> {
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      const userAddr = this.connectionService.getWalletAddress();
      const acceleratePrice = await this.getAccelerationPrice(userAddr, poolId);
      const allowed = await this.tokenService.tokenApprovement(contractAddresses.craftingCreation, userAddr, 'GQ', acceleratePrice);
      const formattedValue = parseFloat(parseFloat(this.connectionService.fromWei(acceleratePrice)).toFixed(4)).toLocaleString('en-GB');
      let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'craftingCreationSkip',formattedValue + ' GQ');
      if (allowed === true) {
        try {
          const tx = await this.connectionService.writeContract(contractAddresses.craftingCreation, Creation.abi, 'skipCraftingTime', [poolId]);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('craftingCreation', 'waitTransaction', '');
          await waitForTransaction(tx);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('craftingCreation', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
        } catch (error: any) {
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
        }
      }
    }
  }

  async getAccelerationPrice(userAddr: string, poolId: number): Promise<string> {
    return await this.connectionService.readContract(contractAddresses.craftingCreation, Creation.abi, 'getSkipCraftingTimePriceInGQ', [userAddr, poolId]);
  }

  /**
   * Ends the creation process
   * @param poolId the id of the pool
   */
  async endProcess(poolId: number): Promise<any> {
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'craftingCreationEnd', '');
      try {
        const tx = await this.connectionService.writeContract(contractAddresses.craftingCreation, Creation.abi, 'sendToStyling', [poolId]);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('craftingCreation', 'waitTransaction', '');
        await waitForTransaction(tx);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('craftingCreation', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
      } catch (error: any) {
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
      }
    }
  }
}
