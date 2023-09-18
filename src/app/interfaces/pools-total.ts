
// export type PoolsTotal = PoolDex[]

export interface PoolsTotal {
  id: string
  factory: string
  pool: string
  type: string
  startBlock: string
  endBlock: string
  stakedToken: StakedToken
  rewardToken: RewardToken[]
}

export interface StakedToken {
  id: string
  address: string
  symbol: string
  LPToken?: Lptoken,
  decimals?: number
}

export interface Lptoken {
  id: string
  token0: string
  token0Symbol: string
  token1: string
  token1Symbol: string
}

export interface RewardToken {
  id: string
  address: string
  symbol: string
  LPToken: any
}
