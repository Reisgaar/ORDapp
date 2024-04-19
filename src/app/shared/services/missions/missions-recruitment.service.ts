import { Injectable } from '@angular/core';
import { ConnectionService } from '../connection/connection.service';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { TokenService } from '../token/token.service';
import { DialogService } from '../dialog.service';
import { waitForTransaction } from '@wagmi/core';
// Abi
import { default as RecruitmentArea } from 'src/app/shared/contracts/missions/RecruitmentArea.json';

@Injectable({
  providedIn: 'root'
})
export class MissionsRecruitmentService {

  constructor(
    private connectionService: ConnectionService,
    private tokenService: TokenService,
    private dialogService: DialogService
  ) { }

  /**
   * Get the recruitment info of the connected user
   * @returns 
   */
  async getUserInfo(): Promise<any> {
    const userAddr = this.connectionService.getWalletAddress();
    const userInfo = await this.connectionService.readContract(contractAddresses.recruitmentArea, RecruitmentArea.abi, 'recruitmentUsersInfo', [userAddr]);
    userInfo.campaignInfo.startTime = userInfo.campaignInfo.startTime.toString();
    userInfo.campaignInfo.endTime = userInfo.campaignInfo.endTime.toString();
    userInfo.campaignInfo.numSoldiers = userInfo.campaignInfo.numSoldiers.toString();
    return userInfo;
  }

  /**
   * Upgrades the recruitment campaign level
   * @param level the level to upgrade to
   */
  async upgradeLevel(level: number): Promise<any> {
    console.log('upgrading recruitment level');
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      const userAddr = this.connectionService.getWalletAddress();
      const prices = await this.getUpgradePrices(level);
      const allowed = await this.tokenService.tokenApprovement(contractAddresses.recruitmentArea, userAddr, 'GQ', prices.gq);
      if (allowed === true) {
        const formattedUSD = parseFloat(parseFloat(this.connectionService.fromWei(prices.usd)).toFixed(4)).toLocaleString('en-GB');
        const formattedGQ = parseFloat(parseFloat(this.connectionService.fromWei(prices.gq)).toFixed(4)).toLocaleString('en-GB');
        let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'missionAreaImprovePrice', formattedUSD + '$ (approx. ' + formattedGQ + ' GQ)');
        try {
          const tx = await this.connectionService.writeContract(contractAddresses.recruitmentArea, RecruitmentArea.abi, 'improveCampaignLevel', []);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('recruitmentAreaImprove', 'waitTransaction', '');
          await waitForTransaction(tx);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('recruitmentAreaImprove', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
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
    const levelData = await this.connectionService.readContract(contractAddresses.recruitmentArea, RecruitmentArea.abi, 'campaignLevels', [level]);
    const gqPrice = await this.connectionService.readContract(contractAddresses.recruitmentArea, RecruitmentArea.abi, 'getImproveCampaignLevelPrice', [level]);
    return {
      usd: levelData.price,
      gq: gqPrice
    };
  }
  
  /**
   * Get max soldiers limit for given level
   * @param level 
   * @returns 
   */
  async getUserMaxSoldiers(level: number): Promise<number> {
    const levelData = await this.connectionService.readContract(contractAddresses.recruitmentArea, RecruitmentArea.abi, 'campaignLevels', [level]);
    levelData.recruitmentLimit = parseInt(levelData.recruitmentLimit);
    return levelData.recruitmentLimit;
  }
  
  /**
   * Get the price to accelerate the given percentage of the campaign
   * @param percentage 
   * @param soldierAmount 
   * @returns price
   */
  async getCampaignPriceByPercentage(percentage: number, soldierAmount: number): Promise<any> {
    return await this.connectionService.readContract(contractAddresses.recruitmentArea, RecruitmentArea.abi, 'getCampaignPriceByPercentage', [soldierAmount, percentage]);
  }
  
  /**
   * Get the duration of the campaign with given settings
   * @param gqAmount 
   * @param soldierAmount 
   * @returns duration
   */
  async getCampaignDuration(gqAmount: string, soldierAmount: number): Promise<any> {
    try {
      return await this.connectionService.readContract(contractAddresses.recruitmentArea, RecruitmentArea.abi, 'getCampaignTimeByAmount', [soldierAmount, gqAmount]);
    } catch (error) {}
  }

  /**
   * Starts the campaign with given settings
   * @param gqAmount 
   * @param soldierAmount 
   */
  async startCampaign(gqAmount: string, soldierAmount: number): Promise<any> {
    console.log('starting Campaign');
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      const userAddr = this.connectionService.getWalletAddress();
      const allowed = await this.tokenService.tokenApprovement(contractAddresses.recruitmentArea, userAddr, 'GQ', gqAmount);
      if (allowed === true) {
        let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'recruitmentCampaignStart', '');
        try {
          const tx = await this.connectionService.writeContract(contractAddresses.recruitmentArea, RecruitmentArea.abi, 'startCampaign', [soldierAmount, gqAmount]);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('recruitmentCampaign', 'waitTransaction', '');
          await waitForTransaction(tx);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('recruitmentCampaign', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
        } catch (error: any) {
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
        }
      }
    }
  }

  /**
   * Finish the campaign and get the soldiers
   */
  async recruitSoldiers(): Promise<any> {
    console.log('recruiting soldiers');
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'recruitmentCampaignEnd', '');
      try {
        const tx = await this.connectionService.writeContract(contractAddresses.recruitmentArea, RecruitmentArea.abi, 'claimSoldiers', []);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('recruitmentCampaign', 'waitTransaction', '');
        await waitForTransaction(tx);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('recruitmentCampaign', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
      } catch (error: any) {
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
      }
    }
  }
}
