import { Injectable } from '@angular/core';
import { DialogService } from '../dialog.service';
import { ConnectionService } from '../connection/connection.service';
import { TokenService } from '../token/token.service';
import { LootboxService } from './lootbox.service';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { waitForTransaction } from '@wagmi/core';
// Abi
import { default as LootBox } from 'src/app/shared/contracts/lootbox/LootBox.json';
import { default as MisteryBox } from 'src/app/shared/contracts/lootbox/MisteryBox.json';

/**
 * Service to manage all functions related to lootbox buying with smart contract
 */
@Injectable({
  providedIn: 'root'
})
export class BuyLootboxService {

  constructor(
    private connectionService: ConnectionService,
    private tokenService: TokenService,
    private lootboxService: LootboxService,
    private dialogService: DialogService
  ) { }

  /**
   * Starts the process to buy a lootbox
   * @param {number} tier : selected lootbox tier
   * @param {number} paymentCoin : 0 for BUSD, 1 for SCK
   */
  public async startBuyLootbox(tier: number, paymentCoin: number): Promise<any> {
    let dialogRef: any;
    const walletConnected = await this.connectionService.syncAccount();
    try {
      if (walletConnected) {
        dialogRef = this.dialogService.openInfoDialog(4, '', paymentCoin, tier);
        const userAddr = this.connectionService.getWalletAddress();
        await this.setLootboxSlippage(dialogRef, tier, paymentCoin, userAddr);
      }
    } catch (error: any) {
      this.dialogService.openRegularInfoDialog('error', error.message, '');
    }
  }

  /**
   * Sets the slippage and buy the lootbox
   * @param {any} dialogRef : dialog to manage during the process
   * @param {number} tier : selected lootbox tier
   * @param {number} paymentCoin : 0 for BUSD, 1 for SCK
   * @param {string} userAddr : user wallet address
   * @param {boolean} walletConnected : true if is connected
   */
  async setLootboxSlippage(dialogRef: any, tier: number, paymentCoin: number, userAddr: string): Promise<void> {
    // Get price
    const price = await this.lootboxService.getLootboxPrice(tier, paymentCoin);
    // Open dialog while transaction
    dialogRef.close();
    dialogRef = this.dialogService.openInfoDialog(2, price, paymentCoin, tier);
    dialogRef.afterClosed().subscribe(async (res: any) => {
      // res contain the amount of the slippage the user is ready to pay
      if (res) {
        console.log(res);
        const maxAmount = this.connectionService.toWei(res.toString());
        const contractIsApproved = await this.tokenService.tokenApprovement(contractAddresses.lootbox, userAddr, paymentCoin, maxAmount);
        if (contractIsApproved && res !== undefined && res !== null) {
          this.buyLootbox(price, paymentCoin, tier, maxAmount);
        } else {
          dialogRef.close();
        }
      }
    });
  }

  /**
   * Sets the slippage and buy the lootbox
   * @param {string} price : the lootbox price
   * @param {number} tier : selected lootbox tier
   * @param {number} paymentCoin : 0 for BUSD, 1 for SCK
   * @param {string} maxAmount : the max amount that user can pay
   */
  async buyLootbox(price: string, paymentCoin: number, tier: number, maxAmount: string): Promise<any> {
    let dialogRef = this.dialogService.openInfoDialog(6, price, paymentCoin, tier);
    try {
      const args = [tier, paymentCoin, maxAmount]
      const tx = await this.connectionService.writeContract(contractAddresses.lootbox, LootBox.abi, 'buyLootBox', args);
      dialogRef.close();
      dialogRef = this.dialogService.openRegularInfoDialog('buyLootbox', 'waitTransaction', '');
      const res = await waitForTransaction(tx);
      this.connectionService.ethers.getTramsa
      console.log(res);
      dialogRef.close();
      this.dialogService.openLootboxRewards(res);
    } catch (error: any) {
      dialogRef.close();
      console.log(error);
      this.dialogService.openRegularInfoDialog('error', error.message, '');
    }
  }

  /**
   * Starts process to buy a mystery box
   */
  async startBuyMystery(): Promise<void> {
    const walletConnected = await this.connectionService.isWalletConnected();
    let dialogRef: any;
    if (walletConnected) {
      try {
        dialogRef = this.dialogService.openInfoDialog(4, '', 0, 0);
        const userAddr = this.connectionService.getWalletAddress();
        const boxSckPrice = await this.lootboxService.getMisteryBoxPrice();
        const contractIsApproved = await this.tokenService.tokenApprovement(contractAddresses.mysteryBox, userAddr, 1, boxSckPrice);
        if (contractIsApproved) {
          this.finishBuyMystery(dialogRef, userAddr);
        } else {
          dialogRef.close();
        }
      } catch (error: any) {
        this.dialogService.openRegularInfoDialog('error', error.message, '');
      }
    }
  }

  /**
   * Finishes process of mystery box buying
   * @param {any} dialogRef : dialog to manage during the process
   * @param {string} userAddr : user wallet address
   * @param {boolean} walletConnected : true if is connected
   */
  async finishBuyMystery(dialogRef: any, userAddr: any): Promise<void> {
    // Open dialog while transaction
    dialogRef.close();
    const sckPrice = await this.lootboxService.getMisteryBoxPrice();
    dialogRef = this.dialogService.openInfoDialog(2, sckPrice, 1, 0);
    dialogRef.afterClosed().subscribe(async (res: any) => {
      console.log(res);
      if (res === true) {
        dialogRef = this.dialogService.openInfoDialog(6, sckPrice, 1, 0);
        try {
          const tx = await this.connectionService.writeContract(contractAddresses.mysteryBox, MisteryBox.abi, 'buyMisteryBox', []);
          dialogRef.close();
          dialogRef = this.dialogService.openRegularInfoDialog('buyLootbox', 'waitTransaction', '');
          const res = await waitForTransaction(tx);
          dialogRef.close();
          dialogRef = this.dialogService.openRegularInfoDialog('buyLootbox', 'mysteryReward', '');
        } catch (error: any) {
          this.dialogService.openRegularInfoDialog('error', error.message, '');
        }
      }
    });
  }

  /**
   * Buy a free lootbox with whitelist
   */
  async buyFreeWhiteList(): Promise<void> {
    let dialogRef = this.dialogService.openInfoDialog(4, '', 0, 0);
    try {
      const userAddr = this.connectionService.getWalletAddress();
      const tx = await this.connectionService.writeContract(contractAddresses.lootbox, LootBox.abi, 'lootBoxFreeWhiteList', [userAddr]);
      dialogRef.close();
      dialogRef = this.dialogService.openRegularInfoDialog('buyLootbox', 'waitTransaction', '');
      const res = await waitForTransaction(tx);
      console.log(res);
      dialogRef.close();
      this.dialogService.openLootboxRewards(res);
    } catch (error: any) {
      dialogRef.close();
      this.dialogService.openRegularInfoDialog('error', error.message, '');
    }
  }

  /**
   * Buy a discounted lootbox with whitelist
   */
  async buyDiscountWhiteList(): Promise<void> {
    let dialogRef = this.dialogService.openInfoDialog(4, '', 0, 0);
    try {
      const userAddr = this.connectionService.getWalletAddress();
      const discountMap = await this.connectionService.readContract(contractAddresses.lootbox, LootBox.abi, 'mapOfDiscountWhiteList', [userAddr]);
      const allowAmount = await this.connectionService.readContract(contractAddresses.lootbox, LootBox.abi, 'getPriceByTier', [discountMap.tier]);
      const contractIsApproved = await this.tokenService.tokenApprovement(contractAddresses.lootbox, userAddr, 0, allowAmount);
      if (contractIsApproved) {
        const tx = await this.connectionService.writeContract(contractAddresses.lootbox, LootBox.abi, 'lootBoxDiscountWhiteList', [userAddr]);
        dialogRef.close();
        dialogRef = this.dialogService.openRegularInfoDialog('buyLootbox', 'waitTransaction', '');
        const res = await waitForTransaction(tx);
        console.log(res);
        dialogRef.close();
        this.dialogService.openLootboxRewards(res);
      } else {
        dialogRef.close();
      }
    } catch (error: any) {
      dialogRef.close();
      this.dialogService.openRegularInfoDialog('error', error.message, '');
    }
  }
}
