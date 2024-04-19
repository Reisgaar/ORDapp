import { Injectable } from '@angular/core';
import { ConnectionService } from '../connection/connection.service';
import { contractAddresses } from 'src/app/constants/contractAddresses';
// Abi
import { default as SharedStorage } from 'src/app/shared/contracts/missions/SharedStorage.json';

@Injectable({
  providedIn: 'root'
})
export class MissionsSharedService {

  constructor(
    private connectionService: ConnectionService
  ) { }

  /**
   * Get soldiers info
   * @returns 
   */
  async getUserSoldiersInfo(): Promise<any> {
    const userAddr = this.connectionService.getWalletAddress();
    const userSoldiers = await this.connectionService.readContract(contractAddresses.missionsSharedStorage, SharedStorage.abi, 'getUserSoldiersInfo', [userAddr]);
    userSoldiers.forEach(soldier => {
      soldier.energyPoints = parseInt(soldier.energyPoints);
    });
    return userSoldiers;
  }

  /**
   * Get user rank and soldiers amount
   * @returns 
   */
  async getUserRankAndSoldiers(): Promise<any> {
    const userAddr = this.connectionService.getWalletAddress();
    const userSoldiers = await this.connectionService.readContract(contractAddresses.missionsSharedStorage, SharedStorage.abi, 'usersInfo', [userAddr]);
    return { rank: parseInt(userSoldiers.militaryLevel), soldiers: parseInt(userSoldiers.numSoldiersRecruited) };
  }
}
