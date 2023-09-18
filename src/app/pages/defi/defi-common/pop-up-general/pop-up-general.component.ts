import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pop-up-general',
  templateUrl: './pop-up-general.component.html',
  styleUrls: ['./pop-up-general.component.scss'],
})
export class PopUpGeneralComponent implements OnInit {

  menu: string = '';

  constructor(
    public dialogRef: MatDialogRef<PopUpGeneralComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.menu = this.data.link;
  }

  ngOnInit(): void {
    console.log(this.data);
  }

  goTo(link){
    this.menu = link;
  }

}
