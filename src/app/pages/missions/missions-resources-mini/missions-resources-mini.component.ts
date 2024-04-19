import { Component, OnDestroy, OnInit } from '@angular/core';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { MissionsSharedService } from 'src/app/shared/services/missions/missions-shared.service';
import { MissionsWarehouseService } from 'src/app/shared/services/missions/missions-warehouse.service';
import { TokenService } from 'src/app/shared/services/token/token.service';

@Component({
  selector: 'app-missions-resources-mini',
  templateUrl: './missions-resources-mini.component.html',
  styleUrls: ['./missions-resources-mini.component.scss']
})
export class MissionsResourcesMiniComponent implements OnInit, OnDestroy {
  rank: number;
  treasures: number;
  soldiers: number;
  fuel: number;
  food: number;
  gq: number;
  dataIsLoaded: boolean = false;
  interval: any;

  constructor(
    private connectionService: ConnectionService,
    private tokenService: TokenService,
    private warehouseService: MissionsWarehouseService,
    private missionsSharedService: MissionsSharedService,
  ) { }

  /**
   * Sets 20s interval to refresh user data
   */
  ngOnInit(): void {
    this.getUserInfo();
    this.interval = setInterval(() => {
      this.getUserInfo();
    }, 20000);
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
   * Gets te info of the user
   */
  async getUserInfo(): Promise<any> {
    await this.setGq();
    await this.setWarehouseValues();
    await this.setRankAndSoldiers();
    this.dataIsLoaded = true;
  }

  /**
   * Sets the soldier and rank values
   */
  async setRankAndSoldiers(): Promise<any> {
    const info = await this.missionsSharedService.getUserRankAndSoldiers();
    this.soldiers = info.soldiers;
    this.rank = info.rank;
  }
  
  /**
   * Sets the warehouse resources values
   */
  async setWarehouseValues(): Promise<any> {
    const resources = await this.warehouseService.getUserWarehouseInfo();
    this.food = resources.resources.food.amount;
    this.fuel = resources.resources.fuel.amount;
    this.treasures = resources.resources.treasures.amount;
  }
  
  /**
   * Sets the GQ value
   */
  async setGq(): Promise<any> {
    const gqWei = await this.tokenService.getBalanceOfToken(contractAddresses.gq);
    this.gq = parseFloat(this.connectionService.fromWei(gqWei));
  }

}
