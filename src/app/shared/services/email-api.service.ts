import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface MailChimpResponse {
  result: string;
  msg: string;
}

/**
 * Service to manage email stuff
 */
@Injectable({
  providedIn: 'root'
})
export class EmailApiService {
  mailChimpEndpoint = 'https://gmail.us2.list-manage.com/subscribe/post-json?u=61b0a321bdec493ddd1a88a4a&id=a2987c4201';
  submitted = false;
  error = '';

  constructor(
    private httpClient: HttpClient
  ) { }

  /**
   * Subscribe the email to OR newsletter
   * @param email : email to subscribe
   * @returns : the response of the request
   */
  public subscribeToNewsletter(email: string): any {
    console.log(email);
    const params = new HttpParams()
      .set('EMAIL', email)
      .set('subscribe', 'Subscribe')
      .set('group[52514][1]', 'true')
      .set('b_61b0a321bdec493ddd1a88a4a_a2987c4201', '');
    const mailChimpUrl = `${this.mailChimpEndpoint}&${params.toString()}`;
    console.log(mailChimpUrl);
    return this.httpClient.jsonp<MailChimpResponse>(mailChimpUrl, 'c');
  }

  /**
   * Sends a proposal to OR email
   * @param data : data to send on mail
   * @param cid : hashed data
   * @returns : the response of the request
   */
  public sendProposalEmail(data: any, cid: string): Observable<any> {
    return this.httpClient.post<any>(environment.mailerApi + 'email/sendProposal/', { data, cid });
  }

}
