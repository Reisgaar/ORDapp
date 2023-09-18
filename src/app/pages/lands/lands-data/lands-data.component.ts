import { Component, OnDestroy, OnInit } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { getFinishedLandAuctions, getLandOwners } from 'src/app/constants/gqlQueries';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';

@Component({
  selector: 'app-lands-data',
  templateUrl: './lands-data.component.html',
  styleUrls: ['./lands-data.component.scss']
})
export class LandsDataComponent implements OnInit, OnDestroy {
  landAuctionsQuery: any;
  landAuctionsQuerySubscription: any;
  landOwnersQuery: any;
  landOwnersQuerySubscription: any;
  allLands: any[] = [];
  nanoLands: any[] = [];
  microLands: any[] = [];
  standardLands: any[] = [];
  macroLands: any[] = [];
  megaLands: any[] = [];
  allHighSale: number;
  nanoHighSale: number;
  microHighSale: number;
  standardHighSale: number;
  macroHighSale: number;
  megaHighSale: number;
  allSaleVolume: number;
  nanoSaleAverage: number;
  microSaleAverage: number;
  standardSaleAverage: number;
  macroSaleAverage: number;
  megaSaleAverage: number;
  totalHolders: number;
  dataLoaded = false;
  roundPhaseData: any = {};
  speedInterval: any;

  constructor(
    private connectionService: ConnectionService,
    private apollo: Apollo
  ) { }

  ngOnInit(): void {
    this.getFinishedLandsAuctionData();
    this.getLandOwnersData();
  }

  /**
   * Ends interval and subscriptions if exist
   */
  ngOnDestroy(): void {
    if (this.landAuctionsQuerySubscription) { this.landAuctionsQuerySubscription.unsubscribe(); }
    if (this.landOwnersQuerySubscription) { this.landOwnersQuerySubscription.unsubscribe(); }
    if (this.speedInterval) { clearInterval(this.speedInterval); }
  }


  /**
   * Get land auction sales info
   */
  getFinishedLandsAuctionData(): void {
    this.landAuctionsQuery = this.apollo.use('lands').watchQuery({
      query: getFinishedLandAuctions,
      pollInterval: 3000,
      variables: {}
    });
    this.landAuctionsQuerySubscription = this.landAuctionsQuery
      .valueChanges
      .subscribe( async (res: any) => {
        if (res.data.salesData) {
          this.manageLandsData(res.data.salesData);
        }
      });
  }


  /**
   * Get land auction sales info
   */
  getLandOwnersData(): void {
    this.landOwnersQuery = this.apollo.use('lands').watchQuery({
      query: getLandOwners,
      pollInterval: 3000,
      variables: {}
    });
    this.landOwnersQuerySubscription = this.landOwnersQuery
      .valueChanges
      .subscribe( async (res: any) => {
        if (res.data.owners) {
          this.manageOwnersData(res.data.owners);
        }
      });
  }

  /**
   * Process the given array to extract auctions data
   * @param data : the array to process
   */
  async manageLandsData(frozenData: any[]): Promise<any> {
    let data = JSON.parse( JSON.stringify( frozenData ) );
    this.allLands = await this.processNumbers(data);
    console.log(this.allLands);
    await this.setSizeArrays();
    await this.setHighestSale();
    await this.setAllSaleVolume();
    await this.setAveragePrice();
    await this.setRoundPhaseData();
    await this.setNewOwners();
    this.dataLoaded = true;
    this.setScrollSpeed();
  }

  /**
   * Process the given array to extract owners data
   * @param data : the array to process
   */
  async manageOwnersData(data: any[]): Promise<any> {
    this.totalHolders = 0;
    let holdersWallets: any[] = [];
    data.map(land => {
      if (!holdersWallets.includes(land.currentOwner.toLowerCase())) {
        holdersWallets.push(land.currentOwner.toLowerCase())
        this.totalHolders++;
      }
    });
  }

  /**
   * Process the given array to set finalPrice as number
   * @param data : the array to process
   */
  async processNumbers(data: any[]): Promise<any[]> {
    for (let land of data) {
      if (typeof land.finalPrice !== 'number'){
        land.finalPrice = this.connectionService.fromWei(land.finalPrice);
        land.finalPrice = parseFloat(land.finalPrice);
      }
    }
    return data;
  }

  /**
   * Set each size array
   */
  async setSizeArrays(): Promise<any> {
    this.nanoLands = this.allLands.filter(land => land.size.toLowerCase() === 'nano');
    this.microLands = this.allLands.filter(land => land.size.toLowerCase() === 'micro');
    this.standardLands = this.allLands.filter(land => land.size.toLowerCase() === 'standard');
    this.macroLands = this.allLands.filter(land => land.size.toLowerCase() === 'macro');
    this.megaLands = this.allLands.filter(land => land.size.toLowerCase() === 'mega');
  }

  /**
   * Set the highest sale amount of each size
   */
  async setHighestSale(): Promise<any> {
    this.allHighSale = Math.max(...this.allLands.map(land => land.finalPrice));
    this.nanoHighSale = Math.max(...this.nanoLands.map(land => land.finalPrice));
    this.microHighSale = Math.max(...this.microLands.map(land => land.finalPrice));
    this.standardHighSale = Math.max(...this.standardLands.map(land => land.finalPrice));
    this.macroHighSale = Math.max(...this.macroLands.map(land => land.finalPrice));
    this.megaHighSale = Math.max(...this.megaLands.map(land => land.finalPrice));
  }

  /**
   * Set the average sale amount of each size
   */
  async setAveragePrice(): Promise<any> {
    this.nanoSaleAverage = await this.getAverageOf(this.nanoLands);
    this.microSaleAverage = await this.getAverageOf(this.microLands);
    this.standardSaleAverage = await this.getAverageOf(this.standardLands);
    this.macroSaleAverage = await this.getAverageOf(this.macroLands);
    this.megaSaleAverage = await this.getAverageOf(this.megaLands);
  }

  /**
   * Get the average buyout price of given array
   * @param : the array to process
   * @return : processed array
   */
  async getAverageOf(data: any[]): Promise<number> {
    let average = 0;
    data.map(land => average += land.finalPrice);
    return average / data.length;
  }

  /**
   * Sets the total volume of all sales
   */
  async setAllSaleVolume(): Promise<any> {
    this.allSaleVolume = 0;
    this.allLands.map(land => this.allSaleVolume += land.finalPrice);
  }

  /**
   * Sets the data of phases
   */
  async setRoundPhaseData(): Promise<any> {
    await this.setRounds();
    for (let land of this.allLands) {
      if (this.roundPhaseData[land.startTimeStamp]) {
        this.roundPhaseData[land.startTimeStamp].totalBids += land.walletsThatBid.length;
        this.roundPhaseData[land.startTimeStamp].volume += land.finalPrice;
        this.roundPhaseData[land.startTimeStamp].nftSold++;
        // Set correct final price
        if (this.roundPhaseData[land.startTimeStamp].highestSale < land.finalPrice) {
          this.roundPhaseData[land.startTimeStamp].highestSale = land.finalPrice;
        }
        // Set if is buyout or not
        if (land.hasBeenBuyout === true) {
          this.roundPhaseData[land.startTimeStamp].totalBuyouts++;
        }
        // Set owners of round
        if (!this.roundPhaseData[land.startTimeStamp].owners) {
          this.roundPhaseData[land.startTimeStamp].owners = [land.buyerWallet]
        } else if (!this.roundPhaseData[land.startTimeStamp].owners.includes(land.buyerWallet)) {
          this.roundPhaseData[land.startTimeStamp].owners.push(land.buyerWallet);
        }

      }
    }
    console.log(this.roundPhaseData);
  }

  /**
   * Set new owners of each phase
   */
  async setNewOwners(): Promise<any> {
    let totalOwners: any[] = []
    let counter = 0;
    for (let phase in this.roundPhaseData) {
      this.roundPhaseData[phase].newOwners = [];
      await this.roundPhaseData[phase].owners.map( (owner: any) => {
        if (!totalOwners.includes(owner.toLowerCase())) {
          counter++;
          this.roundPhaseData[phase].newOwners.push(owner.toLowerCase());
          totalOwners.push(owner.toLowerCase());
        }
      });
    }
    console.log('counter: ', counter);
    console.log(this.roundPhaseData);
  }

  /**
   * Sets the rounds to show on scroll
   */
  async setRounds(): Promise<any> {
    let times: any[] = [];
    this.roundPhaseData = {};
    this.allLands.forEach(land => {
      if (!times.includes(parseInt(land.startTimeStamp, 0))) {
        times.push(parseInt(land.startTimeStamp, 0));
      }
    });
    times.sort();
    let round = 1;
    let phase = 1;
    for (let t of times) {
      this.roundPhaseData[t] = { round, phase, totalBids: 0, volume: 0, nftSold: 0, highestSale: 0, totalBuyouts: 0 };
      phase++;
      if (phase > 5) {
        phase = 1;
        round++;
      }
    }
  }

  /**
   * Sets the scroll speed based on elements width
   */
  setScrollSpeed(): void {
    try {
      const el1 = document.getElementById('lands-statistics-1');
      const el2 = document.getElementById('lands-statistics-2');
      const width = el1.offsetWidth;
      el1.style.animation = 'data-scroll-1 ' + (width / 100 * 2) + 's linear infinite';
      el2.style.animation = 'data-scroll-2 ' + (width / 100 * 2) + 's linear infinite';
      if (this.speedInterval) { clearInterval(this.speedInterval); }
    } catch (error: any) {
      this.speedInterval = setInterval(() => {
        this.setScrollSpeed();
      }, 3000);
    }

  }

}
