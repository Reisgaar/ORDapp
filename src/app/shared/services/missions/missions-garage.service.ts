import { Injectable } from '@angular/core';
import { ConnectionService } from '../connection/connection.service';
import { TokenService } from '../token/token.service';
import { DialogService } from '../dialog.service';
import { waitForTransaction } from '@wagmi/core';
import { contractAddresses } from 'src/app/constants/contractAddresses';
// Abi
import { default as Garage } from 'src/app/shared/contracts/missions/Garage.json';

@Injectable({
  providedIn: 'root'
})
export class MissionsGarageService {

  constructor(
    private connectionService: ConnectionService,
    private tokenService: TokenService,
    private dialogService: DialogService
  ) { }

  /**
   * Get the Garage info of the connected user
   * @returns 
   */
  async getUserGarageInfo(): Promise<any> {
    const userAddr = this.connectionService.getWalletAddress();
    const garageLevel = await this.connectionService.readContract(contractAddresses.garage, Garage.abi, 'garageUsersInfo', [userAddr]);
    const vehicleLimitsBigInt = await this.connectionService.readContract(contractAddresses.garage, Garage.abi, 'getGarageLevelVehicleLimits', [garageLevel]);
    const vehicleLimits = [];
    for (let i of vehicleLimitsBigInt) {
      vehicleLimits.push(parseInt(i.toString()));
    }
    return { garageLevel, vehicleLimits };
  }
  
  /**
   * Get user staked vehicles
   * @returns 
   */
  async getUserStakedVehicles(): Promise<any[]> {
    const userAddr = this.connectionService.getWalletAddress();
    let land = await this.connectionService.readContract(contractAddresses.garage, Garage.abi, 'getUserStakedVehicles', [userAddr, 0]);
    let space = await this.connectionService.readContract(contractAddresses.garage, Garage.abi, 'getUserStakedVehicles', [userAddr, 1]);
    let clan = await this.connectionService.readContract(contractAddresses.garage, Garage.abi, 'getUserStakedVehicles', [userAddr, 2]);
    land = land.vehicles ? [land.vehicles] : land;
    space = space.vehicles ? [space.vehicles] : space;
    clan = clan.vehicles ? [clan.vehicles] : clan;
    return [ land, space, clan ];
  }

  /**
   * Upgrades the garage level
   * @param level the level to upgrade to
   */
  async upgradeLevel(level: number): Promise<any> {
    console.log('upgrading garage level');
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      const userAddr = this.connectionService.getWalletAddress();
      const prices = await this.getUpgradePrices(level);
      const allowed = await this.tokenService.tokenApprovement(contractAddresses.garage, userAddr, 'GQ', prices.gq);
      if (allowed === true) {
        const formattedUSD = parseFloat(parseFloat(this.connectionService.fromWei(prices.usd)).toFixed(4)).toLocaleString('en-GB');
        const formattedGQ = parseFloat(parseFloat(this.connectionService.fromWei(prices.gq)).toFixed(4)).toLocaleString('en-GB');
        let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'missionAreaImprovePrice', formattedUSD + '$ (approx. ' + formattedGQ + ' GQ)');
        try {
          const tx = await this.connectionService.writeContract(contractAddresses.garage, Garage.abi, 'improveGarageLevel', []);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('garageAreaImprove', 'waitTransaction', '');
          await waitForTransaction(tx);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('garageAreaImprove', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
        } catch (error: any) {
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
        }
      }
    }
  }

  /**
   * Get the prices (GQ & USD) of the upgrade to given level
   * @param level 
   * @returns object with prices on GQ & USD
   */
  async getUpgradePrices(level: number): Promise<any> {
    const levelData = await this.connectionService.readContract(contractAddresses.garage, Garage.abi, 'garageLevels', [level]);
    const gqPrice = await this.connectionService.readContract(contractAddresses.garage, Garage.abi, 'getImproveGarageLevelPrice', [level]);
    return {
      usd: levelData.price,
      gq: gqPrice
    };
  }

  /**
   * Get the vehicle limits of given level
   * @param level 
   * @returns limits
   */
  async getGarageLevelVehicleLimits(level: number): Promise<any> {
    const limits = await this.connectionService.readContract(contractAddresses.garage, Garage.abi, 'getGarageLevelVehicleLimits', [level]);
    return limits.map( x => parseInt(x.toString()))
  }

  /**
   * Stake a vehicle on an empty spot
   * @param vehicleTypeId 0 land, 1 space, 2 clan
   * @param slot 
   * @param tokenId 
   */
  async stake(vehicleTypeId: number, slot: number, tokenId: number): Promise<any> {
    console.log('staking vehicle');
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      const nftContractAddress = vehicleTypeId === 0 ? contractAddresses.landVehicle : contractAddresses.spaceVehicle;
      const allowed = await this.tokenService.nftCheckAllowance(contractAddresses.garage, nftContractAddress);
      if (allowed === true) {
        let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'garageStakeDeposit', '');
        try {
          const tx = await this.connectionService.writeContract(contractAddresses.garage, Garage.abi, 'stake', [vehicleTypeId, slot, tokenId]);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('garageStake', 'waitTransaction', '');
          await waitForTransaction(tx);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('garageStake', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
        } catch (error: any) {
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
        }
      }
    }
  }

  /**
   * Withdraw a staked vehicle
   * @param vehicleTypeId 0 land, 1 space, 2 clan
   * @param slot 
   */
  async withdraw(vehicleTypeId: number, slot: number): Promise<any> {
    console.log('withdrawing vehicle');
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'garageStakeWithdraw', '');
      try {
        const tx = await this.connectionService.writeContract(contractAddresses.garage, Garage.abi, 'withdraw', [vehicleTypeId, slot]);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('garageStake', 'waitTransaction', '');
        await waitForTransaction(tx);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('garageStake', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
      } catch (error: any) {
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
      }
    }
  }

}
