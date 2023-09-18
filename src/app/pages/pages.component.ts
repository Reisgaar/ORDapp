import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { bnbPriceOnBusd, gqPriceOnBusd, ipxPriceOnBusd, sckPriceOnBusd, cpoPriceOnBusd} from '../constants/pricesOnBusd';
import { props } from '../constants/proposalsData';
import { ProposalService } from '../shared/services/governance/proposal.service';
import { OracleApiService } from '../shared/services/oracle-api.service';

/**
 * Main component to show the output on router outlet
 */
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit, OnDestroy {
  interval: any;
  showToTopCursor: boolean = false;

  constructor(
    private oracleApiService: OracleApiService
  ) { }

  /**
   * Shows arrow to return to top after 800px height scrolled
   */
  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if (window.scrollY > 800) {
      this.showToTopCursor = true;
    } else {
      this.showToTopCursor = false;
    }
  }

  /**
   * Scrolls window to top
   */
  scrollToTop(): void {
    this.showToTopCursor = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Gets prices on BUSD refreshing every 30s
   */
  ngOnInit(): void {
    this.getPricesOnBusd();
    this.interval = setInterval(() => {
      this.getPricesOnBusd();
    }, 300000);
  }

  /**
   * Clear the interval
   */
  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  /**
   * Gets the prices of BNB and GQ on BUSD
   */
  getPricesOnBusd(): any {
    this.oracleApiService.getTokenPricesOnUsdDex()?.subscribe( (res: any) => {
      bnbPriceOnBusd[0] = res.binancecoin.usd;
      gqPriceOnBusd[0] = res['outer-ring'].usd;
      ipxPriceOnBusd[0] = res['inpulse-x-2'].usd;
      sckPriceOnBusd[0] = res['space-corsair-key'].usd;
      cpoPriceOnBusd[0] = res['cryptopolis'].usd;
    });
    this.oracleApiService.getTokenPricesOnUsd();
  }

}
