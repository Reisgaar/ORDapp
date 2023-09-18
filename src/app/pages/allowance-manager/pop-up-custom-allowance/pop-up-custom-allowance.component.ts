import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { MaxUint256 } from '@ethersproject/constants';

@Component({
  selector: 'app-pop-up-custom-allowance',
  templateUrl: './pop-up-custom-allowance.component.html',
  styleUrls: ['./pop-up-custom-allowance.component.scss']
})
export class PopUpCustomAllowanceComponent implements OnInit {
  @Input() token: string;
  selectedAmount: string = '0';
  formError: boolean = false;
  emptyError: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<PopUpCustomAllowanceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private connectionService: ConnectionService
  ) { }

  /**
   * Sets interval to get wallet info
   */
  ngOnInit(): void {
  }

  /**
   * Closes the pop up
   */
  async closePopUp(): Promise<void> {
    this.dialogRef.close();
  }

  /**
   * Closes the pop up
   */
  async confirmAmount(): Promise<void> {
    this.dialogRef.close(this.selectedAmount);
  }

  /**
   * Control the inputs on the form
   * @param event key press event
   */
  controlInput(event: any): void {
    // If not number prevent default
    if (isNaN(parseInt(event.key, 0))) {
      event.preventDefault();
    }
    // If , or . write . only once
    if ((event.key === ',' || event.key === '.') && !event.target.value.includes('.')) {
      const start = event.target.selectionStart;
      const end = event.target.selectionEnd;
      const oldValue = event.target.value;
      event.target.value = oldValue.slice(0, start) + '.' + oldValue.slice(end);
    }
    // Limit to 18 decimals
    if (event.target.value.indexOf('.') >= 0 && event.target.selectionStart > event.target.value.indexOf('.')) {
      event.target.value = event.target.value.slice(0, event.target.value.indexOf('.') + 18);
    }
    // If first enter, remove 0
    if (event.target.value === '0' && !isNaN(parseInt(event.key, 0))) {
      event.target.value = '';
    }
  }

  /**
   * Validates the form
   * @returns true if is valid
   */
  async validateForm(): Promise<any> {
    this.formError = false;
    this.emptyError = false;
    if (this.selectedAmount !== '') {
      // Transform to wei to avoid decimals and to BN to make comparison
      const selectedAllowanceBN = await this.connectionService.ethers.utils.parseUnits(this.selectedAmount, "ether");
      const maxUint256 = await this.connectionService.ethers.utils.parseUnits(MaxUint256.toString(), "wei");
      const isCorrect = selectedAllowanceBN.lte(maxUint256);
      console.log(isCorrect);
      if (isCorrect) {
        return true;
      } else {
        this.formError = true;
        return false;
      }
    } else {
      this.emptyError = true;
    }
  }

}
