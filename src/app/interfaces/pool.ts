import { BigNumber } from 'ethers';

export interface Pool {
  id:string | void;
  address: string;
  allocPoint: string;
  allowance: boolean;
  totalAllocPoint: string;
  lockupDuration: number;
  timeLockup: number;
  stakedToken: string;
  stakedTokenSymbol: string;
  stakedTokenName: string;
  stakedTokenImg: string;
  stakedTokenDecimals: number;
  subsidiaryToken1: string;
  subsidiaryTokenSymbol1: string;
  subsidiaryTokenName1: string;
  subsidiaryTokenImg1?: string;
  subsidiaryTokenDecimals1: number;
  subsidiaryTokenReserve1: string;
  subsidiaryToken2: string;
  subsidiaryTokenSymbol2: string;
  subsidiaryTokenName2: string;
  subsidiaryTokenImg2: string;
  subsidiaryTokenDecimals2: number;
  subsidiaryTokenReserve2: string;
  resourcePerBlock: string;
  rewardToken: string;
  rewardTokenSymbol: string;
  rewardTokenName: string;
  rewardTokenImg: string;
  // rewardTokenImg1: string;
  // rewardTokenImg2: string;
  rewardTokenDecimals: number;
  rewardTokenPrice: number;
  rewardDaily: number;
  rewardWeekly: number;
  rewardMonthly: number;
  rewardYearly: number;
  startBlock: number;
  actualBlock: number;
  endBlock: number;
  rewardPerBlock: string;
  isApproved: boolean;
  staked: string;
  stakedTotal: string;
  pendingRewards: string;
  // unStakeAmount: number;
  // roiDaily: number;
  // roiWeekly: number;
  // roiMonthly: number;
  // roiYearly: number;
  // roiYCompound: number;
  apr: number;
  tvl: BigNumber;
  hasStarted: boolean;
  hasEnded: boolean;
  // website: string;
  fee: number;
  // multiplier: number;
  type: string;
  factory: string;
  liquidityData: any;
  hasLimit:boolean;
  farm?: string;
}