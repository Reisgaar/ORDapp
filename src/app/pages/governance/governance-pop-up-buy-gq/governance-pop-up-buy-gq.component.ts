import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

/**
 * Pop Up to buy GQ
 */
@Component({
  selector: 'app-governance-pop-up-buy-gq',
  templateUrl: './governance-pop-up-buy-gq.component.html',
  styleUrls: ['./governance-pop-up-buy-gq.component.scss']
})
export class GovernancePopUpBuyGqComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<GovernancePopUpBuyGqComponent>
  ) { }

  ngOnInit(): void {
  }

  /**
   * Close the pop up
   */
  closePopUp(): void {
    this.dialogRef.close();
  }

}
