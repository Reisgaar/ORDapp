import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { partners } from 'src/app/constants/partnerships';
import { DialogService } from 'src/app/shared/services/dialog.service';

/**
 * Main page of partner marketplace
 */
@Component({
  selector: 'app-partner-sell',
  templateUrl: './partner-sell.component.html',
  styleUrls: ['./partner-sell.component.scss']
})
export class PartnerSellComponent implements OnInit {
  partnerInput: string = '';
  partner: any;
  partnerData: any;
  selectedTab: string = 'sales';

  constructor(
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService
  ) {
    this.activatedRoute.queryParams.subscribe( (params: any) => {
      if (params.partner) {
        this.partnerInput = params.partner;
        this.partnerData = partners[this.partnerInput];
        console.log(this.partnerData);
      }
    });
    this.partner = partners[this.partnerInput];
  }

  /**
   * Gets the NFT list
   */
  ngOnInit(): void {
  }

  /**
   * Changes the selected tab on the view
   * @param {string} newSelection : selected tab to change to
   */
  chageSelectedTab(newSelection: string): void {
    this.selectedTab = newSelection;
  }

  /**
   * Opens Baskonia FAQ pop up
   */
  showBaskoniaFAQ(): void {
    this.dialogService.openBaskoniaDialog();
  }

}
