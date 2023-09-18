import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { PartnerNftService } from 'src/app/shared/services/partnership/partner-nft.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { PartnerApiService } from 'src/app/shared/services/partner-api.service';

/**
 * Pop up to manage the process of NFT redemption
 */
@Component({
  selector: 'app-partner-pop-up-burn-to-receive',
  templateUrl: './partner-pop-up-burn-to-receive.component.html',
  styleUrls: ['./partner-pop-up-burn-to-receive.component.scss']
})
export class PartnerPopUpBurnToReceiveComponent implements OnInit {
  addressForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    street: ['', Validators.required],
    country: ['', Validators.required],
    zipcode: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    idNumber: ['', Validators.required],
    email: ['', Validators.required],
    phone: ['', Validators.required],
  });
  showTerms: boolean = false;
  onShop: boolean = false;
  termsAccepted: boolean = false;
  addressIsSent: boolean = false;
  redeemProcessStarted: boolean = false;
  transactionError: boolean = false;
  finished: boolean = false;
  errorMessage: string = '';
  step = 0;

  constructor(
    public dialogRef: MatDialogRef<PartnerPopUpBurnToReceiveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: UntypedFormBuilder,
    private connectionService: ConnectionService,
    private dialogService: DialogService,
    private partnerApiService: PartnerApiService,
    private partnerNftService: PartnerNftService
  ) { }

  /**
   * Prevents window close
   * @param {any} event : click event
   */
  @HostListener('window:beforeunload', ['$event'])
   onWindowClose(event: any): any {
    event.preventDefault();
    event.returnValue = false;
  }

  ngOnInit(): void {
  }

  /**
   * Closes the pop up
   */
  closePopUp(): void {
    this.dialogRef.close(this.finished);
  }

  /**
   * Changes boolean to show confirmation data
   */
  submitForm(): void {
    this.addressIsSent = true;
  }

  /**
   * Changes required booleans to return to form
   */
  backToForm(): void {
    this.redeemProcessStarted = false;
    this.transactionError = false;
    this.errorMessage = '';
    this.addressIsSent = false;
  }

  /**
   * Starts the redeem process
   */
  async startRedeemProcess(): Promise<void> {
    this.transactionError = false;
    this.errorMessage = '';
    this.step = 1;
    this.redeemProcessStarted = true;
    const userData = await this.setUserDataToSend();
    console.log(userData);
    try {
      const signedData = await this.partnerNftService.signature();
      if (signedData) {
        await this.sendToDatabase(userData, signedData);
      }
    } catch (error: any) {
      this.transactionError = true;
      this.errorMessage = error.message;
    }
  }

  /**
   * Sets the user data
   * @returns {any} : user data object
   */
  async setUserDataToSend(): Promise<any> {
    const wallet = this.connectionService.getWalletAddress();
    const tokenAddress = this.data.nftContractAddress;
    const tokenId = parseInt(this.data.tokenId, 0);
    let data = {
      ...this.addressForm.value,
      wallet,
      tokenAddress,
      tokenId,
      sendToShop: this.onShop,
      match: this.data.match
    };
    if (this.onShop) {
      data.lastName = '(' + this.addressForm.value.firstName + ' ' + this.addressForm.value.lastName + ')';
      data.firstName = this.data.partner.address.name;
    }
    return data;
  }

  /**
   * Adds user data on database
   * @param {any} userData : object with user data
   * @param signedData : data of blockchain signature
   */
  async sendToDatabase(userData: any, signedData: any): Promise<any> {
    this.partnerApiService.addUserData(userData, signedData).subscribe(
      data => {
        console.log(data);
        this.redeemNft(userData);
      },
      error => {
        console.log(error);
        this.transactionError = true;
        this.errorMessage = error.error.message;
      }
    );
  }

  /**
   * Delete user data from database
   * @param {any} userData : object with user data
   */
  async deleteFromDatabase(userData: any): Promise<any> {
    const deleteData = {
      wallet: userData.wallet,
      tokenId: userData.tokenId,
      tokenAddress: userData.tokenAddress
    };
    this.partnerApiService.deleteUserData(deleteData).subscribe(
      res => { console.log(res); },
      error => { console.log(error); }
    );
  }

  /**
   * Redeem the NFT of the user
   * @param {any} userData : object with user data
   */
  async redeemNft(userData: any): Promise<any> {
    this.step = 2;
    this.subscribeToGetTxHash();
    await this.partnerNftService.redeemNft(userData.tokenAddress, userData.tokenId).then( (res: any) => {
      if (res.type === 'error') {
        this.closePopUp();
        this.dialogService.openRegularInfoDialog('error', res.message, '');
        this.deleteFromDatabase(userData);
      } else {
        this.step = 4;
        this.finished = true;
      }
    });
  }

  /**
   * Subscribes to get the transaction hash, used to change steps on process
   */
  subscribeToGetTxHash(): void {
    const txSubscription = this.partnerNftService.txHash.subscribe( txHash => {
      if (txHash !== '') {
        console.log('Transaction hash:' + txHash);
        this.step = 3;
        txSubscription.unsubscribe();
      }
    });
  }

  /**
   * Sets the address if user selects 'send to shop' option
   */
  setShopAddress(): void {
    this.onShop = !this.onShop;
    if (this.onShop) {
      this.addressForm.patchValue({
        street: this.data.partner.address.street,
        country: this.data.partner.address.country,
        zipcode: this.data.partner.address.zipCode,
        city: this.data.partner.address.city,
        state: this.data.partner.address.state
      });
    } else {
      this.addressForm.patchValue({
        street: '',
        country: '',
        zipcode: '',
        city: '',
        state: ''
      });
    }
    console.log(this.addressForm.value);
  }

  /**
   * Show the terms on the pop up
   * @param {any} event : click event
   */
  openTerms(event: any): void {
    this.showTerms = !this.showTerms;
    event.preventDefault();
  }
}
