import { Injectable } from '@angular/core';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { waitForTransaction } from '@wagmi/core';
import { ConnectionService } from '../connection/connection.service';
import { DialogService } from '../dialog.service';
import { TokenService } from '../token/token.service';
import { MaterialExtractionService } from '../lands/material-extraction.service';
// Abi
import { default as Foundry } from 'src/app/shared/contracts/foundry/GalacticFoundry.json';

@Injectable({
  providedIn: 'root'
})
export class FoundryService {

  constructor(
    private connectionService: ConnectionService,
    private tokenService: TokenService,
    private dialogService: DialogService,
    private materialExtractionService: MaterialExtractionService
  ) { }

  /**
   * Gets the max size of the pools
   * @returns max size of pools
   */
  async getMaxPoolSize(): Promise<number> {
    const maxSize = await this.connectionService.readContract(contractAddresses.galacticFoundry, Foundry.abi, 'maxPoolSize', []);
    return parseInt(maxSize);
  }

  /**
   * Gets the min size of the pools
   * @returns min size of pools
   */
  async getMinPoolSize(): Promise<number> {
    const defaultSize = await this.connectionService.readContract(contractAddresses.galacticFoundry, Foundry.abi, 'defaultPoolSize', []);
    return parseInt(defaultSize);
  }

  /**
   * Gets the percentage reward for each collection
   * @param collections Array with collection ids
   * @returns array with collection rewards
   */
  async getCollectionRewardsPercentage(collections: number[]): Promise<any> {
    const rewards = [];
    for (let col of collections) {
      const collectionReward = await this.connectionService.readContract(contractAddresses.galacticFoundry, Foundry.abi, 'collectionRewards', [col]);
      rewards[col] = parseInt(collectionReward) / 100;
    }
    return rewards;
  }

  /**
   * Get user land stake bonus
   * @returns bonus percentage
   */
  async getUserLandStakeBonus(): Promise<number> {
    const land = await this.materialExtractionService.getUserTopLandSize();
    const bonus = await  this.connectionService.readContract(contractAddresses.galacticFoundry, Foundry.abi, 'landStakingRewardBonus', [land]);
    return (parseInt(bonus) / 100);
  }

  /**
   * Sends the given NFT to the first available pool
   * @param nftType type (armor 0 or weapon 1)
   * @param nftTokenIds an array with the tokenIds
   * @returns
   */
  async sendToFoundryPool(nftType: number, nftTokenIds: number[]): Promise<any> {
    // Check wallet connection
    const walletIsConnected = await this.connectionService.syncAccount();
    if (!walletIsConnected) { return }
    const userAddr = this.connectionService.getWalletAddress();
    // Check NFT approvement
    const nftAddress = nftType === 0 ? contractAddresses.armor : nftType === 1 ? contractAddresses.weapon : '';
    const nftnAllowed = await this.tokenService.nftCheckAllowance(contractAddresses.galacticFoundry, nftAddress);
    if (!nftnAllowed) { return }
    // Check token approvement
    const fee = await this.connectionService.readContract(contractAddresses.galacticFoundry, Foundry.abi, 'getFoundryFeeInGQ', [nftTokenIds.length]);
    const tokenAllowed = await this.tokenService.tokenApprovement(contractAddresses.galacticFoundry, userAddr, contractAddresses.gq, fee);
    if (!tokenAllowed) { return }
    // Make the transaction
    const feeInUsd = await this.connectionService.readContract(contractAddresses.galacticFoundry, Foundry.abi, 'foundryFees', [nftTokenIds.length]);
    const formattedGQFee = parseFloat(parseFloat(this.connectionService.fromWei(fee)).toFixed(4)).toLocaleString('en-GB');
    const formattedUSDFee = parseFloat(parseFloat(this.connectionService.fromWei(feeInUsd)).toFixed(4)).toLocaleString('en-GB');
    let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'foundryDissasembleStart', 'Fee: ' + formattedUSDFee + '$ (approx. ' + formattedGQFee + 'GQ)');
    try {
      const tx = await this.connectionService.writeContract(contractAddresses.galacticFoundry, Foundry.abi, 'disassembleItems', [nftType, nftTokenIds]);
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('foundryDissasemble', 'waitTransaction', '');
      await waitForTransaction(tx);
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('foundryDissasemble', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
      return true;
    } catch (error: any) {
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
    }
  }

  /**
   * Gets the pool data (items, isUpgraded and rewards)
   * @param userAddr the address of the user
   * @param pool the number of the pool
   * @returns an object with the pool data
   */
  async getPoolData(userAddr: string, pool: number): Promise<any> {
    let poolData: any = {};
    poolData.items = await this.userFoundryItems(userAddr, pool);
    poolData.isUpgraded = await this.userUpgradedPools(userAddr, pool);
    if (poolData.items.exists === true) {
      poolData.rewards = await this.getPoolRewards(userAddr, pool);
    }
    return poolData;
  }

  /**
   * Gets the rewards of the pool
   * @param userAddr the address of the user
   * @param pool the number of the pool
   * @returns an object with the rewards
   */
  async getPoolRewards(userAddr: string, pool: number): Promise<any> {
    const rewards = await this.connectionService.readContract(contractAddresses.galacticFoundry, Foundry.abi, 'getPoolRewards', [userAddr, pool]);
    let processedRewards: any = {};
    for (let [index, value] of rewards.resources.entries()) {
      processedRewards[value] = {
        exists: rewards.resourceRewards[index].exists,
        availableRewards: rewards.resourceRewards[index].availableRewards.toString(),
        claimedRewards: rewards.resourceRewards[index].claimedRewards.toString(),
        totalRewards: rewards.resourceRewards[index].totalRewards.toString()
      }
    }
    return processedRewards;
  }

  /**
   * Gets the pool unlocking price
   * @param pool number of the pool
   * @returns an object with prices (gq and usd)
   */
  async getPoolUnlockingPrice(pool: number): Promise<any> {
    return {
      usd: await this.connectionService.readContract(contractAddresses.galacticFoundry, Foundry.abi, 'poolUnlockingPrices', [pool]),
      gq: await this.connectionService.readContract(contractAddresses.galacticFoundry, Foundry.abi, 'getPoolUnlockingPrice', [pool])
    };
  }

  /**
   * Gets the pool upgrading price
   * @returns an object with prices (gq and usd)
   */
  async getPoolUpgradingPrice(): Promise<any> {
    return {
      usd: await this.connectionService.readContract(contractAddresses.galacticFoundry, Foundry.abi, 'poolUpgradePrice', []),
      gq: await this.connectionService.readContract(contractAddresses.galacticFoundry, Foundry.abi, 'getPoolUpgradingPrice', [])
    };
  }

  /**
   * Gets the user foundry pool items
   * @param userAddr the address of the user
   * @param pool number of the pool
   * @returns foundry items info
   */
  async userFoundryItems(userAddr: string, pool: number): Promise<any> {
    return await this.connectionService.readContract(contractAddresses.galacticFoundry, Foundry.abi, 'userFoundryItems', [userAddr, pool]);
  }

  /**
   * Gets if given pool is unlocked for the given user address
   * @param userAddr address of the user
   * @param pool number of the pool
   * @returns boolean true if unlocked
   */
  async userUnlockedPools(userAddr: string, pool: number): Promise<any> {
    return await this.connectionService.readContract(contractAddresses.galacticFoundry, Foundry.abi, 'getUserUnlockedPools', [userAddr, pool]);
  }

  /**
   * Gets if given pool is upgraded for the given user address
   * @param userAddr address of the user
   * @param pool number of the pool
   * @returns boolean true if upgraded
   */
  async userUpgradedPools(userAddr: string, pool: number): Promise<any> {
    return await this.connectionService.readContract(contractAddresses.galacticFoundry, Foundry.abi, 'getUserUpgradedPools', [userAddr, pool]);
  }

  /**
   * Claims the materials of the given pool
   * @param pool number of the pool
   */
  async claimFoundryPool(pool: number): Promise<any> {
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'confirmFoundryClaim', '');
      try {
        const tx = await this.connectionService.writeContract(contractAddresses.galacticFoundry, Foundry.abi, 'claimPendingRewards', [pool], );
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('foundryClaim', 'waitTransaction', '');
        await waitForTransaction(tx);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('foundryClaim', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
      } catch (error: any) {
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
      }
    }
  }

  /**
   * Accelerates and claims materials of the given pool
   * @param pool number of the pool
   */
  async accelerateAndClaimFoundryPool(pool: number): Promise<any> {
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      const userAddr = this.connectionService.getWalletAddress();
      const acceleratePrice = await this.getAccelerationPrice(userAddr, pool);
      const allowed = await this.tokenService.tokenApprovement(contractAddresses.galacticFoundry, userAddr, 'GQ', acceleratePrice);
      const formattedValue = parseFloat(parseFloat(this.connectionService.fromWei(acceleratePrice)).toFixed(4)).toLocaleString('en-GB');
      let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'foundrySkipConfirm', '≈ ' + formattedValue + ' GQ');
      if (allowed === true) {
        try {
          const tx = await this.connectionService.writeContract(contractAddresses.galacticFoundry, Foundry.abi, 'skipDisassembleTime', [pool], );
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('foundrySkip', 'waitTransaction', '');
          await waitForTransaction(tx);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('foundrySkip', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
        } catch (error: any) {
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
        }
      }
    }
  }

  /**
   * Gets the acceleration price of the given pool
   * @param userAddr address of the user
   * @param poolId number of the pool
   * @returns price of the acceleration on wei
   */
  async getAccelerationPrice(userAddr: string, poolId: number): Promise<string> {
    return await this.connectionService.readContract(contractAddresses.galacticFoundry, Foundry.abi, 'getSkipDisassembleTimePrice', [userAddr, poolId]);
  }

  /**
   * Unlocks the pool paying GQ
   * @param pool number of the pool
   */
  async unlockPool(pool: number): Promise<any> {
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
        const userAddr = this.connectionService.getWalletAddress();
        const price = await this.connectionService.readContract(contractAddresses.galacticFoundry, Foundry.abi, 'getPoolUnlockingPrice', [pool]);
        const tokenAllowed = await this.tokenService.tokenApprovement(contractAddresses.galacticFoundry, userAddr, contractAddresses.gq, price);
      if (tokenAllowed) {
        const formattedValue = parseFloat(parseFloat(this.connectionService.fromWei(price)).toFixed(4)).toLocaleString('en-GB');
        let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'unlockPoolConfirm', '≈ ' + formattedValue + ' GQ');
        try {
          const tx = await this.connectionService.writeContract(contractAddresses.galacticFoundry, Foundry.abi, 'unlockPool', [pool]);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('unlockPool', 'waitTransaction', '');
          await waitForTransaction(tx);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('unlockPool', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
        } catch (error: any) {
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
        }
      }
    }
  }

  /**
   * Upgrades the pool paying GQ
   * @param pool number of the pool
   */
  async upgradePool(pool: number): Promise<any> {
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      const userAddr = this.connectionService.getWalletAddress();
      const upgradePrice = await this.connectionService.readContract(contractAddresses.galacticFoundry, Foundry.abi, 'getPoolUpgradingPrice', []);
      const tokenAllowed = await this.tokenService.tokenApprovement(contractAddresses.galacticFoundry, userAddr, contractAddresses.gq, upgradePrice);
      if (tokenAllowed) {
        const formattedValue = parseFloat(parseFloat(this.connectionService.fromWei(upgradePrice)).toFixed(4)).toLocaleString('en-GB');
        let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'upgradePoolConfirm', '≈ ' + formattedValue + ' GQ');
        try {
          const tx = await this.connectionService.writeContract(contractAddresses.galacticFoundry, Foundry.abi, 'upgradePool', [pool]);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('upgradePool', 'waitTransaction', '');
          await waitForTransaction(tx);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('upgradePool', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
        } catch (error: any) {
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
        }
      }
    }
  }

}
