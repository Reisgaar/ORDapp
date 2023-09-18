import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SlippageComponent } from '../slippage/slippage.component';

@Component({
  selector: 'app-settings-button',
  templateUrl: './settings-button.component.html',
  styleUrls: ['./settings-button.component.scss']
})
export class SettingsButtonComponent {

  slippage: string = localStorage.getItem('slipTolerance');
  deadline: number = Number(localStorage.getItem('transDeadLine')) * 60;


  constructor(public dialog: MatDialog) {}

  openSettings(){
    const dialogRef = this.dialog.open(SlippageComponent, {
      panelClass: 'lootbox-dialog-container',
      data: {title: 'settings'},
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      // const dead = parseFloat(result.transDeadLine);
      localStorage.setItem('slipTolerance', result.slipTolerance);
      localStorage.setItem('transDeadLine', result.transDeadLine);

    });
  }
}
