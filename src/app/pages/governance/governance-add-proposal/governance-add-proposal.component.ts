import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Proposal } from 'src/app/interfaces/proposal';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { ProposalService } from 'src/app/shared/services/governance/proposal.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { EmailApiService } from 'src/app/shared/services/email-api.service';
import { IpfsService } from 'src/app/shared/services/ipfs.service';
import { environment } from 'src/environments/environment';
const hash = require('object-hash');

/**
 * Page with form to add proposals
 */
@Component({
  selector: 'app-governance-add-proposal',
  templateUrl: './governance-add-proposal.component.html',
  styleUrls: ['./governance-add-proposal.component.scss']
})
export class GovernanceAddProposalComponent implements OnInit {
  allowedWallets = environment.allowedWalletsToUploadProposals;

  optionTag: string;
  descriptionLimit = 12000;
  fileNames: string[] = [];
  isDroppingFile: boolean;
  imageToSend: any;
  imageUrl: string;
  base64Image: any;

  // Form variables
  title = '';
  description = '';
  files: any;
  optionsList: string[] = [];
  dateStart: string;
  dateStartPlusOne: string;
  dateEnd: string;
  email: string;
  name: string;
  wallet: string;

  // Error messages
  errorTitle = '';
  errorDescription = '';
  errorOption = '';
  fileSizeError = false;
  startTimeStamp: number;
  endTimeStamp: number;
  interval: any;

  constructor(
    private ipfsService: IpfsService,
    private proposalService: ProposalService,
    private connectionService: ConnectionService,
    private datePipe: DatePipe,
    private dialogService: DialogService,
    private emailApiService: EmailApiService
  ) {
    this.setDateInputsValues();
  }

  async ngOnInit(): Promise<void> {
    this.interval = setInterval(async () => {
      this.wallet = this.connectionService.getWalletAddress();
      if (this.wallet) {
        console.log(this.wallet);
        clearInterval(this.interval);
      }
    }, 3000);
  }

  /**
   * Clicks the connect wallet button
   */
  connectWallet(): void {
    this.connectionService.openModal();
  }

  /**
   * On enter key pressing, add text to optionsList
   * @param event : Click event
   */
  setTag(event: any): void {
    // key 13 is enter
    if (event.keyCode === 13) {
      event.preventDefault();
      const tag = this.optionTag;
      this.optionsList.push(tag);
      this.optionTag = '';
    }
  }

  /**
   * Sets the date inputs
   */
  setDateInputsValues(): void {
    this.dateStart = this.getDateStringInput(new Date(), false);
    this.dateStartPlusOne = this.getDateStringInput(new Date(), true);
    this.dateEnd = this.getDateStringInput(new Date(), true);
  }

  /**
   * Remove clicked option from optionList
   * @param tag : clicked tag
   */
  removeTag(tag: string): void {
    const index = this.optionsList.indexOf(tag);
    this.optionsList.splice(index, 1);
  }

  /**
   * Detect if user is dropping file
   * @param isDropping : True if is dropping, false if is not
   */
  droppingFile(isDropping: boolean): void {
    this.isDroppingFile = isDropping;
  }

  /**
   * Set file names to upload to show to user
   * @param event : Event received from the view
   */
  setFileNames(event: any): void {
    this.fileSizeError = false;
    const sizeInMb = 15 * 1000000;
    if (event.target.files[0].size > sizeInMb) {
      this.fileSizeError = true;
      console.log('too large');
      this.removeFile('');
    } else {
      this.base64Image = '';
      this.fileNames.length = 0;
      for (const a of event.target.files) {
        this.fileNames.push(a.name);
      }
      this.imageToSend = event.target.files[0];
      this.getBase64(event);
    }
  }

  /**
   * Remove all files from file input
   * @param event : Event received from the view
   */
  removeFile(event: any): void {
    if (event) { event.preventDefault(); }
    const fileInput: any = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = null;
    }
    this.fileNames = [];
    this.base64Image = '';
    this.isDroppingFile = false;
  }

  /**
   * Submits and validates form
   */
  async submitForm(): Promise<void> {
    const formIsValid = this.validateForm();
    if (formIsValid) {
      const userAddr = this.connectionService.getWalletAddress();
      if (this.allowedWallets.includes(userAddr)) {
        this.uploadForm();
      } else {
        this.emailForm();
      }
    }
  }

  /**
   * Uploads form to ipfs and blockchain
   */
  async uploadForm(): Promise<void> {
    try {
      let dialog = this.dialogService.openRegularInfoDialog('creatingDocument', 'preparingDocument', '');
      let uploadedJson = '';
      // Upload image
      await this.ipfsService.uploadImage(this.imageToSend)
        .then( async (res: any) => {
          // Upload json with image URI
          this.imageUrl = res;
          const data = await this.createJson();
          uploadedJson = await this.ipfsService.uploadJson(data);
        });
      // Upload proposal to contract
      dialog.close();
      dialog = this.dialogService.openRegularInfoDialog('uploading', 'waitWhileUpload', '');
      await this.proposalService.uploadProposal(uploadedJson, this.optionsList.length, this.startTimeStamp, this.endTimeStamp);
      dialog.close();
      this.endUpload();
    } catch (error: any) { }
  }

  /**
   * Control the pop up with the VP the payment
   */
  async emailForm(): Promise<void> {
    const data: any = await this.createJson();
    data.email = this.email;
    data.proposer = this.name;
    // data.image = this.base64Image;
    // if (data.fileName) {
    //   data.fileName = this.imageToSend.name;
    // }
    data.image = null;
    data.fileName = null;
    console.log('Sending data on email');
    console.log(data);
    const cid = hash(data);
    await this.proposalService.payToSendProposal().then( async (res: any) => {
      console.log(res);
      if (res === true) {
        await this.sendProposalEmail(data, cid);
        this.dialogService.openRegularInfoDialog('proposalSentTitle', 'proposalSentText', '');
        this.resetForm();
      }
    });
  }

  /**
   * Sends the proposal to email
   * @param {any} data : the email data
   * @param {string} cid : cid with hashed data
   */
  async sendProposalEmail(data: any, cid: string): Promise<void> {
    this.emailApiService.sendProposalEmail(data, cid).subscribe(
      (res: any) => {
        console.log('Sent!');
      },
      (err: any) => {
        console.log(err);
    });
  }

  /**
   * Validate form fields
   */
  validateForm(): boolean {
    this.errorTitle = '';
    this.errorDescription = '';
    this.errorOption = '';
    if (this.title.trim().length === 0) {
      this.errorTitle = '* Please, insert a title.';
    }
    if (this.description.trim().length === 0) {
      this.errorDescription = '* Please, insert a description.';
    }
    if (this.optionsList.length < 2) {
      this.errorOption = '* Please, insert a minimum of 2 options.';
    }
    if (this.errorTitle === '' && this.errorDescription === '' && this.errorOption === '') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Refresh the proposals
   */
  endUpload(): void {
    this.dialogService.openRegularInfoDialog('fileUploadedTitle', 'fileUploadedText', '');
    this.resetForm();
  }


  /**
   * Resets form fields
   */
  resetForm(): void {
    this.title = '';
    this.email = '';
    this.name = '';
    this.description = '';
    this.removeFile(null);
    this.optionsList = [];
    this.optionTag = '';
    this.setDateInputsValues();
    this.base64Image = '';
  }

  /**
   * Create json with form data
   */
  async createJson(): Promise<Proposal> {
    this.startTimeStamp = Math.floor(new Date(this.dateStart).getTime() / 1000);
    this.endTimeStamp = Math.floor(new Date(this.dateEnd).getTime() / 1000);
    const postedOn = Math.floor(Date.now() / 1000);
    const file = {
      postedData: postedOn.toString(),
      title: this.title,
      description: this.description,
      image: this.imageUrl,
      votingOptions: this.optionsList,
      startTimeStamp: this.startTimeStamp.toString(),
      endTimeStamp: this.endTimeStamp.toString()
    };
    return file;
  }

  /**
   * Returns a string date 'yyy-MM-ddThh:mm'
   * @param {Date} date : date to transform
   * @param {boolean} addDays : boolean to add days to the date
   * @returns {string} the date formated as 'yyy-MM-ddThh:mm'
   */
  getDateStringInput(date: Date, addDays: boolean): string {
    if (addDays) {
      date.setDate(date.getDate() + 1);
    }
    const res = this.datePipe.transform(date, 'yyyy-MM-ddThh:mm');
    if (res) {
      return res;
    } else {
      return '';
    }
  }

  /**
   * Set date end and limit to date end
   */
  setEndDateOnStartDateChange(): void {
    const date = this.getDateStringInput(new Date(this.dateStart), true);
    this.dateStartPlusOne = date;
    this.dateEnd = date;
  }

  /**
   * Get input image as base64
   * @param {any} event : event from the view
   */
  getBase64(event: any) {
    const reader = new FileReader();
    reader.readAsDataURL(this.imageToSend);
    reader.onload = () => {
      this.base64Image = reader.result;
    };
    reader.onerror = (error) => {
      console.log('Error: ', error);
    };
 }
}
