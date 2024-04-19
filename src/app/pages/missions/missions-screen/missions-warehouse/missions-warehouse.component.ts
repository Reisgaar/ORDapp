import { Component, OnDestroy, OnInit } from '@angular/core';
import { MissionsWarehouseService } from 'src/app/shared/services/missions/missions-warehouse.service';

@Component({
  selector: 'app-missions-warehouse',
  templateUrl: './missions-warehouse.component.html',
  styleUrls: ['./missions-warehouse.component.scss']
})
export class MissionsWarehouseComponent implements OnInit, OnDestroy {
  userWarehouseInfo: any;
  dataIsLoaded: boolean = false;
  interval: any;
  prices: { level1: any; level2: any; level3: any; };
  showLeveling: boolean = false;
  actualLevel: number = 0;

  constructor(
    private warehouseService: MissionsWarehouseService
  ) { }

  /**
   * Sets 10s interval to refresh user data
   */
  ngOnInit(): void {
    this.getUserInfo();
    this.interval = setInterval(() => {
      this.getUserInfo();
    }, 10000);
  }
  
  async getUpgradePrices(): Promise<any> {
    const level1 = await this.warehouseService.getUpgradePrices(1);
    const level2 = await this.warehouseService.getUpgradePrices(2);
    const level3 = await this.warehouseService.getUpgradePrices(3);
    this.prices = { level1, level2, level3 }
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
   * Get all needed user info
  */
 async getUserInfo(): Promise<any> {
   this.userWarehouseInfo = await this.warehouseService.getUserWarehouseInfo();
   if (this.dataIsLoaded === false) {
     await this.getUpgradePrices();
   }
   this.actualLevel = typeof this.userWarehouseInfo.level !== 'number' ? parseInt(this.userWarehouseInfo.level) : this.userWarehouseInfo.level;
   this.dataIsLoaded = true;
   console.log(this.actualLevel)
   console.log(this.userWarehouseInfo);
  }

  /**
   * Upgrades the warehouse to the given level
   * @param level level to upgrade to
   */
  async upgradeLevel(level: number): Promise<any> {
    await this.warehouseService.upgradeLevel(level);
    this.getUserInfo();
  }

}
