import { Component, HostListener } from '@angular/core';
import { allowances, nftAllowances } from 'src/app/constants/allowances';
import { contractAddresses } from 'src/app/constants/contractAddresses';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { TokenService } from 'src/app/shared/services/token/token.service';
import { PopUpCustomAllowanceComponent } from './pop-up-custom-allowance/pop-up-custom-allowance.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-allowance-manager',
  templateUrl: './allowance-manager.component.html',
  styleUrls: ['./allowance-manager.component.scss']
})
export class AllowanceManagerComponent {
  allowances: any = allowances;
  nftAllowances: any = nftAllowances;
  contractAddresses = contractAddresses;
  interval: any;
  visibleSection: string = '';
  selectedTabIsToken: boolean = true;
  previousElement: any;
  actualElement: any;

  constructor(
    private tokenService: TokenService,
    private connectionService: ConnectionService,
    public dialog: MatDialog
  ) {}

  // Change slider on resize
  @HostListener('window:resize', ['$event'])
  async onResize(): Promise<any> {
    this.fixSizeOnChanges();
  }

  ngOnInit(): void {
    this.getERC20Allowances();
    this.getERC721Allowances();
    this.interval = setInterval(() => {
      this.getERC20Allowances();
      this.getERC721Allowances();
    }, 5000);
  }

  /**
   * Clear the interval
   */
  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  /**
   * Changes the allowance of a token
   * @param tokenToSpend the address of the token to allow
   * @param spender the address of the spender contract
   */
  async customAllowance(tokenToSpend: string, spender: string): Promise<any> {
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      this.dialog.open(PopUpCustomAllowanceComponent, {
        panelClass: 'lootbox-dialog-container'
      }).afterClosed().subscribe( res => {
        if (res) {
          console.log(res);
          const amount = this.connectionService.toWei(res);
          this.changeAllowance(tokenToSpend, spender, amount);
        }
      });
    }
  }

  /**
   * Changes the allowance of a token
   * @param tokenToSpend the address of the token to allow
   * @param spender the address of the spender contract
   */
  async changeAllowance(tokenToSpend: string, spender: string, amount?: string): Promise<any> {
    const walletIsConnected = await this.connectionService.syncAccount();
    if (walletIsConnected) {
      await this.tokenService.tokenApprove(spender, tokenToSpend, amount).then( () => {
        this.getERC20Allowances();
        this.getERC721Allowances();
      });
    }
  }

  /**
   * Get and set all allowances of tokens in allowances constant
   */
  async getERC20Allowances(): Promise<any> {
    for (const [key1, section] of Object.entries(this.allowances)){
      for (const [key2, contract] of Object.entries(section['contracts'])){
        for (const [key3, token] of Object.entries(contract['allowedTokens'])) {
          if (await this.connectionService.isWalletConnected()) {
            const tokenAddress = contractAddresses[token['constant']];
            const contractAddress = contractAddresses[contract['addressConstant']];
            this.tokenService.getTokenAllowanceOnSpender(tokenAddress, contractAddress).then( res => {
              let allowed = this.connectionService.fromWei(res);
              if (allowed.indexOf('.') > 50) {
                allowed = 'max';
              }
              token['allowed'] = allowed;
            });
          } else {
            token['allowed'] = '';
          }
        }
      }
    }
  }

  /**
   * Get and set all allowances of NFT in allowances constant
   */
  async getERC721Allowances(): Promise<any> {
    for (const [key1, section] of Object.entries(this.nftAllowances)){
      for (const [key2, contract] of Object.entries(section['contracts'])){
        for (const [key3, token] of Object.entries(contract['allowedTokens'])) {
          if (await this.connectionService.isWalletConnected()) {
            const tokenAddress = contractAddresses[token['constant']];
            const contractAddress = contractAddresses[contract['addressConstant']];
            this.tokenService.getNFTAllowanceOnSpender(tokenAddress, contractAddress).then( res => {
              token['allowed'] = res;
            });
          } else {
            token['allowed'] = '';
          }
        }
      }
    }
    console.log(this.nftAllowances);
  }

  setVisibleSection(e: any, newVisibleSection: string): void {
    this.visibleSection = this.visibleSection !== newVisibleSection ? newVisibleSection : '';
    this.changeDivHeight(newVisibleSection);
  }

  setSelectedTabIsToken(newSelection: boolean): void {
    this.selectedTabIsToken = newSelection;
    this.visibleSection = '';
  }

  async fixSizeOnChanges(): Promise<any> {
    try {
      const openedDiv = document.getElementsByClassName('shown-allowance')[0];
      if (openedDiv && this.actualElement) {
        await this.sleep(10);
        this.actualElement.style.height = 'max-content';
        this.actualElement.style.height = this.actualElement.scrollHeight + 'px';
      }
    } catch (error) {
      console.log(error);
    }
  }

  sleep(ms: any): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  changeDivHeight(newVisibleSection: any): void {
    // Get actual element
    this.actualElement = document.getElementById(newVisibleSection).getElementsByClassName('section-wrapper')[0];
    // Set previous element to height 0
    if (this.previousElement) {
      this.previousElement.style.height = '0px';
    }
    // Set actual elements height
    if (this.previousElement !== this.actualElement) {
      console.log(this.actualElement.scrollHeight);
      this.actualElement.style.height = this.actualElement.scrollHeight + 'px';
      this.previousElement = this.actualElement;
    } else {
      this.previousElement = null;
    }
  }

}
