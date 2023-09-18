import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-partner-pop-up-baskonia-faq',
  templateUrl: './partner-pop-up-baskonia-faq.component.html',
  styleUrls: ['./partner-pop-up-baskonia-faq.component.scss']
})
export class PartnerPopUpBaskoniaFaqComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PartnerPopUpBaskoniaFaqComponent>
  ) { }

  ngOnInit(): void {
  }

  closePopUp(): void {
    this.dialogRef.close();
  }
}
