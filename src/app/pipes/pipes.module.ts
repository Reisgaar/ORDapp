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
import { GetNftImagePipe } from './getNftImage.pipe';
import { TimeToDhmsPipe } from './timeToDhms.pipe';



@NgModule({
  declarations: [
    CeilPipe,
    DeleteWhitespacesPipe,
    FloorPipe,
    FormatTimePipe,
    FromWeiPipe,
    GetNftImagePipe,
    MaterialFromAddressPipe,
    MaterialToTickerPipe,
    NftContractToNamePipe,
    NftContractToVariablePipe,
    NftNameToCamelCase,
    ParseNumberPipe,
    ShortWalletPipe,
    TimeStampIsPastPipe,
    TimeToDhmsPipe,
    ToTickerPipe,
    WalletFirstNumPipe,
    WalletSpeciePipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CeilPipe,
    DeleteWhitespacesPipe,
    FloorPipe,
    FormatTimePipe,
    FromWeiPipe,
    GetNftImagePipe,
    MaterialFromAddressPipe,
    MaterialToTickerPipe,
    NftContractToNamePipe,
    NftContractToVariablePipe,
    NftNameToCamelCase,
    ParseNumberPipe,
    ShortWalletPipe,
    TimeStampIsPastPipe,
    TimeToDhmsPipe,
    ToTickerPipe,
    WalletFirstNumPipe,
    WalletSpeciePipe,
  ]
})
export class PipesModule { }
