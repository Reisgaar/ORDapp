import { Component } from '@angular/core';
import { allowances } from 'src/app/constants/allowances';
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
  contractAddresses = contractAddresses;
  interval: any;

  constructor(
    private tokenService: TokenService,
    private connectionService: ConnectionService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllowances();
    this.interval = setInterval(() => {
      this.getAllowances();
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
        this.getAllowances();
      });
    }
  }

  /**
   * Get and set all allowances of tokens in allowances constant
   */
  async getAllowances(): Promise<any> {
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
    // console.log(this.allowances);
  }

}
