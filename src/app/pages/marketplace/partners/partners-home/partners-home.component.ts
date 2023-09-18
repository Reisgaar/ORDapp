import { Component, OnInit } from '@angular/core';
import { partners } from 'src/app/constants/partnerships';

/**
 * Home page to show all the partners
 */
@Component({
  selector: 'app-partners-home',
  templateUrl: './partners-home.component.html',
  styleUrls: ['./partners-home.component.scss']
})
export class PartnersHomeComponent implements OnInit {
  partners: any = partners;
  arePartnersComing: boolean = false;

  constructor() { }

  /**
   * Checks partners
   */
  ngOnInit(): void {
    this.checkIfPartnersComing();
  }

  /**
   * Checks if is any partner as 'comming'
   */
  checkIfPartnersComing(): void {
    console.log(partners);
    for (const p in this.partners) {
      if (this.partners[p].show && !this.partners[p].launched) {
        this.arePartnersComing = true;
      }
    }
  }

}
