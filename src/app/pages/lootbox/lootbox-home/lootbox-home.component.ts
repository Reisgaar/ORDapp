import { Component, OnInit } from '@angular/core';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { LootboxService } from 'src/app/shared/services/lootboxes/lootbox.service';

/**
 * Home page of lootbox section
 */
@Component({
  selector: 'app-lootbox-home',
  templateUrl: './lootbox-home.component.html',
  styleUrls: ['./lootbox-home.component.scss']
})
export class LootboxHomeComponent implements OnInit {

  interval: any;
  discountTier: number = NaN;
  freeTier: number = NaN;
  discount: number = NaN;
  constructor(
    private lootboxService: LootboxService,
    private connectionService: ConnectionService
  ) {}

  /**
   * Get whitelists
   */
  ngOnInit(): void {
    this.getDiscountWhiteList();
    this.getFreeWhiteList();
    this.interval = setInterval(() => {
      if (this.connectionService.isWalletConnected()) {
        this.getDiscountWhiteList();
        this.getFreeWhiteList();
      }
    }, 3000);
  }

  /**
   * Get discount whitelist
   */
  async getDiscountWhiteList(): Promise<any> {
    const r = await this.lootboxService.getDiscountWhiteList();
    if (r?.status === true) {
      this.discountTier = Number(r.tier);
      this.discount = Number(r.discount) / 100;
    } else {
      this.discountTier = NaN;
      this.discount = NaN;
    }
  }

  /**
   * Get free whitelist
   */
  async getFreeWhiteList(): Promise<any> {
    const r = await this.lootboxService.getFreeWhiteList();
    if (r?.status === true) {
      this.freeTier = Number(r.tier);
    } else {
      this.freeTier = NaN;
    }
  }

}
