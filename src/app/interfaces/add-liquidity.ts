import { BigNumber } from 'ethers';

export interface AddLiquidity {
  token1: string;
  tokenName1: string;
  amount1: string;
  tokenBalance1: BigNumber;
  subsidiaryTokenSymbol1: string;
  token2: string;
  tokenName2: string;
  amount2: string;
  tokenBalance2: BigNumber,
  subsidiaryTokenSymbol2: string;
  slippage: string;
  tokenImg1: string;
  tokenImg2: string;
  tokenDecimals1: number;
  tokenDecimals2: number;
}
