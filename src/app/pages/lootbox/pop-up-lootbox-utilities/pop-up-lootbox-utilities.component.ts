import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Pop up to show lootbox utilities
 */
@Component({
  selector: 'app-pop-up-lootbox-utilities',
  templateUrl: './pop-up-lootbox-utilities.component.html',
  styleUrls: ['./pop-up-lootbox-utilities.component.scss']
})
export class PopUpLootboxUtilitiesComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PopUpLootboxUtilitiesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }

  /**
   * Closes pop up
   */
  closePopUp(): void {
    this.dialogRef.close();
  }

}
