import { Injectable } from '@angular/core';
import { DialogService } from '../dialog.service';
import { ConnectionService } from '../connection/connection.service';
import { TokenService } from '../token/token.service';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { waitForTransaction } from '@wagmi/core';
// Abi
import { default as StakingVote } from 'src/app/shared/contracts/governance/StakingVote.json';

/**
 * Service to manage all functions related to GQ-VP staking smart contract
 */
@Injectable({
  providedIn: 'root'
})
export class StakeService {

  constructor(
    private connectionService: ConnectionService,
    private tokenService: TokenService,
    private dialogService: DialogService
  ) {}

  /**
   * Gets the info of the pool
   * @param {number} pool : number of the pool
   * @returns {any} : object with pool info
   */
  async getPoolInfo(pool: number): Promise<any> {
    return await this.connectionService.readContract(contractAddresses.stakingVote, StakingVote.abi, 'poolInfo', [pool]);
  }

  /**
   * Gets the pending vote of the connected user
   * @param {number} pool : number of the pool
   * @returns {any} : the pending vote token
   */
  async getPendingVoteToken(pool: number): Promise<any> {
    const userAddr = this.connectionService.getWalletAddress();
    return await this.connectionService.readContract(contractAddresses.stakingVote, StakingVote.abi, 'pendingVoteToken', [pool, userAddr]);
  }

  /**
   * Gets the user info related to the pool
   * @param {number} pool : number of the pool
   * @returns {any} : user info of the pool
   */
  async getUserInfo(pool: number): Promise<any> {
    const userAddr = this.connectionService.getWalletAddress();
    return await this.connectionService.readContract(contractAddresses.stakingVote, StakingVote.abi, 'userInfo', [pool, userAddr]);
  }

  /**
   *Gets the total alloc point
   * @returns {number} : the alloc point
   */
  async getTotalAllocPoint(): Promise<number> {
    const totalAllocPoint = await this.connectionService.readContract(contractAddresses.stakingVote, StakingVote.abi, 'totalAllocPoint', []);
    return parseFloat(totalAllocPoint);
  }

  /**
   * Gets vote token per block
   * @returns {number} : the vote token per block
   */
  async getVoteTokenPerBlock(): Promise<number> {
    const tap = await this.connectionService.readContract(contractAddresses.stakingVote, StakingVote.abi, 'voteTokenPerBlock', []);
    const totalAllocPoint = this.connectionService.fromWei(tap);
    return parseFloat(totalAllocPoint);
  }

  /**
   * Deposits GQ on the pool
   * @param {number} pool : number of the pool
   * @param {string} amount : amount of GQ to deposit
   * @returns {any} : the deposit function
   */
  async deposit(pool: number, amount: string): Promise<any> {
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      const userAddr = this.connectionService.getWalletAddress();
      const amountWei = this.connectionService.toWei(amount);
      const allowed = await this.tokenService.tokenApprovement(contractAddresses.stakingVote, userAddr, 'GQ', amountWei);
      if (allowed === true) {
        let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'confirmDepositTransaction', '');
        try {
          const tx = await this.connectionService.writeContract(contractAddresses.stakingVote, StakingVote.abi, 'deposit', [pool, amountWei]);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('waitDeposit', 'waitTransaction', '');
          await waitForTransaction(tx);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('waitDeposit', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
        } catch (error: any) {
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
        }
      }
    }
  }

  /**
   * Claim the reward of the pool
   * @param {number} pool : number of the pool
   * @returns {any} : the claim function
   */
  async claim(pool: number): Promise<any> {
    const walletIsConnected = await this.connectionService.syncAccount();
      if (walletIsConnected) {
      let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'confirmHarvestTransaction', '');
      try {
        const tx = await this.connectionService.writeContract(contractAddresses.stakingVote, StakingVote.abi, 'claim', [pool]);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('waitHarvest', 'waitTransaction', '');
        await waitForTransaction(tx);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('waitHarvest', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
      } catch (error: any) {
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
      }
    }
  }

  /**
   * Withdraw GQ from the pool
   * @param {number} pool : number of the pool
   * @param {string} amount : amount of GQ to withdraw
   * @returns {any} : the withdraw function
   */
  async withdraw(pool: number, amount: string): Promise<any> {
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      const amountWei = this.connectionService.toWei(amount);
      let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'confirmWithdrawTransaction', '');
      try {
        const tx = await this.connectionService.writeContract(contractAddresses.stakingVote, StakingVote.abi, 'withdraw', [pool, amountWei]);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('waitWithdraw', 'waitTransaction', '');
        await waitForTransaction(tx);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('waitWithdraw', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
      } catch (error: any) {
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
      }
    }
  }
}
