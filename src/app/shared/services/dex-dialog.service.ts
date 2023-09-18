import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Pool } from 'src/app/interfaces/pool';
import { DepositPopUpComponent } from 'src/app/pages/defi/defi-pop-up/deposit-pop-up/deposit-pop-up.component';
import { WithdrawPopUpComponent } from 'src/app/pages/defi/defi-pop-up/withdraw-pop-up/withdraw-pop-up.component';
import { LiquidityMinusComponent } from 'src/app/pages/defi/liquidity-minus/liquidity-minus.component';

@Injectable({
  providedIn: 'root',
})
export class DexDialogService {
  constructor(public dialog: MatDialog) {}

  openWithdrawDialog(
   data
  ): any {
    return this.dialog.open(DepositPopUpComponent, {
      panelClass: 'voting-dialog-container',
      data
    });
  }

  openStakeDialog(
    type: string,
    address: string,
    staked: string,
    subsidiaryTokenSymbol1: string,
    subsidiaryTokenSymbol2: string,
    stakedToken:string,
    stakedTokenSymbol: string
  ): any {
    return this.dialog.open(DepositPopUpComponent, {
      panelClass: 'voting-dialog-container',
      data: {
        type,
        address,
        staked,
        subsidiaryTokenSymbol1,
        subsidiaryTokenSymbol2,
        stakedToken,
        stakedTokenSymbol
      },
    });
  }

  openLiquidityMinus(
    farm: Pool,
  ): any {
    return this.dialog.open(LiquidityMinusComponent, {
      panelClass: 'voting-dialog-container',
      data: {
        farm
      },
    });
  }

}
