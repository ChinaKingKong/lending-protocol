// Contract types
export interface TestToken {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
  balanceOf: (account: string) => Promise<bigint>;
  allowance: (owner: string, spender: string) => Promise<bigint>;
  approve: (spender: string, amount: bigint) => Promise<any>;
  transfer: (to: string, amount: bigint) => Promise<any>;
  transferFrom: (from: string, to: string, amount: bigint) => Promise<any>;
}

export interface SimpleLending {
  token: string;
  totalSupply: bigint;
  totalBorrow: bigint;
  utilizationRate: bigint;
  supplyRate: bigint;
  borrowRate: bigint;
  userSupply: (account: string) => Promise<bigint>;
  userBorrow: (account: string) => Promise<bigint>;
  supply: (amount: bigint) => Promise<any>;
  withdraw: (amount: bigint) => Promise<any>;
  borrow: (amount: bigint) => Promise<any>;
  repay: (amount: bigint) => Promise<any>;
  getUserPosition: (user: string) => Promise<UserPosition>;
  getPoolInfo: () => Promise<PoolInfo>;
  calculateMaxWithdraw: (user: string) => Promise<bigint>;
  calculateMaxBorrow: (user: string) => Promise<bigint>;

  // Events
  queryFilter: (event: any, fromBlock?: number, toBlock?: number) => Promise<any[]>;
  filters: {
    Supplied: (user?: string, amount?: any) => any;
    Withdrawn: (user?: string, amount?: any) => any;
    Borrowed: (user?: string, amount?: any) => any;
    Repaid: (user?: string, amount?: any) => any;
  };
}

export interface UserPosition {
  supplied: bigint;
  borrowed: bigint;
  collateralValue: bigint;
  healthFactor: bigint;
}

export interface PoolInfo {
  totalSupply: bigint;
  totalBorrow: bigint;
  utilizationRate: bigint;
  supplyRate: bigint;
  borrowRate: bigint;
}

// App types
export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  balance: bigint;
}

export interface TokenBalance {
  usd8: bigint;
  weth: bigint;
}

export interface ApprovalState {
  usd8Approved: boolean;
  allowance: bigint;
}

export interface TransactionState {
  hash: string;
  status: "pending" | "confirmed" | "failed";
  error?: string;
}

// Deployment config
export interface DeploymentConfig {
  network: string;
  chainId: string;
  contracts: {
    USD8: string;
    WETH: string;
    SimpleLending: string;
  };
  deployer: string;
  timestamp: string;
}
