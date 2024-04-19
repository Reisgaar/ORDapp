import { Injectable } from '@angular/core';
import { ConnectionService } from '../connection/connection.service';
import { DialogService } from '../dialog.service';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { TokenService } from '../token/token.service';
import { waitForTransaction } from '@wagmi/core';
// Abi
import { default as RestingArea } from 'src/app/shared/contracts/missions/RestingArea.json';

@Injectable({
  providedIn: 'root'
})
export class MissionsRestingAreaService {

  constructor(
    private connectionService: ConnectionService,
    private tokenService: TokenService,
    private dialogService: DialogService
  ) { }

  /**
   * Get the resting area info of the connected user
   * @returns 
   */
  async getUserRestingSoldiersInfo(): Promise<any> {
    const userAddr = this.connectionService.getWalletAddress();
    const userRestingSoldiers = await this.connectionService.readContract(contractAddresses.restingArea, RestingArea.abi, 'getUserRestingSoldiers', [userAddr]);
    userRestingSoldiers.forEach(soldier => {
      soldier.endTime = soldier.endTime.toString();
      soldier.restingTypeTokenId = parseInt(soldier.restingTypeTokenId);
    });
    return userRestingSoldiers;
  }

  /**
   * Get staked holdtel keys data
   * @returns 
   */
  async getUserStakedHoldtelKeys(): Promise<any> {
    const userAddr = this.connectionService.getWalletAddress();
    let userKeys = await this.connectionService.readContract(contractAddresses.restingArea, RestingArea.abi, 'getUserHoldtelKeys', [userAddr]);
    userKeys = userKeys[""] ? [userKeys[""]] : userKeys;
    userKeys.forEach( el => {
      el.tokenId = parseInt(el.tokenId);
      el.soldierId = parseInt(el.soldierId);
    });
    return userKeys;
  }

  /**
   * Get max soldiers for land sizes
   * @returns 
   */
  async getLandMaxSoldierAmount(): Promise<any> {
    let nano = await this.connectionService.readContract(contractAddresses.restingArea, RestingArea.abi, 'maxNumSoldiersByLandSize', ['Nano']);
    let micro = await this.connectionService.readContract(contractAddresses.restingArea, RestingArea.abi, 'maxNumSoldiersByLandSize', ['Micro']);
    let standard = await this.connectionService.readContract(contractAddresses.restingArea, RestingArea.abi, 'maxNumSoldiersByLandSize', ['Standard']);
    let macro = await this.connectionService.readContract(contractAddresses.restingArea, RestingArea.abi, 'maxNumSoldiersByLandSize', ['Macro']);
    let mega = await this.connectionService.readContract(contractAddresses.restingArea, RestingArea.abi, 'maxNumSoldiersByLandSize', ['Mega']);
    return [parseInt(nano), parseInt(micro), parseInt(standard), parseInt(macro), parseInt(mega)];
  }

  /**
   * Get rented lands
   * @returns 
   */
  async getRentedLands(): Promise<any[]> {
    let nano = await this.connectionService.readContract(contractAddresses.restingArea, RestingArea.abi, 'getRentedLands', ['Nano']);
    let micro = await this.connectionService.readContract(contractAddresses.restingArea, RestingArea.abi, 'getRentedLands', ['Micro']);
    let standard = await this.connectionService.readContract(contractAddresses.restingArea, RestingArea.abi, 'getRentedLands', ['Standard']);
    let macro = await this.connectionService.readContract(contractAddresses.restingArea, RestingArea.abi, 'getRentedLands', ['Macro']);
    let mega = await this.connectionService.readContract(contractAddresses.restingArea, RestingArea.abi, 'getRentedLands', ['Mega']);
    nano = nano[""] ? [nano[""]] : nano;
    micro = micro[""] ? [micro[""]] : micro;
    standard = standard[""] ? [standard[""]] : standard;
    macro = macro[""] ? [macro[""]] : macro;
    mega = mega[""] ? [mega[""]] : mega;
    nano.forEach( el => { el.tokenId = parseInt(el.tokenId); el.numRestingSoldiers = parseInt(el.numRestingSoldiers); el.lockEndTime = el.lockEndTime.toString() });
    micro.forEach( el => { el.tokenId = parseInt(el.tokenId); el.numRestingSoldiers = parseInt(el.numRestingSoldiers); el.lockEndTime = el.lockEndTime.toString() });
    standard.forEach( el => { el.tokenId = parseInt(el.tokenId); el.numRestingSoldiers = parseInt(el.numRestingSoldiers); el.lockEndTime = el.lockEndTime.toString() });
    macro.forEach( el => { el.tokenId = parseInt(el.tokenId); el.numRestingSoldiers = parseInt(el.numRestingSoldiers); el.lockEndTime = el.lockEndTime.toString() });
    mega.forEach( el => { el.tokenId = parseInt(el.tokenId); el.numRestingSoldiers = parseInt(el.numRestingSoldiers); el.lockEndTime = el.lockEndTime.toString() });
    return [nano, micro, standard, macro, mega];
  }

  /**
   * Start the resting of a soldier
   * @param soldierId 
   */
  async addRestingSoldier(soldierId: number): Promise<any> {
    console.log('start soldier', soldierId, 'to rest');
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'restingSoldierDeposit', '');
      try {
        const tx = await this.connectionService.writeContract(contractAddresses.restingArea, RestingArea.abi, 'addRestingSoldier', [soldierId]);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('startSoldierRest', 'waitTransaction', '');
        await waitForTransaction(tx);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('startSoldierRest', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
      } catch (error: any) {
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
      }
    }
  }

  /**
   * Claim a rested soldier
   * @param soldierId 
   */
  async claimRestingSoldier(soldierId: number): Promise<any> {
    console.log('withdrawing soldier', soldierId, 'from rest');
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'restingSoldierWithdraw', '');
      try {
        const tx = await this.connectionService.writeContract(contractAddresses.restingArea, RestingArea.abi, 'claimRestingSoldier', [soldierId]);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('finishSoldierRest', 'waitTransaction', '');
        await waitForTransaction(tx);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('finishSoldierRest', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
      } catch (error: any) {
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
      }
    }
  }

  /**
   * Stake a holdtel key
   * @param tokenId 
   */
  async stakeKey(tokenId: number): Promise<any> {
    console.log('staking holdtel key');
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      const allowed = await this.tokenService.nftCheckAllowance(contractAddresses.restingArea, contractAddresses.holdtelKey);
      if (allowed === true) {
        let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'restingAreaStakeDepositKey', '');
        try {
          const tx = await this.connectionService.writeContract(contractAddresses.restingArea, RestingArea.abi, 'addHoldtelKey', [tokenId]);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('restingAreaStakeKey', 'waitTransaction', '');
          await waitForTransaction(tx);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('restingAreaStakeKey', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
        } catch (error: any) {
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
        }
      }
    }
  }

  /**
   * Withdraw a staked key
   * @param tokenId 
   */
  async withdrawKey(tokenId: number): Promise<any> {
    console.log('withdrawing holdtel key');
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'restingAreaStakeWithdrawKey', '');
      try {
        const tx = await this.connectionService.writeContract(contractAddresses.restingArea, RestingArea.abi, 'removeHoldtelKey', [tokenId]);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('restingAreaWithdrawKey', 'waitTransaction', '');
        await waitForTransaction(tx);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('restingAreaWithdrawKey', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
      } catch (error: any) {
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
      }
    }
  }

  /**
   * Stake a land
   * @param tokenId 
   */
  async rentLand(tokenId: number): Promise<any> {
    console.log('staking land');
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      const allowed = await this.tokenService.nftCheckAllowance(contractAddresses.restingArea, contractAddresses.land);
      if (allowed === true) {
        let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'restingAreaStakeDepositLand', '');
        try {
          const tx = await this.connectionService.writeContract(contractAddresses.restingArea, RestingArea.abi, 'rentLand', [tokenId]);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('restingAreaStakeLand', 'waitTransaction', '');
          await waitForTransaction(tx);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('restingAreaStakeLand', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
        } catch (error: any) {
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
        }
      }
    }
  }

  /**
   * Withdraw a staked land
   * @param tokenId 
   */
  async unrentLand(tokenId: number): Promise<any> {
    console.log('withdrawing land');
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'restingAreaStakeWithdrawLand', '');
      try {
        const tx = await this.connectionService.writeContract(contractAddresses.restingArea, RestingArea.abi, 'unrentLand', [tokenId]);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('restingAreaWithdrawLand', 'waitTransaction', '');
        await waitForTransaction(tx);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('restingAreaWithdrawLand', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
      } catch (error: any) {
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
      }
    }
  }

  /**
   * Apply key effect to a resting soldier
   * @param keyTokenId 
   * @param soldierId 
   */
  async useHoldtelKey(keyTokenId: number, soldierId: number): Promise<any> {
    console.log('using holdtel key to rest');
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'restingAreaSendToHoldtel', '');
      try {
        const tx = await this.connectionService.writeContract(contractAddresses.restingArea, RestingArea.abi, 'useHoldtelKey', [keyTokenId, soldierId]);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('restingAreaUseHoldtel', 'waitTransaction', '');
        await waitForTransaction(tx);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('restingAreaUseHoldtel', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
      } catch (error: any) {
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
      }
    }
  }

  /**
   * Apply land effect to a resting soldier
   * @param landTokenId 
   * @param soldierId 
   */
  async addSoldierToLand(landTokenId: number, soldierId: number): Promise<any> {
    console.log('using holdtel key to rest');
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      const userAddr = this.connectionService.getWalletAddress();
      const prices = await this.getLandPrices();
      const allowed = await this.tokenService.tokenApprovement(contractAddresses.restingArea, userAddr, 'GQ', prices.gq);
      if (allowed === true) {
        const formattedUSD = parseFloat(parseFloat(this.connectionService.fromWei(prices.usd)).toFixed(4)).toLocaleString('en-GB');
        const formattedGQ = parseFloat(parseFloat(this.connectionService.fromWei(prices.gq)).toFixed(4)).toLocaleString('en-GB');
        let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'restingAreaSendToLand', formattedUSD + '$ (approx. ' + formattedGQ + ' GQ)');
        try {
          const tx = await this.connectionService.writeContract(contractAddresses.restingArea, RestingArea.abi, 'addSoldierToLand', [soldierId, landTokenId]);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('restingAreaUseLand', 'waitTransaction', '');
          await waitForTransaction(tx);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('restingAreaUseLand', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
        } catch (error: any) {
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
        }
      }
    }
  }

  /**
   * Get GQ and USD prices to use lands (all lands have same prices)
   * @returns prices
   */
  async getLandPrices(): Promise<any> {
    const landPriceUSD = await this.connectionService.readContract(contractAddresses.restingArea, RestingArea.abi, 'landPricePerSoldier', []);
    const landPriceGQ = await this.connectionService.readContract(contractAddresses.restingArea, RestingArea.abi, 'getLandPricePerSoldier', []);
    return {
      usd: landPriceUSD,
      gq: landPriceGQ
    };
  }

  /**
   * Accelerates the resting time of a soldier
   * @param soldierId the id of the soldier
   */
  async accelerateSoldierResting(soldierId: number): Promise<any> {
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      const userAddr = this.connectionService.getWalletAddress();
      const acceleratePrice = await this.getAccelerationPrice(userAddr, soldierId);
      const allowed = await this.tokenService.tokenApprovement(contractAddresses.restingArea, userAddr, 'GQ', acceleratePrice);
      const formattedValue = parseFloat(parseFloat(this.connectionService.fromWei(acceleratePrice)).toFixed(4)).toLocaleString('en-GB');
      let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'restingSoldierSkip', formattedValue + ' GQ');
      if (allowed === true) {
        try {
          const tx = await this.connectionService.writeContract(contractAddresses.restingArea, RestingArea.abi, 'skipRestingTime', [soldierId]);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('skipSoldierRest', 'waitTransaction', '');
          await waitForTransaction(tx);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('skipSoldierRest', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
        } catch (error: any) {
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
        }
      }
    }
  }

  /**
   * Get the price to accelerate the current soldier resting
   * @param userAddr addres of the user
   * @param soldierId 
   * @returns price
   */
  async getAccelerationPrice(userAddr: string, soldierId: number): Promise<string> {
    return await this.connectionService.readContract(contractAddresses.restingArea, RestingArea.abi, 'getSkipRestingTimePrice', [userAddr, soldierId]);
  }

}
