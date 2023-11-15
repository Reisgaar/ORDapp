import { Component, Inject, OnInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BigNumber, FixedNumber } from 'ethers';
import { LiquidityValue } from 'src/app/interfaces/liquidity-value';
import { ConnectionService } from 'src/app/shared/services/connection/connection.service';
import { DexService } from 'src/app/shared/services/dex/dex.service';

@Component({
  selector: 'app-liquidity-minus',
  templateUrl: './liquidity-minus.component.html',
  styleUrls: ['./liquidity-minus.component.scss'],
  // providers: [
  //   {
  //     provide: NG_VALUE_ACCESSOR,
  //     useExisting: forwardRef(() => ammount),
  //     multi: true,
  //   }
  // ]
})
export class LiquidityMinusComponent implements OnInit {
  isConnect = this.connectionService.isWalletConnected();
  showNumberAmount: number = 0;
  ammountBalance: FixedNumber = FixedNumber.from('0');
  ammountPercentaje: any = 0;
  balanceTotal: string;
  liquidityAmount: FixedNumber;
  percents: number[] = [25, 50, 75, 100];
  max = 100;
  min = 0;
  step = 10;
  rewardTokenFirst: any;
  rewardTokenSecond: any;
  liquidityValues: LiquidityValue;
  maxAmount: string;
  amount: string = '0';
  inputTooHigh: boolean = false;
  inputNegative: boolean = false;
  userAddr: string;
  constructor(
    public dialogRef: MatDialogRef<LiquidityMinusComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private connectionService: ConnectionService,
    private dexService: DexService
  ) {
    console.log(data.farm);

  }
  async ngOnInit(): Promise<void> {
    this.userAddr = this.connectionService.getWalletAddress();
    this.getLPReserves();

  }

  /**
   * Close the dialog
   */
  closePopUp(): void {
    this.dialogRef.close();
  }

  async getLPReserves(): Promise<void> {
    this.maxAmount = this.connectionService.fromWei(this.data.farm.liquidityData);
    console.log(this.maxAmount);
  }

  // Percentage change event return amount
  async setRewards(): Promise<void> {
    // Modify liquidity amount
    const amountPercentaje = this.ammountPercentaje / 100;

    console.log(this.ammountPercentaje, amountPercentaje, this.amount);
    const amountFN = FixedNumber.from(amountPercentaje.toString());
    // this.ammountBalance = FixedNumber.from(this.data.farm.liquidityData).mulUnsafe(amountFN);
    const liquidityDataFN = FixedNumber.from(this.data.farm.liquidityData);
    this.liquidityAmount = liquidityDataFN.mulUnsafe(amountFN);

    this.liquidityValues = await this.dexService.estimateLiquidityValue(
      this.data.farm.address,
      this.data.farm.subsidiaryTokenReserve1,
      this.data.farm.subsidiaryTokenReserve2,
      this.liquidityAmount
    );
    this.rewardTokenFirst = this.liquidityValues.amount0.toString();
    this.rewardTokenSecond = this.liquidityValues.amount1.toString();

  }

  // Returns the percentage to subtract from liquidity
  async setPercent(percent: number): Promise<void> {
    this.ammountPercentaje = percent;
    if(percent == 100) {
      this.amount = this.maxAmount;
      await this.setRewards();
    } else {
    this.amount = ((parseFloat(this.maxAmount)* percent) / 100).toString();
    await this.setRewards();
    }
  }

  // Amount onchange
  async maxBalance(): Promise<void> {
    console.log(
      BigNumber.from(this.connectionService.toWei(this.maxAmount)),
      BigNumber.from(this.connectionService.toWei(this.amount.toString()))
    );
    if (BigNumber.from(this.connectionService.toWei(this.maxAmount)).gt(BigNumber.from(this.connectionService.toWei(this.amount.toString())))) {
      this.ammountPercentaje = (parseFloat(this.amount) * 100) / parseFloat(this.maxAmount);
      // this.amount = parseFloat(this.amount);
      this.amount = this.amount.toString();
      await this.setRewards();
    } else {
      this.ammountPercentaje = 100;
      this.amount = this.maxAmount;
      await this.setRewards();
    }
  }

  async remove(): Promise<void> {
    await this.liquidityMinusSelectedPool();
  }

  async liquidityMinusSelectedPool(): Promise<void> {
    try {
      // Get slippage and deadline values
      const slippage = Number(localStorage.getItem('slipTolerance'));
      // Deadline to seconds
      const deadline = Number(localStorage.getItem('transDeadLine')) * 60;
const liquidityToRemove = this.connectionService.toWei(this.amount);
      // Approve liquidity if needed

      // Remove Liquidity
      await this.dexService.removeLiquidityAny(
        liquidityToRemove,
        slippage,
        deadline,
        this.liquidityValues,
        this.data.farm.subsidiaryToken1,
        this.data.farm.subsidiaryToken2,
        this.userAddr,
        this.data.farm.address
      );

    } catch (error) {
      console.log(error);
    } finally {
      console.log('done');
      this.dialogRef.close();
    }
  }

    /**
   * Prevents the erase on the input
   * @param {any} event : the keypress event
   */
  preventErase(event: any): void {
    if (event.keyCode === 46) {
      event.preventDefault();
    }
  }

}
