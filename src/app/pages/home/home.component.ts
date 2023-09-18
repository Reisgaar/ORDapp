import { Component, OnDestroy, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { EmailApiService } from 'src/app/shared/services/email-api.service';
import { OuterRingBlogService } from 'src/app/shared/services/outer-ring-blog.service';

/**
 * Home of the DAPP
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  email = '';
  emailError = false;
  emailSent = false;
  latestSales: Array<any> = [];
  hotBids: Array<any> = [];
  counterToSelectItem = 1;
  selectableItems = ['weapon', 'armor', 'landVehicle', 'spaceVehicle', 'clan'];
  selectedItem = 'weapon';
  interval: any;
  posts: Array<any> = [];
  postAmount = 3;

  constructor(
    private emailApiService: EmailApiService,
    private outerRingBlogService: OuterRingBlogService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.getBlogData();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.getBlogData();
    });
    this.interval = setInterval(() => {
      this.changeNftTag();
    }, 5000);
  }

  /**
   * Clears interval
   */
  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  /**
   * Get last posts from blog
   */
  getBlogData(): void {
    this.outerRingBlogService.getBlogLastEntries(this.postAmount).subscribe( (res: any) => {
      console.log('-------');
      console.log('-------');
      console.log('-------');
      console.log(res);
      this.posts = res;
    });
  }

  // NFT slider functions

  /**
   * Changes the NFT on the slideshow
   */
  changeNftTag(): void {
    this.selectedItem = this.selectableItems[this.counterToSelectItem];
    this.counterToSelectItem++;
    if (this.counterToSelectItem > this.selectableItems.length - 1) {
      this.counterToSelectItem = 0;
    }
  }

  /**
   * Change the NFT on the slideshow to clicked one
   * @param {string} tab : NFT tab to change to
   */
  clickToChangeTab(tab: number): void {
    this.counterToSelectItem = tab;
    this.selectedItem = this.selectableItems[tab];
  }

  // Newsletter subscribing functions

  /**
   * Submits email to newsletter subscription
   */
  submitEmail(): any {
    if (this.validateEmail()) {
      this.subscribeToNewsletter();
    } else {
      this.emailSent = false;
      this.emailError = true;
    }
  }

  /**
   * Subscribe email to newsletter
   */
  subscribeToNewsletter(): void {
    if (this.validateEmail()) {
      this.emailApiService.subscribeToNewsletter(this.email)
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res.result === 'success') {
            this.emailSent = true;
            this.email = '';
          }
        },
        (err: any) => {
          console.log(err);
      });
    } else {
      this.emailSent = false;
      this.emailError = true;
    }
  }

  /**
   * Checks the email with a regular expression
   * @returns {boolean} true for valid, false for not valid
   */
  validateEmail(): any {
    const re = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
    return re.test(this.email);
  }

  /**
   * Delete the messages shown after the interactions
   */
  deleteMessage(): void {
    this.emailSent = false;
    this.emailError = false;
  }

}
