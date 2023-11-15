import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UtilsService } from '../../../services/utils.service';
import { DialogService } from 'src/app/shared/services/dialog.service';

@Component({
  selector: 'app-pop-up-get-materials',
  templateUrl: './pop-up-get-materials.component.html',
  styleUrls: ['./pop-up-get-materials.component.scss']
})
export class PopUpGetMaterialsComponent {
  constructor(
    public dialogRef: MatDialogRef<PopUpGetMaterialsComponent>,
    private dialogService: DialogService
  ) { }

  /**
   * Closes the pop up
   */
  closePopUp(): void {
    this.dialogRef.close();
  }

  openDefiPopUp(link): void {
    this.dialogService.openDefiDialog(link)
  }

}
