export const en = {
  // Header
  "header.title": "Lending Protocol",
  "header.logoAlt": "Lending Protocol",
  "header.hardhatNetwork": "Hardhat Local Network",
  "header.chainId": "Chain ID: {{id}}",
  "header.notConnected": "Not Connected",
  "header.disconnect": "Disconnect",
  "header.connecting": "Connecting...",
  "header.connectWallet": "Connect Wallet",

  // Language
  "lang.en": "EN",
  "lang.zh": "中文",

  // Hero
  "hero.poweredBy": "Powered by Hardhat",
  "hero.title": "DeFi Lending Protocol",
  "hero.subtitle": "Supply assets and earn competitive interest rates. Borrow against your collateral with up to 75% LTV.",
  "hero.supplyApy": "Supply APY",
  "hero.borrowApy": "Borrow APY",
  "hero.collateral": "Collateral",

  // Connect warning
  "connect.title": "Connect Your Wallet",
  "connect.desc": "Connect your MetaMask wallet to start using the lending protocol",

  // Pool
  "pool.title": "Pool Information",
  "pool.subtitle": "Real-time market data",
  "pool.connectToView": "Connect wallet to view pool information",
  "pool.totalSupply": "Total Supply",
  "pool.totalBorrowed": "Total Borrowed",
  "pool.utilizationRate": "Utilization Rate",
  "pool.supplyApy": "Supply APY",
  "pool.borrowApy": "Borrow APY",
  "pool.perYear": "Per Year",

  // User position
  "position.title": "Your Position",
  "position.subtitle": "Account overview and status",
  "position.connectToView": "Connect wallet to view your position",
  "position.supplied": "Supplied",
  "position.borrowed": "Borrowed",
  "position.maxWithdraw": "Max Withdraw",
  "position.maxBorrow": "Max Borrow",
  "position.usd8Available": "USD8 available",
  "position.usd0Available": "USD0 available",
  "position.healthFactor": "Health Factor",
  "position.healthProgress": "Health Factor Progress",
  "position.risk": "Risk",
  "position.safe": "Safe",
  "position.safeLabel": "Safe",
  "position.moderateLabel": "Moderate",
  "position.atRiskLabel": "At Risk",

  // Health factor info
  "health.title": "Health Factor Safety",
  "health.desc": "Position safety indicator based on your collateral vs borrowed amount",
  "health.safe": "Safe: HF > 150%",
  "health.moderate": "Moderate: 100% < HF ≤ 150%",
  "health.risk": "Risk: HF < 100%",

  // Supply
  "supply.title": "Supply Assets",
  "supply.subtitle": "Earn interest on your deposits",
  "supply.apyBadge": "Supply APY: ~2%",
  "supply.amount": "Amount (USD8)",
  "supply.balance": "Balance",
  "supply.max": "MAX",
  "supply.approveUsd8": "Approve USD8",
  "supply.approving": "Approving...",
  "supply.supply": "Supply",
  "supply.supplyAmount": "Supply {{amount}} USD8",
  "supply.supplying": "Supplying...",
  "supply.approved": "Approved",
  "supply.txSubmitted": "Transaction submitted",
  "supply.errorApproval": "Approval failed",
  "supply.errorValidAmount": "Please enter a valid amount",
  "supply.errorInsufficient": "Insufficient balance",
  "supply.errorSupply": "Supply failed",
  "supply.errorContract": "Contract not connected",

  // Withdraw
  "withdraw.title": "Withdraw Assets",
  "withdraw.subtitle": "Remove your deposited tokens",
  "withdraw.amount": "Amount (USD8)",
  "withdraw.supplied": "Supplied",
  "withdraw.available": "Available",
  "withdraw.withdraw": "Withdraw",
  "withdraw.withdrawAmount": "Withdraw {{amount}} USD8",
  "withdraw.withdrawing": "Withdrawing...",
  "withdraw.txSubmitted": "Transaction submitted",
  "withdraw.errorValidAmount": "Please enter a valid amount",
  "withdraw.errorMax": "Maximum withdrawable is {{max}} USD8",
  "withdraw.errorWithdraw": "Withdraw failed",
  "withdraw.errorContract": "Contract not connected",

  // Borrow
  "borrow.title": "Borrow Assets",
  "borrow.subtitle": "Borrow against your collateral",
  "borrow.amount": "Amount (USD8)",
  "borrow.collateral": "Collateral",
  "borrow.available": "Available",
  "borrow.borrow": "Borrow",
  "borrow.borrowAmount": "Borrow {{amount}} USD8",
  "borrow.borrowing": "Borrowing...",
  "borrow.variableRate": "Variable Interest Rate",
  "borrow.variableRateDesc": "Interest accrues every block based on utilization",
  "borrow.txSubmitted": "Transaction submitted",
  "borrow.errorValidAmount": "Please enter a valid amount",
  "borrow.errorMax": "Maximum borrowable is {{max}} USD8",
  "borrow.errorBorrow": "Borrow failed",
  "borrow.errorContract": "Contract not connected",

  // Repay
  "repay.title": "Repay Debt",
  "repay.subtitle": "Pay back your borrowed tokens",
  "repay.amount": "Amount (USD8)",
  "repay.yourDebt": "Your Debt",
  "repay.balance": "Balance",
  "repay.repay": "Repay",
  "repay.repayAmount": "Repay {{amount}} USD8",
  "repay.repaying": "Repaying...",
  "repay.repayTip": "Repaying reduces your debt and improves health factor",
  "repay.txSubmitted": "Transaction submitted",
  "repay.errorValidAmount": "Please enter a valid amount",
  "repay.errorInsufficient": "Insufficient USD8 balance",
  "repay.errorMax": "Maximum repayable is {{max}} USD8",
  "repay.errorRepay": "Repay failed",
  "repay.errorContract": "Contract not connected",

  // Features
  "feature.supplyEarn.title": "Supply & Earn",
  "feature.supplyEarn.desc": "Deposit USD8 tokens as collateral and earn interest based on market utilization rates.",
  "feature.borrow.title": "Borrow Instantly",
  "feature.borrow.desc": "Borrow USD8 against your supplied collateral with no credit checks, up to 75% LTV.",
  "feature.repay.title": "Flexible Repayment",
  "feature.repay.desc": "Repay your borrowed amount at any time to improve your health factor and reduce interest.",

  // Footer
  "footer.title": "Lending Protocol",
  "footer.subtitle": "PQA Labs Coding Test",
  "footer.builtWith": "Built with",
} as const;

export type LocaleKey = keyof typeof en;
