import { Injectable } from '@angular/core';
import { DialogService } from '../dialog.service';
import { TokenService } from '../token/token.service';
import { ConnectionService } from '../connection/connection.service';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { waitForTransaction } from '@wagmi/core';
// Abi
import { default as Bank } from 'src/app/shared/contracts/missions/Bank.json';

@Injectable({
  providedIn: 'root'
})
export class MissionsBankService {

  constructor(
    private connectionService: ConnectionService,
    private tokenService: TokenService,
    private dialogService: DialogService
  ) { }

  /**
   * Get array with exchange window possible durations
   * @returns 
   */
  async getExchangeWindowDurations(): Promise<any> {
    const windowDurations = await this.connectionService.readContract(contractAddresses.bank, Bank.abi, 'getExchangeWindowDurations', []);
    return windowDurations.map(window => parseInt(window));
  }

  /**
   * Get the treasure/GQ exchange rate
   * @returns 
   */
  async getExchangeRate(): Promise<string> {
    return await this.connectionService.readContract(contractAddresses.bank, Bank.abi, 'getTreasureGQExchangeRate', []);
  }

  /**
   * Get the fee percentage for exchange action
   * @returns 
   */
  async getExchangeFee(): Promise<number> {
    const fee = await this.connectionService.readContract(contractAddresses.bank, Bank.abi, 'exchangeFee', []);
    return parseInt(fee) / 10000;
  }

  /**
   * Get the timestamp when exchange window opens for the user
   * @returns 
   */
  async getUserExchangeWindowStart(): Promise<string> {
    const userAddr = this.connectionService.getWalletAddress();
    return await this.connectionService.readContract(contractAddresses.bank, Bank.abi, 'userExchangeWindowStart', [userAddr]);
  }

  /**
   * Get the price to reroll the window time
   * @returns 
   */
  async getExchangeWindowRerollPrice(): Promise<string> {
    return await this.connectionService.readContract(contractAddresses.bank, Bank.abi, 'getExchangeWindowRerollPrice', []);
  }

  /**
   * Get the maximum amount of exchangeable treasures on a window
   * @returns 
   */
  async getTreasuresMaxAmountPerWindow(): Promise<number> {
    const maxAmount = await this.connectionService.readContract(contractAddresses.bank, Bank.abi, 'treasuresMaxAmountPerWindow', []);
    return parseInt(maxAmount);
  }

  /**
   * Reroll the window time
   * @returns 
   */
  async rerollExchangeWindow(): Promise<any> {
    console.log('rerolling window');
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      const userAddr = this.connectionService.getWalletAddress();
      const rerollPrice = await this.getRerollPrice();
      const allowed = await this.tokenService.tokenApprovement(contractAddresses.bank, userAddr, 'GQ', rerollPrice);
      const formattedValue = parseFloat(parseFloat(this.connectionService.fromWei(rerollPrice)).toFixed(4)).toLocaleString('en-GB');
      let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'rerollWindowConfirm', formattedValue + ' GQ');
      if (allowed === true) {
        try {
          const tx = await this.connectionService.writeContract(contractAddresses.bank, Bank.abi, 'rerollExchangeWindow', []);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('rerollWindow', 'waitTransaction', '');
          await waitForTransaction(tx);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('rerollWindow', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
          return true;
        } catch (error: any) {
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
          return false;
        }
      }
    }
  }
  
  /**
   * Get the price to reroll
   * @returns price
   */
  async getRerollPrice(): Promise<string> {
    return await this.connectionService.readContract(contractAddresses.bank, Bank.abi, 'rerollPrice', []);
  }

  /**
   * Exchange given treasures amount for GQ
   * @param treasuresAmount 
   * @returns 
   */
  async exchange(treasuresAmount: number): Promise<any> {
    console.log('exchanging treasures');
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'treasureExchangeConfirm', '');
      try {
        const tx = await this.connectionService.writeContract(contractAddresses.bank, Bank.abi, 'exchange', [treasuresAmount]);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('treasureExchange', 'waitTransaction', '');
        await waitForTransaction(tx);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('treasureExchange', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
        return true;
      } catch (error: any) {
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
        return false;
      }
    }
  }
}
