import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { userSpecie } from 'src/app/constants/inventory';

@Component({
  selector: 'app-pop-up-specie-selector',
  templateUrl: './pop-up-specie-selector.component.html',
  styleUrls: ['./pop-up-specie-selector.component.scss']
})
export class PopUpSpecieSelectorComponent {
  actualSpecie = userSpecie[0];

  constructor(
    public dialogRef: MatDialogRef<PopUpSpecieSelectorComponent>
  ) { }

  /**
   * Closes the pop up
   */
  closePopUp(): void {
    this.dialogRef.close();
  }

  /**
   * Closes the pop up
   */
  selectSpecie(specie: string): void {
    this.dialogRef.close(specie);
  }
}
