import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { MissionsWarehouseService } from '../../../../shared/services/missions/missions-warehouse.service';
import { gqPriceOnBusd } from 'src/app/constants/pricesOnBusd';
import { OracleApiService } from '../../../../shared/services/oracle-api.service';
import { MissionsBankService } from 'src/app/shared/services/missions/missions-bank.service';
import { DialogService } from '../../../../shared/services/dialog.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-missions-bank',
  templateUrl: './missions-bank.component.html',
  styleUrls: ['./missions-bank.component.scss']
})
export class MissionsBankComponent implements OnInit, OnDestroy {
  gqPrice: number = gqPriceOnBusd[0];
  treasureGqExchangeRate: number = 0;
  priceLoaded: boolean = false;
  dataIsLoaded: boolean = false;
  userTreasuresAmount: number = 0;
  amountToExchange: number = 0;
  balanceError: boolean = false;
  maxPerWindowError: boolean = false;
  windowDurations: number[];
  exchangeFee: number;
  userWindowStart: string;
  maxTreasureAmountPerWindow: number;
  interval: any;

  constructor(
    private connectionService: ConnectionService,
    private warehouseService: MissionsWarehouseService,
    private bankService: MissionsBankService,
    private oracleService: OracleApiService,
    private dialogService: DialogService
  ) { }
  
  /**
   * Gets user data
   */
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
   * Get the info of the user
   */
  async getUserInfo(): Promise<any> {
    await this.getUserAmounts();
    await this.getPricesOnUsd();
    await this.getUserBankInfo();
    this.dataIsLoaded = true;
  }
  
  /**
   * Get user treasures amount
   */
  async getUserAmounts(): Promise<any> {
    const warehouseInfo = await this.warehouseService.getUserWarehouseInfo();
    this.userTreasuresAmount = parseInt(warehouseInfo.resources.treasures.amount);
  }

  async getPricesOnUsd(): Promise<any> {
    this.oracleService.getTokenPricesOnUsdDex()?.subscribe( (res: any) => {
      this.gqPrice = res['outer-ring'].usd;
      this.priceLoaded = true;
    });
  }
  
  /**
   * Get user bank information
  */
 async getUserBankInfo(): Promise<any> {
    await this.getExchangeRate();
    this.windowDurations = await this.bankService.getExchangeWindowDurations();
    this.exchangeFee = await this.bankService.getExchangeFee();
    this.userWindowStart = await this.bankService.getUserExchangeWindowStart();
    this.maxTreasureAmountPerWindow = await this.bankService.getTreasuresMaxAmountPerWindow();
    console.log(this.windowDurations)
    console.log(this.userWindowStart)
  }
  
  /**
   * Get treasure/GQ exchange rate
   */
  async getExchangeRate(): Promise<any> {
    const exchangeRate = await this.bankService.getExchangeRate();
    this.treasureGqExchangeRate = parseFloat(this.connectionService.fromWei(exchangeRate));
    this.interval = setInterval(async () => {
      const exchangeRate = await this.bankService.getExchangeRate();
      this.treasureGqExchangeRate = parseFloat(this.connectionService.fromWei(exchangeRate));
    }, 30000);
  }

  /**
   * Sets the max amount for the input
   */
  setInputMaxAmount(): void {
    this.amountToExchange = this.userTreasuresAmount < this.maxTreasureAmountPerWindow ? this.userTreasuresAmount : this.maxTreasureAmountPerWindow;
    this.validateAmount();
  }

  /**
   * Control the inputs on the form
   * @param event key press event
   */
  controlInput(event: any): void {
    // If not number prevent default
    if (isNaN(parseInt(event.key, 0))) {
      event.preventDefault();
    }
    // If , or . prevent
    if ((event.key === ',' || event.key === '.') && !event.target.value.includes('.')) {
      event.preventDefault();
    }
    // If first enter, remove 0
    if (event.target.value === '0' && !isNaN(parseInt(event.key, 0))) {
      event.target.value = '';
    }
  }

  /**
   * Validates the form
   * @returns true if is valid
   */
  async validateAmount(): Promise<any> {
    this.balanceError = false;
    this.maxPerWindowError = false;
    if (this.amountToExchange && this.amountToExchange !== 0) {
      this.balanceError = this.amountToExchange > this.userTreasuresAmount;
      this.maxPerWindowError = this.amountToExchange > this.maxTreasureAmountPerWindow;
      if (this.balanceError || this.maxPerWindowError) {
        return false;
      } else {
        return true;
      }
    } else {
      this.amountToExchange = 0;
      return false;
    }
  }

  /**
   * Receive data when countdown ends
   * @param $event 
   */
  async receiveCounterData($event: any): Promise<void> {
    this.userWindowStart = (parseInt(this.userWindowStart) - 1).toString();
  }

  /**
   * Echange treasures for GQ
   */
  async exchangeTreasures(): Promise<any> {
    this.bankService.exchange(this.amountToExchange).then(async (res) => {
      if (res === true) {
        this.userWindowStart = await this.bankService.getUserExchangeWindowStart();
      }
    });
  }

  /**
   * Reroll window
   */
  async rerollWindow(): Promise<any> {
    this.bankService.rerollExchangeWindow().then(async (res) => {
      if (res === true) {
        this.userWindowStart = await this.bankService.getUserExchangeWindowStart();
      }
    });
  }
}
