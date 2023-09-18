import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * Service to get blog data
 */
@Injectable({
  providedIn: 'root'
})
export class OuterRingBlogService {
  blogQuery1 = 'https://outerringmmo.com';
  blogQuery2 = '/wp-json/wp/v2/posts?_fields[]=title&_fields[]=link&_fields[]=postmod_data.newacf.imagen_a.sizes.thumbnail&_fields[]=excerpt.rendered&per_page=';

  constructor(
    private httpClient: HttpClient,
    private translate: TranslateService
  ) {}

  /**
   * Gets last entries of OR Blog
   * @param amount : amount of results wanted
   * @returns : result of the request
   */
  public getBlogLastEntries(amount: number): any {
    let lang = '';
    if (this.translate.currentLang && this.translate.currentLang !== 'en') {
      lang = '/' + this.translate.currentLang.toLowerCase();
    } else if (!this.translate.currentLang && this.translate.defaultLang !== 'en') {
      lang = '/' + this.translate.defaultLang.toLowerCase();
    }
    return this.httpClient.get<any>(this.blogQuery1 + lang + this.blogQuery2 + amount);
  }
}
