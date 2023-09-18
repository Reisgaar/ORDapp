import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface UserData {
  firstName: string;
  lastName: string;
  street: string;
  zipcode: string;
  city: string;
  state: string;
  country: string;
  idNumber: string;
  phone: string;
  email: string;
  wallet: string;
  tokenId: number;
  tokenAddress: string;
  match: string;
  sendToShop: boolean;
}

interface UpdateData {
  hash: string;
  wallet: string;
  tokenId: number;
  tokenAddress: string;
}

interface DeleteData {
  wallet: string;
  tokenId: number;
  tokenAddress: string;
}

/**
 * Service to manage data of user on partner NFT redemptions
 */
@Injectable({
  providedIn: 'root'
})
export class PartnerApiService {

  constructor(private httpClient: HttpClient) { }

  /**
   * Adds user data to database
   * @param userData : data get on form
   * @param signedData : transaction signature
   * @returns : result of the request
   */
  public addUserData(userData: UserData, signedData: any): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        signedData
      })
    };
    console.log(userData);
    return this.httpClient.post(environment.partnerMailerApi + 'customers', userData, options);
  }

  /**
   * Updates data of a user on the database
   * @param userData : data get on form
   * @returns : result of the request
   */
  public updateUserData(userData: UpdateData): Observable<any> {
    console.log(userData);
    return this.httpClient.patch(environment.partnerMailerApi + 'customers', userData);
  }

  /**
   * Deletes a user from de database
   * @param userData : data get on form
   * @returns : result of the request
   */
  public deleteUserData(userData: DeleteData): Observable<any> {
    console.log(userData);
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: userData,
    };
    return this.httpClient.delete(environment.partnerMailerApi + 'customers', options);
  }
}
