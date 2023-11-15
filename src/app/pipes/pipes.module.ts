import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CeilPipe } from './ceil.pipe';
import { DeleteWhitespacesPipe } from './deleteWhitespaces.pipe';
import { FloorPipe } from './floor.pipe';
import { ParseNumberPipe } from './parseNumber.pipe';
import { ShortWalletPipe } from './shortWallet.pipe';
import { FormatTimePipe } from './formatTime.pipe';
import { TimeStampIsPastPipe } from './timeStampIsPast.pipe';
import { ToTickerPipe } from './toTicker.pipe';
import { WalletFirstNumPipe } from './walletFirstNum.pipe';
import { WalletSpeciePipe } from './walletSpecie.pipe';
import { FromWeiPipe } from './fromWei.pipe';
import { NftContractToNamePipe } from './nftContractToName.pipe';
import { NftContractToVariablePipe } from './nftContractToVariable.pipe';
import { MaterialToTickerPipe } from './materialToTicker.pipe';
import { MaterialFromAddressPipe } from './materialFromAddress.pipe';
import { NftNameToCamelCase } from './nftNameToCamelCase.pipe';



@NgModule({
  declarations: [
    CeilPipe,
    DeleteWhitespacesPipe,
    FloorPipe,
    FromWeiPipe,
    MaterialFromAddressPipe,
    MaterialToTickerPipe,
    NftContractToNamePipe,
    NftContractToVariablePipe,
    ParseNumberPipe,
    ShortWalletPipe,
    FormatTimePipe,
    TimeStampIsPastPipe,
    ToTickerPipe,
    WalletFirstNumPipe,
    WalletSpeciePipe,
    NftNameToCamelCase,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CeilPipe,
    DeleteWhitespacesPipe,
    FloorPipe,
    FromWeiPipe,
    MaterialFromAddressPipe,
    MaterialToTickerPipe,
    NftContractToNamePipe,
    NftContractToVariablePipe,
    ParseNumberPipe,
    ShortWalletPipe,
    FormatTimePipe,
    TimeStampIsPastPipe,
    ToTickerPipe,
    WalletFirstNumPipe,
    WalletSpeciePipe,
    NftNameToCamelCase,
  ]
})
export class PipesModule { }
