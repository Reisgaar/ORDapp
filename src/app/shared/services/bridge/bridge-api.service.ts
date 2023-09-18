import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

/**
 * Service to manage data of wallet on bridge transactions
 */
@Injectable({
  providedIn: 'root'
})
export class BridgeApiService {

  constructor(private httpClient: HttpClient) { }

  /**
   * Check if wallet is valid to bridge
   * @param wallet : wallet address of the user
   * @returns : true if is valid
   */
  public async walletIsValid(wallet: string): Promise<any> {
    console.log(wallet);
    return await this.httpClient.get<any>(environment.blockchainBridgeApi + 'validation/wallet/' + wallet).toPromise();
  }
}
