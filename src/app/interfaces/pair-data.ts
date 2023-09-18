import { BigNumber } from 'ethers';

export interface PairData {
  reserve0: BigNumber;
  reserve1: BigNumber;
  token0: string;
  token1: string;
  addr: string;
  fee: number;
  tokenDecimals0: number;
  tokenDecimals1: number;
}
