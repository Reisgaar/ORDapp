import { Injectable } from '@angular/core';
import { ConnectionService } from '../connection/connection.service';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { TokenService } from '../token/token.service';
import { DialogService } from '../dialog.service';
import { waitForTransaction } from '@wagmi/core';
// Abi
import { default as LandStaking } from 'src/app/shared/contracts/lands/LandStaking.json';

@Injectable({
  providedIn: 'root'
})
export class MaterialExtractionService {

  constructor(
    private connectionService: ConnectionService,
    private tokenService: TokenService,
    private dialogService: DialogService
  ) { }

  /**
   * Get the data of the land staking pool
   * @param landSize the size of the land
   * @returns the pool data (tokenId, endTime and staked)
   */
  async getLandStakePoolData(landSize: string): Promise<any> {
    const userAddr = this.connectionService.getWalletAddress();
    return await this.connectionService.readContract(contractAddresses.landStaking, LandStaking.abi, 'userStakings', [userAddr, landSize]);
  }

  /**
   * Get the pending rewards of the given pool
   * @param landSize size of the land
   * @returns pending rewards
   */
  async getStakedLandPendingRewards(landSize: string): Promise<any> {
    const userAddr = this.connectionService.getWalletAddress();
    return await this.connectionService.readContract(contractAddresses.landStaking, LandStaking.abi, 'getUserPendingRewards', [userAddr, landSize]);
  }

  /**
   * Get fee of pool deposit
   * @returns fee amount on wei
   */
  async getPoolDepositFee(): Promise<any> {
    return await this.connectionService.readContract(contractAddresses.landStaking, LandStaking.abi, 'stakingFee', []);
  }

  /**
   * Get the rewards of the given pool
   * @param landSize size of the land
   * @returns rewards
   */
  async getStakedLandPoolRewards(landSize: string): Promise<any> {
    return await this.connectionService.readContract(contractAddresses.landStaking, LandStaking.abi, 'getPoolRewards', [landSize]);
  }

  /**
   * Deposit Land NFT on land staking pools
   * @param tokenId tokenId to deposit
   */
  async depositLand(tokenId: number, landSize: string): Promise<any> {
    console.log('Deposit ' + tokenId + ' land on material extraction pool.');
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      const allowed = await this.tokenService.nftCheckAllowance(contractAddresses.landStaking, contractAddresses.land);
      if (allowed === true) {
        let dialog = this.dialogService.openRegularInfoDialog('landStakingDeposit', 'confirmLandStakingDeposit-' + landSize.toLowerCase(), '');
        try {
          const fee = await this.connectionService.readContract(contractAddresses.landStaking, LandStaking.abi, 'getStakingFeeInBNB', []);
          const tx = await this.connectionService.writeContract(contractAddresses.landStaking, LandStaking.abi, 'stakeLand', [tokenId], fee);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('landStakingDeposit', 'waitTransaction', '');
          await waitForTransaction(tx);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('landStakingDeposit', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
        } catch (error: any) {
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
        }
      }
    }
  }

  /**
   * Withdraw Land NFT from land staking pools
   * @param landSize land size
   */
  async withdrawLand(landSize: string): Promise<any> {
    console.log('Withdraw land from material extraction pool.');
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      let dialog = this.dialogService.openRegularInfoDialog('landStakingWithdraw', 'confirmLandStakingWithdraw-' + landSize.toLowerCase(), '');
      try {
        const tx = await this.connectionService.writeContract(contractAddresses.landStaking, LandStaking.abi, 'unstakeLand', [landSize]);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('landStakingWithdraw', 'waitTransaction', '');
        await waitForTransaction(tx);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('landStakingWithdraw', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
      } catch (error: any) {
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
      }
    }
  }

  /**
   * Claim materials from land staking pools
   * @param landSize land size
   */
  async claimMaterials(landSize: string): Promise<any> {
    console.log('Claim materials from land material extraction pool.');
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      let dialog = this.dialogService.openRegularInfoDialog('landStakingClaim', 'confirmClaimTransaction', '');
      try {
        const tx = await this.connectionService.writeContract(contractAddresses.landStaking, LandStaking.abi, 'claimRewards', [landSize]);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('landStakingClaim', 'waitTransaction', '');
        await waitForTransaction(tx);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('landStakingClaim', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
      } catch (error: any) {
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
      }
    }
  }

  /**
   * Get material cost and time reductions for connected wallet
   * @returns cost and time reductions
   */
  async getUserCraftingDiscount(): Promise<any> {
    const userAddr = this.connectionService.getWalletAddress();
    const cost = await this.connectionService.readContract(contractAddresses.landStaking, LandStaking.abi, 'getUserCraftingCostReduction', [userAddr]);
    const time = await this.connectionService.readContract(contractAddresses.landStaking, LandStaking.abi, 'getUserCraftingTimeReduction', [userAddr]);
    return {
      cost: (cost / 100),
      time: (time / 100)
    }
  }

  /**
   * Get material cost and time reductions for given pool
   * @returns cost and time reductions
   */
  async getPoolCraftingDiscount(landSize: string): Promise<any> {
    const cost = await this.connectionService.readContract(contractAddresses.landStaking, LandStaking.abi, 'poolCraftingCostReductions', [landSize]);
    const time = await this.connectionService.readContract(contractAddresses.landStaking, LandStaking.abi, 'poolCraftingTimeReductions', [landSize]);
    return {
      cost: (cost / 100),
      time: (time / 100)
    }
  }

}