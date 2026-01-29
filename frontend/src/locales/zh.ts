import type { LocaleKey } from "./en";

export const zh: Record<LocaleKey, string> = {
  // Header
  "header.title": "借贷协议",
  "header.logoAlt": "借贷协议",
  "header.hardhatNetwork": "Hardhat 本地网络",
  "header.chainId": "链 ID: {{id}}",
  "header.notConnected": "未连接",
  "header.disconnect": "断开连接",
  "header.connecting": "连接中...",
  "header.connectWallet": "连接钱包",

  // Language
  "lang.en": "EN",
  "lang.zh": "中文",

  // Hero
  "hero.poweredBy": "基于 Hardhat",
  "hero.title": "DeFi 借贷协议",
  "hero.subtitle": "存入资产赚取收益，以抵押品借入最高 75% LTV。",
  "hero.supplyApy": "存款年化",
  "hero.borrowApy": "借款年化",
  "hero.collateral": "抵押率",

  // Connect warning
  "connect.title": "连接钱包",
  "connect.desc": "连接 MetaMask 钱包以使用借贷协议",

  // Pool
  "pool.title": "资金池信息",
  "pool.subtitle": "实时市场数据",
  "pool.connectToView": "连接钱包查看资金池信息",
  "pool.totalSupply": "总存款",
  "pool.totalBorrowed": "总借款",
  "pool.utilizationRate": "利用率",
  "pool.supplyApy": "存款年化",
  "pool.borrowApy": "借款年化",
  "pool.perYear": "年化",

  // User position
  "position.title": "您的仓位",
  "position.subtitle": "账户概览与状态",
  "position.connectToView": "连接钱包查看您的仓位",
  "position.supplied": "已存入",
  "position.borrowed": "已借入",
  "position.maxWithdraw": "最大可取",
  "position.maxBorrow": "最大可借",
  "position.usd8Available": "USD8 可用",
  "position.usd0Available": "USD0 可用",
  "position.healthFactor": "健康因子",
  "position.healthProgress": "健康因子进度",
  "position.risk": "风险",
  "position.safe": "安全",
  "position.safeLabel": "安全",
  "position.moderateLabel": "一般",
  "position.atRiskLabel": "风险",

  // Health factor info
  "health.title": "健康因子说明",
  "health.desc": "根据抵押品与借款比例显示仓位安全程度",
  "health.safe": "安全: HF > 150%",
  "health.moderate": "一般: 100% < HF ≤ 150%",
  "health.risk": "风险: HF < 100%",

  // Supply
  "supply.title": "存入资产",
  "supply.subtitle": "存入赚取利息",
  "supply.apyBadge": "存款年化: ~2%",
  "supply.amount": "数量 (USD8)",
  "supply.balance": "余额",
  "supply.max": "最大",
  "supply.approveUsd8": "授权 USD8",
  "supply.approving": "授权中...",
  "supply.supply": "存入",
  "supply.supplyAmount": "存入 {{amount}} USD8",
  "supply.supplying": "存入中...",
  "supply.approved": "已授权",
  "supply.txSubmitted": "交易已提交",
  "supply.errorApproval": "授权失败",
  "supply.errorValidAmount": "请输入有效数量",
  "supply.errorInsufficient": "余额不足",
  "supply.errorSupply": "存入失败",
  "supply.errorContract": "合约未连接",

  // Withdraw
  "withdraw.title": "取出资产",
  "withdraw.subtitle": "取出已存入的代币",
  "withdraw.amount": "数量 (USD8)",
  "withdraw.supplied": "已存入",
  "withdraw.available": "可用",
  "withdraw.withdraw": "取出",
  "withdraw.withdrawAmount": "取出 {{amount}} USD8",
  "withdraw.withdrawing": "取出中...",
  "withdraw.txSubmitted": "交易已提交",
  "withdraw.errorValidAmount": "请输入有效数量",
  "withdraw.errorMax": "最大可取 {{max}} USD8",
  "withdraw.errorWithdraw": "取出失败",
  "withdraw.errorContract": "合约未连接",

  // Borrow
  "borrow.title": "借入资产",
  "borrow.subtitle": "以抵押品借入",
  "borrow.amount": "数量 (USD8)",
  "borrow.collateral": "抵押品",
  "borrow.available": "可用",
  "borrow.borrow": "借入",
  "borrow.borrowAmount": "借入 {{amount}} USD8",
  "borrow.borrowing": "借入中...",
  "borrow.variableRate": "浮动利率",
  "borrow.variableRateDesc": "利息按区块根据利用率累计",
  "borrow.txSubmitted": "交易已提交",
  "borrow.errorValidAmount": "请输入有效数量",
  "borrow.errorMax": "最大可借 {{max}} USD8",
  "borrow.errorBorrow": "借入失败",
  "borrow.errorContract": "合约未连接",

  // Repay
  "repay.title": "偿还借款",
  "repay.subtitle": "归还已借代币",
  "repay.amount": "数量 (USD8)",
  "repay.yourDebt": "您的借款",
  "repay.balance": "余额",
  "repay.repay": "偿还",
  "repay.repayAmount": "偿还 {{amount}} USD8",
  "repay.repaying": "偿还中...",
  "repay.repayTip": "偿还可降低债务并改善健康因子",
  "repay.txSubmitted": "交易已提交",
  "repay.errorValidAmount": "请输入有效数量",
  "repay.errorInsufficient": "USD8 余额不足",
  "repay.errorMax": "最大可还 {{max}} USD8",
  "repay.errorRepay": "偿还失败",
  "repay.errorContract": "合约未连接",

  // Features
  "feature.supplyEarn.title": "存入赚息",
  "feature.supplyEarn.desc": "存入 USD8 作为抵押品，根据市场利用率赚取利息。",
  "feature.borrow.title": "即时借入",
  "feature.borrow.desc": "以抵押品借入 USD8，无需信用审核，最高 75% LTV。",
  "feature.repay.title": "灵活还款",
  "feature.repay.desc": "随时还款以提升健康因子并减少利息。",

  // Footer
  "footer.title": "借贷协议",
  "footer.subtitle": "PQA Labs 编程测试",
  "footer.builtWith": "技术栈",
};
