import { Component, OnInit } from '@angular/core';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { MissionsGarageService } from 'src/app/shared/services/missions/missions-garage.service';
import { NftService } from 'src/app/shared/services/nft/nft.service';
import { TokenService } from 'src/app/shared/services/token/token.service';

@Component({
  selector: 'app-missions-garage',
  templateUrl: './missions-garage.component.html',
  styleUrls: ['./missions-garage.component.scss']
})
export class MissionsGarageComponent implements OnInit {
  userGarageInfo: any;
  stakedVehicles: any;
  dataIsLoaded: boolean = false;
  nftContractAddresses: string[] = [contractAddresses.landVehicle, contractAddresses.spaceVehicle, contractAddresses.spaceVehicle];
  prices: { level1: any; level2: any; level3: any; };
  showLeveling: boolean = false;
  selectedVehicles = [0, 0, 0];
  stakedNftsData: any = {}
  levelLimits: any = {}

  constructor(
    private connectionService: ConnectionService,
    private garageService: MissionsGarageService,
    private dialogService: DialogService,
    private nftService: NftService
  ) { }

  /**
   * Gets user garage info
   */
  ngOnInit(): void {
    this.getUserInfo();
  }

  /**
   * Control level height opening and closing animation
   */
  switchLevelView(): void {
    this.showLeveling = !this.showLeveling;
    const el = document.getElementById('level-block') as HTMLElement;
    if (this.showLeveling === false) {
      el.style.height = '0px';
    } else {
      el.style.height = '0' + el.scrollHeight + 'px';
    }
  }
  
  /**
   * Get the prices for upgradings
   */
  async getUpgradePrices(): Promise<any> {
    const level1 = await this.garageService.getUpgradePrices(1);
    const level2 = await this.garageService.getUpgradePrices(2);
    const level3 = await this.garageService.getUpgradePrices(3);
    this.prices = { level1, level2, level3 }
  }

  /**
   * Get the vehicle limits of each level
   */
  async getGarageLevelVehicleLimits(): Promise<any> {
    const level0 = await this.garageService.getGarageLevelVehicleLimits(0);
    const level1 = await this.garageService.getGarageLevelVehicleLimits(1);
    const level2 = await this.garageService.getGarageLevelVehicleLimits(2);
    const level3 = await this.garageService.getGarageLevelVehicleLimits(3);
    this.levelLimits = { level0, level1, level2, level3 }
    console.log(this.levelLimits)
  }
  
  /**
   * Get all needed user info
  */
 async getUserInfo(): Promise<any> {
   this.userGarageInfo = await this.garageService.getUserGarageInfo();
   this.stakedVehicles = await this.garageService.getUserStakedVehicles();
   if (this.dataIsLoaded === false) {
     await this.getGarageLevelVehicleLimits();
     await this.getUpgradePrices();
     await this.getStakedNFTsData();
   }
   this.dataIsLoaded = true;
   console.log(this.userGarageInfo);
   console.log(this.stakedVehicles);
  }

  /**
   * Get user staked vehicles
   */
  async getStakedNFTsData(): Promise<any> {
    for (let [index, type] of this.stakedVehicles.entries()) {
      for (let slot of type) {
        if (slot.staked === true) {
          await this.addNftDataToVariable(slot.tokenId.toString(), index);
        }
      }
    }
  }

  /**
   * Add vehicle NFT data to variable
   * @param tokenId id of the token
   * @param index position
   */
  async addNftDataToVariable(tokenId: number, index: number): Promise<any> {
    const nftContractAddress = index === 0 ? contractAddresses.landVehicle : contractAddresses.spaceVehicle;
    if (!this.stakedNftsData['type_' + index + '_tokenId_' + tokenId]) {
      const nftData = await this.nftService.getNftData(tokenId, nftContractAddress);
      this.stakedNftsData['type_' + index + '_tokenId_' + tokenId] = nftData;
    }
    console.log(this.stakedNftsData)
  }

  /**
   * Upgrades the garage to the given level
   * @param level level to upgrade to
   */
  async upgradeLevel(level: number): Promise<any> {
    await this.garageService.upgradeLevel(level);
    this.getUserInfo();
  }

  /**
   * Change the selection on view to given one
   * @param vehicleIndex position
   * @param newSelection new position
   */
  changeSelectedVehicle(vehicleIndex: number, newSelection: number): void {
    this.selectedVehicles[vehicleIndex] = newSelection;
  }

  /**
   * Change the selection on view to next one
   * @param vehicleIndex position
   * @param toNext true for next, false for previous
   */
  moveSelectedVehicle(vehicleIndex: number, toNext: boolean): void {
    const move = toNext ? 1 : -1;
    const newPos = this.selectedVehicles[vehicleIndex] + move;
    this.selectedVehicles[vehicleIndex] = newPos > (this.userGarageInfo.vehicleLimits[vehicleIndex] - 1) ? 0 : newPos < 0 ? (this.userGarageInfo.vehicleLimits[vehicleIndex] - 1) : newPos;
  }

  /**
   * Stakes a vehicle NFT on an empty spot
   * @param vehicleTypeId 0 land, 1 space, 2 clan
   * @param slot position
   */
  async stakeVehicle(vehicleTypeId: number, slot: number): Promise<any> {
    const nftContractAddress = vehicleTypeId === 0 ? contractAddresses.landVehicle : contractAddresses.spaceVehicle;
    const isClanShip = vehicleTypeId === 2 ? true : false;
    this.dialogService.openNFTSelectorDialog(nftContractAddress, this.connectionService.getWalletAddress(), isClanShip)
    .afterClosed().subscribe( async (tokenId: any) => {
      if (tokenId || tokenId === 0) {
        console.log(tokenId);
        await this.addNftDataToVariable(tokenId.toString(), vehicleTypeId);
        await this.garageService.stake(vehicleTypeId, slot, tokenId);
        this.getUserInfo();
      }
    });
  }

  /**
   * Withdraws a vehicle NFT
   * @param vehicleTypeId 0 land, 1 space, 2 clan
   * @param slot position
   */
  async withdrawVehicle(vehicleTypeId: number, slot: number): Promise<any> {
    await this.garageService.withdraw(vehicleTypeId, slot);
    this.getUserInfo();
  }

}
