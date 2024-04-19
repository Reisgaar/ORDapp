import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogService } from '../../../../shared/services/dialog.service';
import { ConnectionService } from '../../../../shared/services/connection/connection.service';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { NftService } from 'src/app/shared/services/nft/nft.service';
import { MissionsArmoryService } from '../../../../shared/services/missions/missions-armory.service';
import { CraftingUtilsService } from '../../../../shared/services/crafting/crafting-utils.service';
import { MissionsMissionsService } from 'src/app/shared/services/missions/missions-missions.service';

@Component({
  selector: 'app-missions-armory',
  templateUrl: './missions-armory.component.html',
  styleUrls: ['./missions-armory.component.scss']
})
export class MissionsArmoryComponent implements OnInit {
  dataIsLoaded: boolean = false;
  interval: any;
  equipmentItems: string[] = ['helmet', 'chest', 'shoulders', 'forearms', 'arms', 'gloves', 'legs', 'kneepads', 'boots', 'weapon'];
  raritiesToId: any = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 };
  selectedEquipmentSet: number = 0;
  equipmentInfo: any = {};
  equipedNFTs: any;
  selectedNFTs: any;
  loadingNFTByIndex: boolean[] = [false, false, false, false, false, false, false, false, false, false];
  loadedNFTsMetadata: any = {};
  changesToUpdate: boolean = false;
  multipleClaimAvailable: boolean = false;
  multipleSpeedUpAvailable: boolean = false;
  showRepairSet: boolean = false;
  protectionPercentages: any[];
  equipmentProtection: number = 0;


  constructor(
    private connectionService: ConnectionService,
    private dialogService: DialogService,
    private nftService: NftService,
    private armoryService: MissionsArmoryService,
    private missionsService: MissionsMissionsService,
    private craftingUtilsService: CraftingUtilsService
  ) { }

  ngOnInit(): void {
    this.getUserInfo();
  }

  /**
   * Get all needed user info
   */
  async getUserInfo(): Promise<any> {
    this.loadingNFTByIndex = this.loadingNFTByIndex.map( loading => loading = true);
    this.protectionPercentages = await this.missionsService.getItemProtectionPercentages();
    console.log(this.protectionPercentages);
    this.equipedNFTs = await this.armoryService.getUserEquipmentItems(this.selectedEquipmentSet);
    this.equipmentInfo = await this.armoryService.getUserEquipmentInfo(this.selectedEquipmentSet);
    console.log(this.equipedNFTs);
    console.log(this.equipmentInfo);
    for (let [index, nft] of this.equipedNFTs.entries()) {
      if (nft.exists) {
        const nftContractAddress = index === (this.equipedNFTs.length - 1) ? contractAddresses.weapon : contractAddresses.armor;
        await this.addNftDataToVariable(nft.tokenId, nftContractAddress, index);
      }
    }
    this.selectedNFTs =  [...this.equipedNFTs];
    this.checkUpdateAndClaim();
    this.dataIsLoaded = true;
    this.loadingNFTByIndex = this.loadingNFTByIndex.map( loading => loading = false);
  }

  /**
   * Set the selected equipment set
   * @param newSelectedEquipmentSet equipment set number to change to
   */
  async setSelectedEquipment(newSelectedEquipmentSet: number): Promise<any> {
    if (newSelectedEquipmentSet !== this.selectedEquipmentSet) {
      this.selectedEquipmentSet = newSelectedEquipmentSet;
      this.getUserInfo();
    }
  }

  /**
   * Change the selected equipment checking if changes are pending
   * @param newSelectedEquipmentSet equipment set number to change to
   */
  changeSelectedEquipment(newSelectedEquipmentSet: number): void {
    if (this.changesToUpdate === false) {
      this.setSelectedEquipment(newSelectedEquipmentSet);
    } else {
      this.dialogService.openConfirmationDialog(['armoryCloseWithChangesConfirmation1', 'armoryCloseWithChangesConfirmation2'])
      .afterClosed().subscribe( isConfirmed => {
        if (isConfirmed) {
          this.setSelectedEquipment(newSelectedEquipmentSet);
        }
      });
    }
  }

  /**
   * Move selected equipment one step
   * @param isNext true for next, false to previous
   */
  async changeSelectedEquipmentStep(isNext: boolean): Promise<any> {
    const move = isNext === true ? 1 : -1;
    let newPos = this.selectedEquipmentSet + move;
    newPos = newPos === -1 ? 9 : newPos === 10 ? 0 : newPos;
    this.changeSelectedEquipment(newPos);
  }

  /**
   * Change the equipment item of the selected position
   * @param itemPos the position of the item to change
   */
  async changeItem(itemPos: number): Promise<any> {
    const nftContractAddress = itemPos === this.equipmentItems.length - 1 ? contractAddresses.weapon : contractAddresses.armor;
    const armorFilter = itemPos === this.equipmentItems.length - 1 ? undefined : this.equipmentItems[itemPos];
    this.dialogService.openNFTSelectorDialog(nftContractAddress, this.connectionService.getWalletAddress(), true, false, armorFilter)
    .afterClosed().subscribe( async (tokenId: any) => {
      if (tokenId || tokenId === 0) {
        console.log('Change', this.equipmentItems[itemPos], 'to', tokenId);
        this.loadingNFTByIndex[itemPos] = true;
        const nftData = await this.addNftDataToVariable(tokenId, nftContractAddress, itemPos);
        const durability = await this.armoryService.getItemDurability(nftContractAddress, tokenId);
        this.selectedNFTs[itemPos] = {
          durability,
          exists: true,
          inRepair: false,
          rarityId: this.craftingUtilsService.getRarityIdByName(nftData.rarity),
          repairEndTime: 0,
          tier: parseInt(nftData.tier[nftData.tier.length - 1]),
          tokenId: tokenId,
        };
        this.checkUpdateAndClaim();
        this.loadingNFTByIndex[itemPos] = false;
        console.log(this.selectedNFTs)
        console.log(this.equipedNFTs)
      }
    });
  }

  /**
   * Adds the data of the NFT to show on view
   * @param tokenId id of the NFT
   * @param nftContractAddress address of the NFT
   * @param itemSlot slot of the item on the set
   * @returns the data of the NFT
   */
  async addNftDataToVariable(tokenId: number, nftContractAddress: string, itemSlot: number): Promise<any> {
    const nftData = await this.nftService.getNftData(tokenId, nftContractAddress);
    const route = itemSlot === this.equipmentItems.length - 1 ? ('weapon_' + tokenId) : ('armor_' + tokenId);
    if (!this.loadedNFTsMetadata[route]) { this.loadedNFTsMetadata[route] = nftData; }
    return nftData;
  }

  /**
   * Removes the selected NFT
   * @param itemSlot slot of the item on the set
   */
  removeNFT(itemSlot: number): void {
    this.selectedNFTs[itemSlot] = {
      durability: 0,
      exists: false,
      inRepair: false,
      rarityId: 0,
      repairEndTime: 0,
      tier: 1,
      tokenId: 0,
    };
    this.checkUpdateAndClaim();
  }

  /**
   * Confirm the equipment changes on the smart contract
   */
  async confirmChanges(): Promise<any> {
    const arrayToChange = [];
    for (let item of this.selectedNFTs) {
      const id = item.tokenId > -1 && item.exists === true ? item.tokenId : -1;
      arrayToChange.push(id);
    }
    this.armoryService.editEquipment(arrayToChange, this.selectedEquipmentSet).then( async (isDone) => {
      if (isDone === true) {
        await this.getUserInfo();
      }
    });
  }
  
  /**
   * Check if changes are done on the equipment and if claim is available
   */
  checkUpdateAndClaim(): void {
    this.setEquipmentProtection();
    let arrayIsDifferent: boolean = false;
    let multipleClaimAux: number = 0;
    let multipleSpeedUpAux: number = 0;
    let auxShowRepairSet: number = 0;
    for (let [index, nft] of this.equipedNFTs.entries()) {
      if (nft.tokenId !== this.selectedNFTs[index].tokenId) {
        arrayIsDifferent = true;
      }
      if (nft.inRepair === true) {
        if (nft.repairEndTime > Math.round(Date.now())  / 1000){
          multipleSpeedUpAux++;
        } else {
          multipleClaimAux++;
        }
      }
      if (nft.exists && nft.durability < 10 && nft.inRepair === false) {
        auxShowRepairSet++;
      }
    }
    this.changesToUpdate = arrayIsDifferent;
    this.multipleClaimAvailable = multipleClaimAux > 1 ? true : false;
    this.multipleSpeedUpAvailable = multipleSpeedUpAux > 1 ? true : false;
    this.showRepairSet = auxShowRepairSet > 1 ? true : false;
  }

  setEquipmentProtection(): void {
    this.equipmentProtection = 0;
    console.log(this.selectedNFTs)
    for (let nft of this.selectedNFTs) {
      if (nft.exists === true) {
        try {
          this.equipmentProtection += this.protectionPercentages[nft.tier - 1][nft.rarityId];
        } catch { console.log('Error: T' + nft.tier + ' - R' + nft.rarityId); }
      }
    }
    console.log('Protection:', this.equipmentProtection + '%');
  }

  /**
   * Reset all equipment changes to smart contract values
   */
  resetChanges(): void {
    this.selectedNFTs =  [...this.equipedNFTs];
    this.checkUpdateAndClaim();
  }

  /**
   * Reset one equipment item changes to smart contract values
   * @param itemSlot slot of the item on the set
   */
  resetPositionChanges(itemSlot: number): void {
    this.selectedNFTs[itemSlot] = this.equipedNFTs[itemSlot];
    this.checkUpdateAndClaim();
  }

  /**
   * Repair the item of the given slot
   * @param itemSlot slot of the item on the set
   */
  async repairEquipmentItem(itemSlot: number): Promise<any> {
    await this.armoryService.repairEquipmentItem(this.selectedEquipmentSet, itemSlot).then( async () => {
      await this.getUserInfo();
    });
  }

  /**
   * Repair the item of the given slot
   * @param itemSlot slot of the item on the set
   */
  async skipEquipmentItemRepairTime(itemSlot: number): Promise<any> {
    await this.armoryService.skipEquipmentItemRepairTime(this.selectedEquipmentSet, itemSlot).then( async () => {
      await this.getUserInfo();
    });
  }

  /**
   * Claim the item of the given slot
   * @param itemSlot slot of the item on the set
   */
  async claimEquipmentItem(itemSlot: number): Promise<any> {
    await this.armoryService.claimEquipmentItem(this.selectedEquipmentSet, itemSlot).then( async () => {
      await this.getUserInfo();
    });
  }

  /**
   * Repair all items of the equipment
   */
  async repairEquipment(): Promise<any> {
    await this.armoryService.repairEquipment(this.selectedEquipmentSet).then( async () => {
      await this.getUserInfo();
    });
  }

  /**
   * Repair all items of the equipment
   */
  async skipEquipmentRepairTime(): Promise<any> {
    await this.armoryService.skipEquipmentRepairTime(this.selectedEquipmentSet).then( async () => {
      await this.getUserInfo();
    });
  }

  /**
   * Claim all items of the equipment
   */
  async claimEquipment(): Promise<any> {
    await this.armoryService.claimEquipment(this.selectedEquipmentSet).then( async () => {
      await this.getUserInfo();
    });
  }

  /**
   * Receive data from countdown component to
   * @param $event 
   * @param itemSlot 
   */
  async receiveCounterData($event: any, itemSlot: number): Promise<void> {
    this.equipedNFTs[itemSlot].repairEndTime = 0;
    this.selectedNFTs[itemSlot].repairEndTime = 0;
    this.checkUpdateAndClaim();
  }

}
