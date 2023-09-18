import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BigNumber } from 'ethers';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';

@Component({
  selector: 'app-withdraw-pop-up',
  templateUrl: './withdraw-pop-up.component.html',
  styleUrls: ['./withdraw-pop-up.component.scss']
})
export class WithdrawPopUpComponent {
  max = 100;
  min = 0;
  step = 20;
  amountPercentage = 0;
  noDisplay: boolean = false;
  amountToUnstake: string;
  thumbLabel = true;

  constructor(
    public dialogRef: MatDialogRef<WithdrawPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private connectionService: ConnectionService
  ) {
  }

  approveSupply(): void {
    this.dialogRef.close(
      this.amountToUnstake
    );
  }

     // Amount onchange
     rewardUsdt(): void {
      const stakedBN = BigNumber.from(this.connectionService.toWei(this.data.staked));
      const amountBN =  BigNumber.from(this.connectionService.toWei(this.amountToUnstake.toString()));
      console.log(amountBN, stakedBN);
      if (amountBN.gt(stakedBN)) {
        console.log('greater');
        this.amountPercentage = 100;
        this.setPercentageUnstake(100);
      } else {
        console.log('leser');

        const amountPer = amountBN
          .mul(BigNumber.from(100))
          .div(stakedBN);
        console.log(amountPer);
        this.amountPercentage = amountPer.toNumber();
        console.log('', this.amountPercentage);
      }
    }

    setPercentageUnstake(percentage: number): void {
      this.amountToUnstake = undefined;
      if (percentage == 0) {
        this.noDisplay = true;
        return;
      }
      if (this.data.staked == '0.000000000000000000') {
        this.noDisplay = true;
        return;
      }
      if (percentage == 100) {
        // this.staked = Number(this.data.staked);
        this.amountToUnstake = this.data.staked;
        return;
      } else {
        // this.amountPercentage = percentage;
        const poolStakeBN = BigNumber.from(this.connectionService.toWei(this.data.staked));
        console.log(poolStakeBN);
        const toUnstakeWNFee = poolStakeBN
          .mul(BigNumber.from(percentage))
          .div(BigNumber.from(100));

        // const toUnstakeWNFee =   Number(this.pool.staked) * this.amountPercentage / 100;
        console.log(toUnstakeWNFee.toString(), this.connectionService.fromWei(toUnstakeWNFee.toString()));
        this.amountToUnstake = this.connectionService.fromWei(toUnstakeWNFee.toString());
        // this.amountToUnstakeShow = Number(this.amountToUnstake);
      }
    }

}
