import { Injectable } from '@angular/core';
import { ConnectionService } from '../connection/connection.service';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { waitForTransaction } from '@wagmi/core';
import { DialogService } from '../dialog.service';
import { CraftingUtilsService } from './crafting-utils.service';
import { TokenService } from '../token/token.service';
// Abi
import { default as Styling } from 'src/app/shared/contracts/crafting/CraftingStyling.json';

@Injectable({
  providedIn: 'root'
})
export class CraftingStylingService {

  constructor(
    private connectionService: ConnectionService,
    private dialogService: DialogService,
    private craftingUtilsService: CraftingUtilsService,
    private tokenService: TokenService
  ) { }

  /**
   * Get price of the given pool
   * @param tier tier of the item
   * @param addOnAmount amount of add-on pieces
   * @returns price of the addOns
   */
  async getPoolAddOnPrice(tier: number, addOnAmount: number): Promise<any> {
    if (addOnAmount > 0) {
      let price = await this.connectionService.readContract(contractAddresses.craftingStyling, Styling.abi, 'optionalWeaponPiecePrices', [tier]);
      price = this.connectionService.fromWei(price);
      return (parseFloat(price) * addOnAmount).toString();
    } else {
      return '';
    }
  }

  /**
   * Get price of the given pool in GQ
   * @param tier tier of the item
   * @param addOnAmount amount of add-on pieces
   * @returns price of the addOns
   */
  async getPoolAddOnPriceInGQ(tier: number, addOnAmount: number): Promise<any> {
    if (addOnAmount > 0) {
      let price = await this.connectionService.readContract(contractAddresses.craftingStyling, Styling.abi, 'getOptionalWeaponPiecePriceInGQ', [tier]);
      price = this.connectionService.fromWei(price);
      return (parseFloat(price) * addOnAmount).toString();
    } else {
      return '';
    }
  }

  /**
   * Starts the styling step
   * @param materials materials needed to complete this step
   * @param poolId id of the pool
   * @param aesthetics user aesthetic selection
   */
  async startStyling(materials: any, poolId: number, aesthetics: any[], tier: number, addOnAmount: number, matDiscount: number): Promise<any> {
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      const userAddr = this.connectionService.getWalletAddress();
      const materialsAllowed = await this.craftingUtilsService.checkAllowanceOfRequiredMaterials(materials, contractAddresses.craftingResourcesController, userAddr, matDiscount);
      let gqAllowed: boolean = true;
      if (addOnAmount > 0) {
        const gqPrice = this.connectionService.toWei(await this.getPoolAddOnPriceInGQ(tier, addOnAmount));
        gqAllowed = await this.tokenService.tokenApprovement(contractAddresses.craftingStyling, userAddr, 'GQ', gqPrice);
      }
      if (materialsAllowed && gqAllowed) {
        let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'craftingStylingStart', '');
        try {
          const tx = await this.connectionService.writeContract(contractAddresses.craftingStyling, Styling.abi, 'startItemStyling', [poolId, aesthetics]);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('craftingStyling', 'waitTransaction', '');
          await waitForTransaction(tx);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('craftingStyling', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
        } catch (error: any) {
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
        }
      }
    }
  }

  /**
   * Accelerates the styling process
   * @param poolId the id of the pool
   */
  async accelerateProcess(poolId: number): Promise<any> {
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      const userAddr = this.connectionService.getWalletAddress();
      const acceleratePrice = await this.getAccelerationPrice(userAddr, poolId);
      const allowed = await this.tokenService.tokenApprovement(contractAddresses.craftingStyling, userAddr, 'GQ', acceleratePrice);
      const formattedValue = parseFloat(parseFloat(this.connectionService.fromWei(acceleratePrice)).toFixed(4)).toLocaleString('en-GB');
      let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'craftingStylingSkip', formattedValue + ' GQ');
      if (allowed === true) {
        try {
          const tx = await this.connectionService.writeContract(contractAddresses.craftingStyling, Styling.abi, 'skipCraftingTime', [poolId]);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('craftingStyling', 'waitTransaction', '');
          await waitForTransaction(tx);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('craftingStyling', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
        } catch (error: any) {
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
        }
      }
    }
  }

  async getAccelerationPrice(userAddr: string, poolId: number): Promise<string> {
    return await this.connectionService.readContract(contractAddresses.craftingStyling, Styling.abi, 'getSkipCraftingTimePriceInGQ', [userAddr, poolId]);
  }

  /**
   * Ends the styling process
   * @param poolId the id of the pool
   */
  async endProcess(poolId: number): Promise<any> {
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'craftingStylingEnd', '');
      try {
        const tx = await this.connectionService.writeContract(contractAddresses.craftingStyling, Styling.abi, 'sendToAssembly', [poolId]);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('craftingStyling', 'waitTransaction', '');
        await waitForTransaction(tx);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('craftingStyling', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
      } catch (error: any) {
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
      }
    }
  }
}
