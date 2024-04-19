import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConnectionService } from '../../../../shared/services/connection/connection.service';
import { MissionsRecruitmentService } from '../../../../shared/services/missions/missions-recruitment.service';
import { gqPriceOnBusd } from 'src/app/constants/pricesOnBusd';
import { TokenService } from '../../../../shared/services/token/token.service';
import { contractAddresses } from 'src/app/constants/contractAddresses';

@Component({
  selector: 'app-missions-recruitment',
  templateUrl: './missions-recruitment.component.html',
  styleUrls: ['./missions-recruitment.component.scss']
})
export class MissionsRecruitmentComponent implements OnInit, OnDestroy {
  dataIsLoaded: boolean = false;
  selectedSoldierAmount: number = 1;
  maxSoldierAmount: number = 1;
  investmentAmount: string = '0';
  userGQAmount: string = '0';
  showLeveling: boolean = false;
  balanceError: boolean = false;
  investmentMaxError: boolean = false;
  campaignStarted: boolean = false;
  userRecruitmentInfo: any;
  interval: any;
  campaignDurationString: string;
  campaignProgress: number;
  campaignMaxValue: number;
  campaingProgressPercentage: number;
  prices: { level1: any; level2: any; };

  constructor(
    private connectionService: ConnectionService,
    private tokenService: TokenService,
    private recruitmentService: MissionsRecruitmentService
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
   * Get prices for upgrades
   */
  async getUpgradePrices(): Promise<any> {
    const level1 = await this.recruitmentService.getUpgradePrices(1);
    const level2 = await this.recruitmentService.getUpgradePrices(2);
    this.prices = { level1, level2 }
  }
  
  /**
   * Get all needed user info
  */
 async getUserInfo(): Promise<any> {
    this.userGQAmount = await this.tokenService.getBalanceOfToken(contractAddresses.gq);
    this.userRecruitmentInfo = await this.recruitmentService.getUserInfo();
    console.log(this.userRecruitmentInfo);
    this.setProgressBar();
    await this.setCampaignMaxValue();
    await this.setMaxSoldierAmount();
    await this.setCampaignDuration();
    this.setCampaignProgress();
    if (this.dataIsLoaded === false) {
      await this.getUpgradePrices();
    }
    this.dataIsLoaded = true;
  }

  /**
   * Sets percentage for the progress bar
   */
  setProgressBar(): void {
    const total = parseInt(this.userRecruitmentInfo.campaignInfo.endTime) - parseInt(this.userRecruitmentInfo.campaignInfo.startTime);
    const actual = (Date.now() / 1000)- parseInt(this.userRecruitmentInfo.campaignInfo.startTime);
    this.campaingProgressPercentage = actual * 100 / total;
  }
  
  /**
   * Set the max value for campaign investment
   */
  async setCampaignMaxValue(): Promise<any> {
    this.campaignMaxValue = parseFloat(this.connectionService.fromWei(await this.recruitmentService.getCampaignPriceByPercentage(100, this.selectedSoldierAmount)));
  }
  
  /**
   * Set the max soldier amount
   */
  async setMaxSoldierAmount(): Promise<any> {
    this.maxSoldierAmount = await this.recruitmentService.getUserMaxSoldiers(this.userRecruitmentInfo.campaignLevel);
  }
  
  /**
   * Set the duration of the campaign with the selected options
   */
  async setCampaignDuration(): Promise<any> {
    const investment = this.investmentAmount === '' ? '0' : this.connectionService.toWei(this.investmentAmount);
    const campaignDuration = await this.recruitmentService.getCampaignDuration(investment, this.selectedSoldierAmount);
    this.campaignDurationString = this.getCampaignDuration(campaignDuration);
  }

  /**
   * Upgrades the recruitment to the given level
   * @param level level to upgrade to
   */
  async upgradeLevel(level: number): Promise<any> {
    await this.recruitmentService.upgradeLevel(level);
    this.getUserInfo();
  }

  /**
   * Change the selected soldier amount
   * @param newAmount new soldier amount
   */
  changeSelectedSoldierAmount(isNext: boolean) {
    const move = isNext ? 1 : -1;
    const newSelectedAmount = this.selectedSoldierAmount + move;
    this.selectedSoldierAmount = newSelectedAmount > this.maxSoldierAmount ? 1 : newSelectedAmount < 1 ? this.maxSoldierAmount : newSelectedAmount;
    this.setCampaignMaxValue();
    this.setCampaignDuration();
  }

  /**
   * Gets the investment price for the given percentage
   * @param percentage percentage to get the price
   */
  async getPriceForPercentage(percentage: number): Promise<any> {
    const price = await this.recruitmentService.getCampaignPriceByPercentage(percentage, this.selectedSoldierAmount);
    this.investmentAmount = this.connectionService.fromWei(price);
    this.setCampaignDuration();
  }

  /**
   * Sets the string to show the campaing duration
   * @param timeInSeconds 
   * @returns string with X days h m s
   */
  getCampaignDuration(timeInSeconds: string): string {
    let seconds = parseInt(timeInSeconds);
    const days = Math.floor(seconds / 86400);
    seconds = seconds - (days * 86400);
    const hours = Math.floor(seconds / 3600);
    seconds = seconds - (hours * 3600);
    const minutes = Math.floor(seconds / 60);
    seconds = seconds - (minutes * 60);
    const daysString = days === 0 ? '' : days === 1 ? days + ' day' :  days + ' days';
    return daysString + ' ' + hours + 'h' + ' ' + minutes + 'm' + ' ' + seconds + 's';
  }

  /**
   * Sets the actual campaign progress to set the progress bar
   */
  setCampaignProgress(): void {
    // TODO: set correct functionality
    this.userRecruitmentInfo.campaignInfo.endTime;
    this.campaignProgress = 0;
  }

  /**
   * Starts campaign with the selected options
   */
  async startCampaign(): Promise<any> {
    await this.recruitmentService.startCampaign(this.connectionService.toWei(this.investmentAmount), this.selectedSoldierAmount).then( () => {
      this.campaignStarted = !this.campaignStarted;
      this.getUserInfo();
    });
  }

  /**
   * Claim the soldiers on campaign end
   */
  async recruitSoldiers(): Promise<any> {
    await this.recruitmentService.recruitSoldiers().then( () => {
      this.campaignStarted = !this.campaignStarted;
      this.getUserInfo();
    });
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
    // If , or . write . only once
    if ((event.key === ',' || event.key === '.') && !event.target.value.includes('.')) {
      const start = event.target.selectionStart;
      const end = event.target.selectionEnd;
      const oldValue = event.target.value;
      event.target.value = oldValue.slice(0, start) + '.' + oldValue.slice(end);
    }
    // Limit to 18 decimals
    if (event.target.value.indexOf('.') >= 0 && event.target.selectionStart > event.target.value.indexOf('.')) {
      event.target.value = event.target.value.slice(0, event.target.value.indexOf('.') + 18);
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
    this.investmentMaxError = false;
    this.setCampaignDuration();
    if (this.investmentAmount !== '' && this.investmentAmount !== '0') {
      this.investmentMaxError = this.maxAmountExceeded();
      this.balanceError = await this.balanceExceeded();
      if (this.investmentMaxError || this.balanceError) {
        return false;
      } else {
        return true;
      }
    } else {
      this.investmentAmount = '0';
      return false;
    }
  }

  /**
   * Check if balance is exceeded
   * @returns true if balance is exceeded
   */
  async balanceExceeded(): Promise<boolean> {
    // Transform to wei to avoid decimals and to BN to make comparison
    const selectedGqBN = await this.connectionService.ethers.utils.parseUnits(this.investmentAmount, "ether");
    const totalGqBN = await this.connectionService.ethers.utils.parseUnits(this.userGQAmount, "wei");
    const hasBalance = selectedGqBN.lte(totalGqBN);
    return !hasBalance;
  }

  /**
   * Check if max amount is exceeded
   * @returns true if max amount is exceeded
   */
  maxAmountExceeded(): boolean {
    if (parseFloat(this.investmentAmount) > this.campaignMaxValue) {
      return true;
    } else {
      return false;
    }
  }

}
