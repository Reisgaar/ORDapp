import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { userSpecie } from 'src/app/constants/inventory';
import { SpeciesService } from 'src/app/shared/services/species/species.service';
import { DialogService } from 'src/app/shared/services/dialog.service';

/**
 * Page of the user's profile
 */
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  wallet: any = '';
  userWallet: any = '';
  interval: any;
  activeTab: string = 'nft';
  userSpecieImage = userSpecie;
  claimData: any = {};
  walletSpecie: string = '';
  changingSpecie: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private connectionService: ConnectionService,
    private utilsService: UtilsService,
    private speciesService: SpeciesService,
    private dialogService: DialogService
  ) {
    this.activatedRoute.queryParams.subscribe( (params: any) => {
      this.wallet = '';
      if (params['wallet']) {
        this.wallet = params['wallet'];
      }
      this.getWalletInfo();
    });}

  /**
   * Sets interval to get wallet info
   */
  ngOnInit(): void {
    this.checkSpecie();
    this.interval = setInterval(() => {
      this.getWalletInfo();
      // this.getWalletSpecie();
      // this.checkSpecie();
    }, 1000);
  }

  /**
   * Clear interval and unsubscribe all subscriptions if exist
   */
  ngOnDestroy(): void {
    if (this.interval) { clearInterval(this.interval); }
  }

  /**
   * Gets user's wallet info if not in param
   */
  getWalletInfo(): void {
    try {
      this.userWallet = this.connectionService.getWalletAddress();
      if (this.wallet === '' || !this.wallet) {
        this.wallet = this.connectionService.getWalletAddress();
      }
      clearInterval(this.interval);
    } catch (error: any) { }
  }

  /**
   * Sets the active tab
   * @param {string} newTab : new tab to change to
   */
  setActiveTabTo(newTab: string): void {
    this.activeTab = newTab;
  }

  /**
   * Checks the claim data for Species NFTs
   */
  async checkSpecie(): Promise<any> {
    if (this.wallet && this.wallet !== '') {
      this.claimData = await this.speciesService.getSpeciesClaimData(this.wallet);
      console.log(this.claimData);
    }
  }

  /**
   * Claims the Specie NFT
   */
  async claimSpecie(): Promise<any> {
    this.changingSpecie = true;
    await this.speciesService.claimSpecieNFT(this.claimData.specie, this.claimData.merkleProof).then( async () => {
      await this.checkSpecie();
      const userAddr = this.connectionService.getWalletAddress();
      await this.speciesService.setWalletSpecie(userAddr);
      this.changingSpecie = false;
    });
  }

  /**
   * Gets the specie of the wallet
   */
  async getWalletSpecie(): Promise<any> {
    this.walletSpecie = (await this.speciesService.getWalletSpecie(this.wallet)).toLowerCase();
  }

  async changeSpecie(): Promise<any> {
    const messages = ['specieChangeConfirmation1', 'specieChangeConfirmation2', 'specieChangeConfirmation3'];
    this.dialogService.openConfirmationDialog(messages).afterClosed().subscribe( isConfirmed => {
      if (isConfirmed) {
        this.dialogService.openSpecieSelectorDialog().afterClosed().subscribe( specie => {
          if (specie) {
            this.changingSpecie = true;
            this.speciesService.changeSpecie(specie).then( async () => {
              await this.checkSpecie();
              this.changingSpecie = false;
            });
          }
        });
      }
    });
  }

  async deleteSpecie(): Promise<any> {
    const messages = ['specieBurnConfirmation1', 'specieBurnConfirmation2'];
    this.dialogService.openConfirmationDialog(messages).afterClosed().subscribe( isConfirmed => {
      if (isConfirmed) {
        this.changingSpecie = true;
        this.speciesService.deleteSpecie().then( async () => {
          await this.checkSpecie();
          this.changingSpecie = false;
        });
      }
    });
  }

}
