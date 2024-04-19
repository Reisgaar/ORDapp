import { Component, OnDestroy, OnInit } from '@angular/core';
import { MissionsMissionsService } from 'src/app/shared/services/missions/missions-missions.service';
import { MissionsWarehouseService } from 'src/app/shared/services/missions/missions-warehouse.service';
import { MissionsSharedService } from 'src/app/shared/services/missions/missions-shared.service';

@Component({
  selector: 'app-missions-missions',
  templateUrl: './missions-missions.component.html',
  styleUrls: ['./missions-missions.component.scss']
})
export class MissionsMissionsComponent implements OnInit, OnDestroy {
  dataIsLoaded: boolean = false;
  missions: any = {};
  userResources: any = { militaryLevel: 0, numSoldiers: 0, food: 0, fuel: 0, treasures: 0 };
  interval: any;
  // Pagination
  missionsMaxLevel = 4;
  shownLevel: number = 1;
  missionsPerPage: number = 3;
  missionsPaginationPage: number = 0;
  missionsTotalPages: number = 1;

  constructor(
    private missionsService: MissionsMissionsService,
    private warehouseService: MissionsWarehouseService,
    private missionsSharedService: MissionsSharedService
  ) { }

  ngOnInit(): void {
    this.getUserInfo();
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
   * Get user info for missions
   */
  async getUserInfo(): Promise<any> {
    await this.getUserRequirements();
    await this.getMissionsInfo();
    this.interval = setInterval(() => {
      this.getUserRequirements();
    }, 20000);
  }

  /**
   * Get missions info
   */
  async getMissionsInfo(): Promise<any> {
    this.dataIsLoaded = false;
    if (!this.missions['level' + this.shownLevel]) {
      this.missions['level' + this.shownLevel] = await this.missionsService.getMissionsByLevel(this.shownLevel);
    }
    console.log(this.missions);
    this.dataIsLoaded = true;
  }

  /**
   * Change selected level slider
   * @param isNext true next, false previous
   */
  changeMissionLevel(isNext: boolean): void {
    const move = isNext ? 1 : -1;
    this.shownLevel = this.shownLevel + move < 1 ? this.missionsMaxLevel : this.shownLevel + move > this.missionsMaxLevel ? 1 : this.shownLevel + move;
    this.getMissionsInfo();
  }

  /**
   * Get user resources to check requirements
   */
  async getUserRequirements(): Promise<any> {
    const info = await this.missionsSharedService.getUserRankAndSoldiers();
    this.userResources.numSoldiers = info.soldiers;
    this.userResources.militaryLevel = info.rank;
    const resources = await this.warehouseService.getUserWarehouseInfo();
    this.userResources.food = resources.resources.food.amount;
    this.userResources.fuel = resources.resources.fuel.amount;
    this.userResources.treasures = resources.resources.treasures.amount;
    console.log(this.userResources)
  }
}
