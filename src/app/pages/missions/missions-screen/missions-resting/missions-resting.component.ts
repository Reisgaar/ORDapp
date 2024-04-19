import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { MissionsRestingAreaService } from '../../../../shared/services/missions/missions-resting-area.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { MissionsSharedService } from '../../../../shared/services/missions/missions-shared.service';

@Component({
  selector: 'app-missions-resting',
  templateUrl: './missions-resting.component.html',
  styleUrls: ['./missions-resting.component.scss']
})
export class MissionsRestingComponent implements OnInit, OnDestroy {
  userSoldiers: any[] = []; // user status: 0 unavailable, 1 available, 2 resting, 3 on_mission
  rentedLands: any;
  restingTypes: string[] = ['Holdtel', 'Land']
  landSizes: string[] = ['nano', 'micro', 'standard', 'macro', 'mega'];
  landSizeLimits: number[];
  userKeys: any[] = ['junior', 'standard', 'royal'];
  interval: any;
  dataIsLoaded: boolean = false;
  landOrKeyBoostIsAvailable: boolean = false;
  userAddr: string = '';
  
  // Soldiers Pagination
  soldiersPerPage: number = 10;
  soldiersPaginationPage: number = 0;
  soldiersTotalPages: number = 1;
  // Key Pagination
  keysPerPage: number = 12;
  keysPaginationPage: number = 0;
  keysTotalPages: number = 1; 
  // Lands Pagination
  landsPerPage: number = 12;
  landsPaginationPage: number[] = [0, 0, 0, 0, 0];
  landsTotalPages: number[] = [1, 1, 1, 1, 1];

  // Change slider on resize
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.setPageByWindowWidth();
  }

  constructor(
    private connectionService: ConnectionService,
    private restingAreaService: MissionsRestingAreaService,
    private missionsSharedService: MissionsSharedService,
    private dialogService: DialogService
  ) { }

  /**
   * Sets 10s interval to refresh user data
   */
  ngOnInit(): void {
    this.userAddr = this.connectionService.getWalletAddress();
    this.getUserInfo();
    this.interval = setInterval(() => {
      this.getUserInfo();
    }, 10000);
  }

  /**
   * Clear the interval
   */
  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  /**
   * Get all needed user info
   */
  async getUserInfo(): Promise<any> {
    this.landSizeLimits = await this.restingAreaService.getLandMaxSoldierAmount();
    this.userSoldiers = await this.getSoldiersInfo();
    this.userKeys = await this.restingAreaService.getUserStakedHoldtelKeys();
    this.rentedLands = await this.restingAreaService.getRentedLands();
    this.setPageByWindowWidth();
    this.setTotalPages();
    this.dataIsLoaded = true;
    console.log(this.landSizeLimits);
    console.log(this.userSoldiers);
    console.log(this.userKeys);
    console.log(this.rentedLands)
  }

  /**
   * Gets resting soldiers info
   */
  async getSoldiersInfo(): Promise<any[]> {
    let auxBoolean = false;
    const restingSoldiers = await this.restingAreaService.getUserRestingSoldiersInfo();
    const soldiers = await this.missionsSharedService.getUserSoldiersInfo();
    const soldierMixedArray = [];
    for (let sol in restingSoldiers){
      soldierMixedArray.push( { ...restingSoldiers[sol], ...soldiers[sol], soldierPosition: soldiers.indexOf(soldiers[sol]) } );
      if (restingSoldiers[sol].isResting === true && restingSoldiers[sol].restingType === 0 && parseInt(restingSoldiers[sol].endTime) > (Date.now() / 1000)) {
        auxBoolean = true;
      }
    }
    this.landOrKeyBoostIsAvailable = auxBoolean;
    return soldierMixedArray.filter(sol => sol.isRecruited === true);
  }

  /**
   * Start the soldier resting
   * @param soldierId position
   */
  async addRestingSoldier(soldierId: number): Promise<any> {
    await this.restingAreaService.addRestingSoldier(soldierId).then( () => {
      this.getUserInfo();
    })
  }

  /**
   * Accelerates resting time
   * @param soldierId position
   */
  async accelerateSoldierResting(soldierId: number): Promise<any> {
    await this.restingAreaService.accelerateSoldierResting(soldierId).then( () => {
      this.getUserInfo();
    })
  }

  /**
   * Claims a soldier that has finished resting
   * @param soldierId 
   */
  async claimRestingSoldier(soldierId: number): Promise<any> {
    await this.restingAreaService.claimRestingSoldier(soldierId).then( () => {
      this.getUserInfo();
    })
  }

  /**
   * Receive data when countdown ends
   * @param $event 
   */
  async receiveCounterData($event: any): Promise<void> {
    // this.getUserInfo();
  }

  /**
   * Stake a holdtel key
   */
  async stakeKey(): Promise<any> {
    this.dialogService.openNFTSelectorDialog(contractAddresses.holdtelKey, this.connectionService.getWalletAddress(), false)
    .afterClosed().subscribe( async (tokenId: any) => {
      if (tokenId || tokenId === 0) {
        console.log(tokenId);
        await this.restingAreaService.stakeKey(tokenId).then( () => {
          this.restingAreaService.getUserStakedHoldtelKeys();
        });
      }
    });
  }

  /**
   * Apply effect of a holdtel key to a soldier
   * @param keyId 
   */
  async useHoldtelKey(keyId: number): Promise<any> {
    this.dialogService.openRestingSoldierSelectorDialog(this.userSoldiers)
    .afterClosed().subscribe( async (soldierId: any) => {
      if (soldierId || soldierId === 0) {
        console.log(soldierId);
        await this.restingAreaService.useHoldtelKey(keyId, soldierId);
        this.getUserInfo();
      }
    });
  }
  
  /**
   * Withdraw a holdtel key
   * @param tokenId 
   */
  async withdrawKey(tokenId: number): Promise<any> {
    console.log(tokenId)
    await this.restingAreaService.withdrawKey(tokenId).then( () => {
      this.restingAreaService.getUserStakedHoldtelKeys();
    });
  }
  
  /**
   * Stake a land
   */
  async rentLand(): Promise<any> {
    this.dialogService.openNFTSelectorDialog(contractAddresses.land, this.connectionService.getWalletAddress(), false)
    .afterClosed().subscribe( async (tokenId: any) => {
      if (tokenId || tokenId === 0) {
        console.log(tokenId);
        await this.restingAreaService.rentLand(tokenId).then( () => {
          this.restingAreaService.getRentedLands();
        });
      }
    });
  }
  
  /**
   * Apply effect of a land to a soldier
   * @param keyId 
   */
  async addSoldierToLand(landTokenId: number): Promise<any> {
    this.dialogService.openRestingSoldierSelectorDialog(this.userSoldiers)
    .afterClosed().subscribe( async (soldierId: any) => {
      if (soldierId || soldierId === 0) {
        console.log(soldierId);
        await this.restingAreaService.addSoldierToLand(landTokenId, soldierId);
        this.getUserInfo();
      }
    });
  }
  
  /**
   * Withdraw a land
   * @param tokenId 
   */
  async unrentLand(tokenId: number): Promise<any> {
    console.log(tokenId)
    await this.restingAreaService.unrentLand(tokenId).then( () => {
      this.restingAreaService.getRentedLands();
    });
  }

  /**
   * Pagination
   */
  setPageByWindowWidth(): void {
    if (window.innerWidth > 1200) {
      this.setItemsPerPage(10, 'soldiers');
      this.setItemsPerPage(7, 'keys');
      this.setItemsPerPage(6, 'lands');
    } else if (window.innerWidth > 768) {
      this.setItemsPerPage(5, 'soldiers')
      this.setItemsPerPage(4, 'keys');
      this.setItemsPerPage(3, 'lands');
    } else if (window.innerWidth > 576) {
      this.setItemsPerPage(3, 'soldiers')
      this.setItemsPerPage(3, 'keys');
      this.setItemsPerPage(2, 'lands');
    } else {
      this.setItemsPerPage(2, 'soldiers')
      this.setItemsPerPage(2, 'keys');
      this.setItemsPerPage(1, 'lands');
    }
  }

  /**
   * Change page
   * @param isNext true next, false previous
   * @param pageType type for slider (soldiers, keys or lands)
   * @param landIndex only if is land pagination
   */
  changePage(isNext: boolean, pageType: string, landIndex?: number): void {
    let movement = 1;
    if (!isNext) { movement = -1; }
    if (pageType.toLowerCase() === 'soldiers') {
      this.soldiersPaginationPage += movement;
    } else if (pageType.toLowerCase() === 'keys') {
      this.keysPaginationPage += movement;
    } else if (pageType.toLowerCase() === 'lands' && landIndex > -1) {
      this.landsPaginationPage[landIndex] += movement;
    }
  }

  /**
   * Set the total page amount
   */
  setTotalPages(): void {
    this.soldiersTotalPages = Math.ceil(this.userSoldiers.length / this.soldiersPerPage) - 1;
    this.keysTotalPages = Math.ceil(this.userKeys.length / this.keysPerPage) - 1;
    this.landsTotalPages[0] = Math.ceil(this.rentedLands[0].length / this.landsPerPage) - 1;
    this.landsTotalPages[1] = Math.ceil(this.rentedLands[1].length / this.landsPerPage) - 1;
    this.landsTotalPages[2] = Math.ceil(this.rentedLands[2].length / this.landsPerPage) - 1;
    this.landsTotalPages[3] = Math.ceil(this.rentedLands[3].length / this.landsPerPage) - 1;
    this.landsTotalPages[4] = Math.ceil(this.rentedLands[4].length / this.landsPerPage) - 1;
  }

  /**
   * Sets the item amount to show on pagination
   * @param itemAmount item amount to set
   */
  setItemsPerPage(itemAmount: number, pageType: string): void {
    if (pageType.toLowerCase() === 'soldiers') {
      this.soldiersPerPage = itemAmount;
      this.setTotalPages();
      this.soldiersPaginationPage = this.soldiersPaginationPage <= this.soldiersTotalPages ? this.soldiersPaginationPage : this.soldiersTotalPages;
    } else if (pageType.toLowerCase() === 'keys') {
      this.keysPerPage = itemAmount;
      this.setTotalPages();
      this.keysPaginationPage = this.keysPaginationPage <= this.keysTotalPages ? this.keysPaginationPage : this.keysTotalPages;
    } else if (pageType.toLowerCase() === 'lands') {
      this.landsPerPage = itemAmount;
      this.setTotalPages();
      this.landsPaginationPage[0] = this.landsPaginationPage[0] <= this.landsTotalPages[0] ? this.landsPaginationPage[0] : this.landsTotalPages[0];
      this.landsPaginationPage[1] = this.landsPaginationPage[1] <= this.landsTotalPages[1] ? this.landsPaginationPage[1] : this.landsTotalPages[1];
      this.landsPaginationPage[2] = this.landsPaginationPage[2] <= this.landsTotalPages[2] ? this.landsPaginationPage[2] : this.landsTotalPages[2];
      this.landsPaginationPage[3] = this.landsPaginationPage[3] <= this.landsTotalPages[3] ? this.landsPaginationPage[3] : this.landsTotalPages[3];
      this.landsPaginationPage[4] = this.landsPaginationPage[4] <= this.landsTotalPages[4] ? this.landsPaginationPage[4] : this.landsTotalPages[4];
    }
    
  }

}
