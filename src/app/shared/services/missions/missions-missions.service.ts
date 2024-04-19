import { Injectable } from '@angular/core';
import { ConnectionService } from '../connection/connection.service';
import { TokenService } from '../token/token.service';
import { DialogService } from '../dialog.service';
import { waitForTransaction } from '@wagmi/core';
import { contractAddresses } from 'src/app/constants/contractAddresses';
// Abi
import { default as Missions } from 'src/app/shared/contracts/missions/Missions.json';

@Injectable({
  providedIn: 'root'
})
export class MissionsMissionsService {

  constructor(
    private connectionService: ConnectionService,
    private tokenService: TokenService,
    private dialogService: DialogService
  ) { }

  /**
   * Get all missions info
   * @returns all missions info
   */
  async getAllMissions(): Promise<any> {
    let missions: any = { level1: [], level2: [], level3: [], level4: [] };
    missions.level1 = await this.getMissionsByLevel(1);
    missions.level2 = await this.getMissionsByLevel(2);
    missions.level3 = await this.getMissionsByLevel(3);
    missions.level4 = await this.getMissionsByLevel(4);
    return missions;
  }

  /**
   * Get mission info by level
   * @param level 
   * @returns given leven mission info
   */
  async getMissionsByLevel(level: number): Promise<any> {
    let missionsByLevel = await this.connectionService.readContract(contractAddresses.missions, Missions.abi, 'numMissionByLevel', [level]);
    missionsByLevel = parseInt(missionsByLevel);
    let missions: any[] = [];
    for (let i = 0; i < missionsByLevel; i++) {
      const mission = await this.connectionService.readContract(contractAddresses.missions, Missions.abi, 'missions', [level, i]);
      const userAddr = this.connectionService.getWalletAddress();
      const userMission = await this.connectionService.readContract(contractAddresses.missions, Missions.abi, 'userMissions', [userAddr, level, i]);
      mission.level = level;
      mission.missionId = i;
      mission.consequences.deathProbability = parseInt(mission.consequences.deathProbability);
      mission.consequences.itemUsage = parseInt(mission.consequences.itemUsage);
      mission.consequences.soldierFatigue = parseInt(mission.consequences.soldierFatigue);
      mission.duration = parseInt(mission.duration);
      mission.requirements.food = parseInt(mission.requirements.food);
      mission.requirements.fuel = parseInt(mission.requirements.fuel);
      mission.requirements.militaryLevel = parseInt(mission.requirements.militaryLevel);
      mission.requirements.numSoldiers = parseInt(mission.requirements.numSoldiers);
      mission.requirements.treasures = parseInt(mission.requirements.treasures);
      mission.rewards.food = parseInt(mission.rewards.food);
      mission.rewards.fuel = parseInt(mission.rewards.fuel);
      mission.rewards.militaryLevel = parseInt(mission.rewards.militaryLevel);
      mission.rewards.treasures = parseInt(mission.rewards.treasures);
      mission.ongoing = userMission.ongoing;
      mission.endTime = parseInt(userMission.endTime);
      missions.push(mission);
    }
    return missions;
  }
  
  /**
   * Get item protections by tier and rarity
   * @returns 
   */
  async getItemProtectionPercentages(): Promise<any> {
    const protections = [[0,0,0], [0,0,0,0], [0,0,0,0,0]]
    for (let tier = 1; tier < 4; tier++) {
      for (let rarity = 0; rarity < 5; rarity++) {
        if ( (tier === 1 && rarity < 3) || (tier === 2 && rarity < 4) || tier === 3 ) {
          const percentage = await this.connectionService.readContract(contractAddresses.missions, Missions.abi, 'soldierProtection', [tier, rarity]);
          protections[tier - 1][rarity] = percentage !== 0 ? parseInt(percentage) / 100 : percentage;
        }
      }
    }
    console.log(protections)
    return protections;
  }

  /**
   * Get the time reduction for each vehicle type
   * @returns 
   */
  async getVehiclesTimeReduction(): Promise<any> {
    const landReduction = await this.connectionService.readContract(contractAddresses.missions, Missions.abi, 'timeReductionByVehicle', [0]);
    const spaceReduction = await this.connectionService.readContract(contractAddresses.missions, Missions.abi, 'timeReductionByVehicle', [1]);
    const clanReduction = await this.connectionService.readContract(contractAddresses.missions, Missions.abi, 'timeReductionByVehicle', [2]);
    return [parseInt(landReduction) / 10000, parseInt(spaceReduction) / 10000, parseInt(clanReduction) / 10000];
  }
  
  /**
   * Get the mission end time
   * @param level 
   * @param missionId 
   * @returns end time
   */
  async getMissionEndTime(level: number, missionId: number): Promise<any> {
    const userAddr = this.connectionService.getWalletAddress();
    const userMission = await this.connectionService.readContract(contractAddresses.missions, Missions.abi, 'userMissions', [userAddr, level, missionId]);
    return parseInt(userMission.endTime);
  }
  
  /**
   * Get user equipments protection probabilities
   * @returns 
   */
  async getUserEquipmentsProtection(): Promise<any> {
    const userAddr = this.connectionService.getWalletAddress();
    let protections = await this.connectionService.readContract(contractAddresses.missions, Missions.abi, 'getUserEquipmentsProtection', [userAddr]);
    protections = protections.map( num => parseInt(num) / 100)
    return protections;
  }
  
  /**
   * Get the minimum durability of each equipment set
   * @returns 
   */
  async getUserEquipmentsMinDurability(): Promise<any> {
    const userAddr = this.connectionService.getWalletAddress();
    let durabilities = await this.connectionService.readContract(contractAddresses.missions, Missions.abi, 'getUserEquipmentsMinDurability', [userAddr]);
    durabilities = durabilities.map( num => parseInt(num))
    return durabilities;
  }

  /**
   * Start a mission
   * @param level 
   * @param missionId 
   * @param soldierIds 
   * @param equipmentIds 
   * @param vehicleType  // -1 no vehicle, 1 land vehicle, 2 space vehicle, 3 clan ship
   * @returns 
   */
  async startMission(level: number, missionId: number, soldierIds: number[], equipmentIds: number[], vehicleType: number): Promise<any> {
    console.log('starting mission');
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'missionStartConfirm', '');
      try {
        const tx = await this.connectionService.writeContract(contractAddresses.missions, Missions.abi, 'startMission', [level, missionId, soldierIds, equipmentIds, vehicleType]);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('missionStart', 'waitTransaction', '');
        await waitForTransaction(tx);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('missionStart', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash);
        return true;
      } catch (error: any) {
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
        return false;
      }
    }
  }
  
  /**
   * Skip mission waiting time
   * @param level 
   * @param missionId 
   * @returns 
   */
  async skipMissionTime(level: number, missionId: number): Promise<any> {
    console.log('skipping mission');
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      const userAddr = this.connectionService.getWalletAddress();
      const acceleratePrice = await this.getAccelerationPrice(userAddr, level, missionId);
      const allowed = await this.tokenService.tokenApprovement(contractAddresses.missions, userAddr, 'GQ', acceleratePrice);
      const formattedValue = parseFloat(parseFloat(this.connectionService.fromWei(acceleratePrice)).toFixed(4)).toLocaleString('en-GB');
      let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'missionTimeSkip', formattedValue + ' GQ');
      if (allowed === true) {
        try {
          const tx = await this.connectionService.writeContract(contractAddresses.missions, Missions.abi, 'skipMissionTime', [level, missionId]);
          dialog.close();
          dialog = this.dialogService.openRegularInfoDialog('skipMissionTime', 'waitTransaction', '');
          await waitForTransaction(tx);
          dialog.close();
          dialog = this.dialogService.openMissionRewardDialog('missionResult', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash, level, missionId);
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
   * End mission and get rewards
   * @param level 
   * @param missionId 
   * @returns 
   */
  async endMission(level: number, missionId: number): Promise<any> {
    console.log('ending mission');
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      let dialog = this.dialogService.openRegularInfoDialog('actionNeeded', 'missionEndConfirm', '');
      try {
        const tx = await this.connectionService.writeContract(contractAddresses.missions, Missions.abi, 'claimMissionRewards', [level, missionId]);
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('missionEnd', 'waitTransaction', '');
        await waitForTransaction(tx);
        dialog.close();
        dialog = this.dialogService.openMissionRewardDialog('missionResult', 'successfulTransaction', '', 'successfulTransactionLink_html', tx.hash, level, missionId);
        return true;
      } catch (error: any) {
        dialog.close();
        dialog = this.dialogService.openRegularInfoDialog('error', error.message, '');
        return false;
      }
    }
  }
  
  /**
   * Get the price to accelerate the given mission
   * @param userAddr addres of the user
   * @param level 
   * @param missionId 
   * @returns price
   */
  async getAccelerationPrice(userAddr: string, level: number, missionId: number): Promise<string> {
    return await this.connectionService.readContract(contractAddresses.missions, Missions.abi, 'getMissionSkipTimePrice', [userAddr, level, missionId]);
  }
  
  /**
   * Get the las result of the given mission
   * @param level 
   * @param missionId 
   * @returns 
   */
  async getUserMissionResult(level: number, missionId: number): Promise<any> {
    const userAddr = this.connectionService.getWalletAddress();
    const rewards = await this.connectionService.readContract(contractAddresses.missions, Missions.abi, 'getUserMissionResult', [userAddr, level, missionId]);
    rewards.food = parseInt(rewards.food);
    rewards.fuel = parseInt(rewards.fuel);
    rewards.itemUsage = parseInt(rewards.itemUsage);
    rewards.militaryLevel = parseInt(rewards.militaryLevel);
    rewards.soldiersDead = parseInt(rewards.soldiersDead);
    rewards.soldiersFatigue = parseInt(rewards.soldiersFatigue);
    rewards.treasures = parseInt(rewards.treasures);
    return rewards;
  }

}
