import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { activeUser } from 'src/app/constants/inventory';
import { PopUpGeneralComponent } from 'src/app/pages/defi/defi-common/pop-up-general/pop-up-general.component';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { GovernanceDialogService } from 'src/app/shared/services/governance-dialog.service';
import { SpeciesService } from '../../services/species/species.service';
import { DialogService } from '../../services/dialog.service';

/**
 * Header for all the site
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  walletIsConnected: boolean;
  account: string;
  responsiveMenuVisible = false;
  actualLanguage: string;
  actualRoute: string = '';
  navigationMarketplaceIsOpen: boolean = false;
  navigationGovernanceIsOpen: boolean = false;
  navigationDefiIsOpen: boolean = false;
  navigationCraftingIsOpen: boolean = false;
  navigationLandsIsOpen: boolean = false;

  constructor(
    private connectionService: ConnectionService,
    private translate: TranslateService,
    private router: Router,
    private governanceDialogService: GovernanceDialogService,
    private speciesService: SpeciesService,
    private dialogService: DialogService
  ) {
    const selectedLanguage = localStorage.getItem('selectedLanguage');
    if (selectedLanguage) {
      this.actualLanguage = selectedLanguage;
    } else {
      this.actualLanguage = 'en';
    }
  }

  // Change slider on resize
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (window.innerWidth > 850) {
      this.responsiveMenuVisible = false;
    }
  }

  ngOnInit(): void {
    this.subscribeModal();
    const keepConnection = localStorage.getItem('keepConnection');
    if (keepConnection === 'true') {
      this.connectionService.autoConnectWallet();
    }
    this.router.events.subscribe((val: any) => {
      // see also
      if (val.url) {
        this.actualRoute = val.url;
      }
    });
  }

  /**
   * Subscribes to get the transaction hash, used to change steps on process
   */
  subscribeModal(): void {
    this.connectionService.subscribeModal();
    this.connectionService.userAccount.subscribe( (userAccount: any) => {
      console.log(userAccount)
      this.walletIsConnected = userAccount.isConnected;
      this.account = userAccount.address;
      activeUser[0] = userAccount.address;
      this.setSpecieForAddress(userAccount.address);
      if (this.walletIsConnected) {
        localStorage.setItem('keepConnection', 'true');
      }
    });
  }

  /**
   * Opens Wallet Connect Modal
   */
  public openModal(): void {
    this.connectionService.openModal();
  }

  /**
   * Switch the visibility of the responsive menu
   */
  toggleResponsiveMenu(): void {
    this.responsiveMenuVisible = !this.responsiveMenuVisible;
  }

  /**
   * Sets the language to use on the site
   * @param {any} event : Click event
   * @param {string} newLanguage : Selected new language
   */
  setLanguage(event: any, newLanguage: string): void {
    event.stopPropagation();
    this.actualLanguage = newLanguage;
    this.translate.use(newLanguage);
    localStorage.setItem('selectedLanguage', newLanguage);
  }

  /**
   * Switch the visibility of the section in responsive menu
   * @param {string} section : Clicked section
   */
  switchResponsiveMenuSection(section: string): void {
    switch (section.toLowerCase()) {
      case 'crafting':
        this.navigationCraftingIsOpen = !this.navigationCraftingIsOpen;
        break;
      case 'defi':
        this.navigationDefiIsOpen = !this.navigationDefiIsOpen;
        break;
      case 'governance':
        this.navigationGovernanceIsOpen = !this.navigationGovernanceIsOpen;
        break;
      case 'marketplace':
        this.navigationMarketplaceIsOpen = !this.navigationMarketplaceIsOpen;
        break;
      case 'lands':
        this.navigationLandsIsOpen = !this.navigationLandsIsOpen;
        break;
    }
  }

  /**
   * Opens the pop up to buy GQ
   */
  buyGqPopUp(): void {
    this.governanceDialogService.openBuyGqDialog();
  }

  /**
   * Set specie name on constant for given wallet
   * @param address wallet address
   */
  async setSpecieForAddress(address: string): Promise<any> {
    await this.speciesService.setWalletSpecie(address);
  }

  openDefiPopUp(link): void {
    this.dialogService.openDefiDialog(link)
  }

}
