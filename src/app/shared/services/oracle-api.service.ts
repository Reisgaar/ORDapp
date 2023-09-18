import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, catchError } from 'rxjs';
import { bnbPriceOnBusd, gqPriceOnBusd } from 'src/app/constants/pricesOnBusd';

/**
 * Service to get prices of tokens
 */
@Injectable({
  providedIn: 'root'
})
export class OracleApiService {

  constructor(
    private httpClient: HttpClient
  ) { }

  /**
   * Gets the prices of a token on BUSD
   * @returns : result of the request
   */
  public getTokenPricesOnUsd(): void {
    this.httpClient.get<any>('https://api.coingecko.com/api/v3/simple/price?ids=outer-ring,binancecoin&vs_currencies=usd')
    .subscribe( (res: any) => {
      bnbPriceOnBusd[0] = res.binancecoin.usd;
      gqPriceOnBusd[0] = res['outer-ring'].usd;
    });
  }

  /**
   * Gets the prices of a token on BUSD
   * @returns : result of the request
   */
  public getTokenPricesOnUsdDex(): Observable<any> | undefined {
    return this.httpClient.get<any>('https://api.coingecko.com/api/v3/simple/price?ids=outer-ring,binancecoin,cryptopolis,inpulse-x-2,space-corsair-key&vs_currencies=usd')
    .pipe(
      catchError( (error, caught) => EMPTY )
    );
  }
}
