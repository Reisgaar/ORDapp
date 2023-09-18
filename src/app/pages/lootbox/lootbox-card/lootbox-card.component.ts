import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { lootboxData } from 'src/app/constants/lootboxes';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { BuyLootboxService } from 'src/app/shared/services/lootboxes/buy-lootbox.service';
import { LootboxService } from 'src/app/shared/services/lootboxes/lootbox.service';
import { PopUpLootboxUtilitiesComponent } from '../pop-up-lootbox-utilities/pop-up-lootbox-utilities.component';

/**
 * Card with info and interaction of a lootbox
 */
@Component({
  selector: 'app-lootbox-card',
  templateUrl: './lootbox-card.component.html',
  styleUrls: ['./lootbox-card.component.scss']
})
export class LootboxCardComponent implements OnInit, OnDestroy {
  public itemList: Array<any> = [];
  @Input() category: any;
  @Input() free: boolean;
  @Input() disc: boolean;
  @Input() discount: any;
  actualPrice: any = 0;
  actualSupply: any = 0;
  interval: any;
  windowSize: number;
  // Slider variables
  sliderLength: number;
  sliderPosition = 0;
  sliderMaxPosition: number;
  shownReward: string = '';

  constructor(
    private connectionService: ConnectionService,
    private lootboxService: LootboxService,
    private buyLootboxService: BuyLootboxService,
    public dialog: MatDialog
  ) {
    this.itemList = lootboxData;
    this.windowSize = window.innerWidth;
  }

  /**
   * Change slider on resize
   */
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.windowSize = window.innerWidth;
    this.setSliderMaxPos();
  }

  /**
   * Control sliders and get lootboxes supplies
   */
  ngOnInit(): void {
    this.sliderLength = this.itemList[this.category].rewards.length;
    this.setSliderMaxPos();
    this.getSupplyAndPrice();
    // Set interval to get price and supply every 3s
    this.interval = setInterval(() => {
      this.getSupplyAndPrice();
    }, 3000);
  }

  /**
   * Clear interval
   */
  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  /**
   * Get suply and price of lootbox
   */
  getSupplyAndPrice(): void {
    this.lootboxService.getSupplyByTier(this.category).then( (res: any) => {
      this.actualSupply = res;
    });
    if (this.itemList[this.category].name === 'Mystery') {
      this.actualPrice = 3;
    } else {
      this.lootboxService.getLootboxPrice(this.category, 0).then( (res: any) => {
        if (res){
          this.actualPrice = parseFloat(this.connectionService.fromWei(res));
        }
      });
    }
  }

  /**
   * Buy a lootbox
   * @param {number} tier : The tier of the lootbox
   * @param {number} paymentCoin : The coin used on the payment
   */
  public buyLootbox(tier: number, paymentCoin: number): void {
    this.buyLootboxService.startBuyLootbox(tier, paymentCoin);
  }

  /**
   * Buy a mistery box
   */
  public buyMystery(): void {
    this.buyLootboxService.startBuyMystery();
  }

  /**
   * Buy a free lootbox with whitelist
   */
  public buyFreeWhiteList(): void {
    this.buyLootboxService.buyFreeWhiteList();
  }

  /**
   * Buy a lootbox with discount
   */
  public buyDiscountWhiteList(): void {
    this.buyLootboxService.buyDiscountWhiteList();
  }

  /**
   * Moves the slider one step
   * @param {boolean} isNext : Move the slider, true for next, false for previous
   */
  public moveSlider(isNext: boolean): void {
    if (isNext) {
      this.sliderPosition = this.sliderPosition - 80;
      if (this.sliderPosition < this.sliderMaxPosition) { this.sliderPosition = 0; }
    } else {
      this.sliderPosition = this.sliderPosition + 80;
      if (this.sliderPosition > 0) { this.sliderPosition = this.sliderMaxPosition; }
    }
    const el = document.getElementById('items' + this.category);
    if (el) { el.style.left = this.sliderPosition + 'px'; }
  }

  /**
   * Sets the slider maximum position
   */
  setSliderMaxPos(): void {
    if (window.innerWidth > 576) {
      this.sliderMaxPosition = ( 80 * (this.sliderLength - 4)) * -1;
    } else {
      this.sliderMaxPosition = ( 80 * (this.sliderLength - 2)) * -1;
    }
  }

  /**
   * Opens utilities pop up of the selected lootbox
   * @param {string} id : The id of the selected lootbox
   */
  openUtilitiesPopUp(id: string): void {
    this.dialog.open(PopUpLootboxUtilitiesComponent, {
      panelClass: 'lootbox-dialog-container',
      data: { id }
    });
  }

  /**
   * Sets the reward text to be shown
   * @param {string} data : The text of the reward
   */
  setShownReward(data: string): void {
    this.shownReward = data;
  }

  followCursorSpot(event: any): void {
    const el = document.getElementById('lootbox-main-' + this.category);
    const spot = document.getElementById('spotlight-' + this.category);
    const wrap = document.getElementById('spotlight-wrapper-' + this.category);
    const box = el.getBoundingClientRect();
    const posX = (box.left - event.clientX) * -100 / box.width;
    const posY = (box.top - event.clientY) * -100 / box.height;
    spot.style.top = posY + '%';
    spot.style.left = posX + '%';
    wrap.style.opacity = '1';
  }

  clearCursorSpot(event: any): void {
    const el = document.getElementById('spotlight-wrapper-' + this.category);
    el.style.opacity = '0';
  }
}
