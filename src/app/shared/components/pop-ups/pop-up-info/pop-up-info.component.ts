import { Component, HostListener, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Generic pop up to show info messages
 */
@Component({
  selector: 'app-pop-up-info',
  templateUrl: './pop-up-info.component.html',
  styleUrls: ['./pop-up-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PopUpInfoComponent implements OnInit {
  viemSimulationError: boolean = false;
  viemSimulationData: any;
  showViemErrorDetails: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<PopUpInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  // Change slider on resize
  @HostListener('window:resize', ['$event'])
  async onResize(): Promise<any> {
    this.setViemErrorListSize();
  }

  ngOnInit(): void {
    if (this.data.title === 'error') {
      this.processError();
    }
  }

  /**
   * Closes the pop up
   */
  closePopUp(): void {
    this.dialogRef.close();
  }

  processError(): any {
    const start = this.data.text.indexOf('reason="');
    const end = this.data.text.indexOf('",', start);
    console.log(this.data.text);
    if (start > -1 && end > -1) {
      const errorMessage: string = this.data.text.slice(start + 8, end);
      this.data.text = errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1);
    } else if (this.data.text.toLowerCase().includes('user rejected')) {
      this.data.text = "User rejected transaction."
    } else if (this.data.text.toLowerCase().includes('user denied message signature')) {
      this.data.text = "User denied message signature."
    }

    console.log(this.data.text);
    if (this.data.text.toLowerCase().includes(' reverted with the following reason') && this.data.text.toLowerCase().includes('version: viem')) {
      this.processViemSimulatedError();
    } else if (this.data.text.toLowerCase().includes(' reverted.') && this.data.text.toLowerCase().includes('version: viem')) {
      this.processViemSimulatedError2()
    } else if (this.data.text.toLowerCase().includes('cannot read properties of undefined')) {
      this.data.text = 'Something went wrong.';
    }
  }

  processViemSimulatedError2(): void {
    console.log('Viem simulation error 2');
    this.viemSimulationError = true;
    const break1 = this.data.text.toLowerCase().indexOf(' reverted.');
    const break2 = this.data.text.toLowerCase().indexOf('contract call:');
    const break3 = this.data.text.toLowerCase().indexOf('docs: https');
    const text1 = this.data.text.slice(0, break1 + 10);
    const text2 = this.data.text.slice(break1 + 11, break2);
    const auxText3 = this.data.text.slice(break2, break3);
    const text3 = auxText3.replace('address: ', '<ul><li>Contract: ').replace('function: ', '</li><li>Function: ').replace('args: ', '</li><li>Params: ').replace('sender: ', '</li><li>Sender: ') + '</li></ul>';
    this.viemSimulationData = {
      title: text1,
      reason: text2,
      list: text3
    }
  }


  processViemSimulatedError(): void {
    console.log('Viem simulation error 1');
    this.viemSimulationError = true;
    const break1 = this.data.text.toLowerCase().indexOf('reverted with the following reason:') + 35;
    const break2 = this.data.text.toLowerCase().indexOf('contract call:');
    const break3 = break2 + 14;
    const break4 = this.data.text.toLowerCase().indexOf('docs: https');
    const text1 = this.data.text.slice(0, break1);
    const text2 = this.data.text.slice(break1, break2);
    const auxText3 = this.data.text.slice(break3, break4);
    const text3 = auxText3.replace('address: ', '<ul><li>Contract: ').replace('function: ', '</li><li>Function: ').replace('args: ', '</li><li>Params: ').replace('sender: ', '</li><li>Sender: ') + '</li></ul>';
    this.viemSimulationData = {
      title: text1,
      reason: text2,
      list: text3
    }
  }

  switchViemErrorDetails(): void {
    this.showViemErrorDetails = !this.showViemErrorDetails;
    this.setViemErrorListSize();
  }

  setViemErrorListSize(): void {
    const el = document.getElementById('viem-error-list');
    if (el) {
      console.log(el);
      console.log(el.scrollHeight);
      if (this.showViemErrorDetails) {
        el.style.height = (el.scrollHeight - 10) + 'px';
      } else {
        el.style.height = '0px';
      }
    }
  }
}
