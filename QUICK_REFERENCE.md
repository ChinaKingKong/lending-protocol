# 面试快速参考卡

## 一句话介绍
> 这是一个完整的 DeFi 借贷协议前端 Dashboard，使用 React + TypeScript + ethers.js v6 构建实现了与以太坊智能合约的完整交互。

## 技术栈（记忆关键词）
```
Solidity 0.8.19 | Hardhat | React 19 | TypeScript | ethers.js v6 | Vite | Tailwind CSS
```

## 核心功能（5个）
1. **钱包连接** - MetaMask + 网络自动切换
2. **池子信息** - 供应量/借款量/利用率/利率
3. **用户仓位** - 供应/借款/健康因子
4. **借贷操作** - Supply/Withdraw/Borrow/Repay
5. **ERC20授权** - Approve流程

## 关键代码文件（5个）
```
contracts/SimpleLending.sol     # 核心借贷合约
frontend/src/hooks/useWallet.ts # 钱包连接
frontend/src/hooks/useContract.ts # 合约交互
frontend/src/components/Supply.tsx # 供应组件
frontend/src/hooks/useLendingProtocol.ts # 协议Hooks
```

## 重要参数
```
LTV_RATIO = 75%         # 借款价值比
LIQUIDATION_THRESHOLD = 80%  # 清算阈值
Chain ID = 31337        # Hardhat本地网络
```

## 健康因子计算
```
健康因子 = (抵押品 × 0.75 × 100) / 借款金额
> 150: 安全 (绿色)
100-150: 警告 (黄色)
< 100: 危险 (红色)
```

## 演示命令（3步）
```bash
# Terminal 1: 启动本地网络
npx hardhat node

# Terminal 2: 部署合约
npx hardhat run scripts/deploy.ts --network localhost

# Terminal 3: 启动前端
cd frontend && npm run dev
```

## MetaMask 测试账户
```
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
Account #0 (10,000 ETH)
```

## 可能被问到的问题速答

| 问题 | 答案关键词 |
|------|-----------|
| 为什么选 ethers.js v6? | TypeScript支持好、API简洁、维护活跃 |
| 如何保证精度? | BigInt + parseUnits/formatUnits |
| 如何处理状态同步? | 交易确认后刷新 + 事件监听 |
| 安全考虑? | 输入验证、余额检查、健康因子检查 |
| 75% LTV是什么意思? | 用户最多可以借抵押品价值的75% |

## 技术亮点（3个）
1. **类型安全** - 全程TypeScript，完整类型定义
2. **错误处理** - 用户友好的错误提示和交易状态
3. **数值精度** - 使用BigInt避免浮点数问题

## 项目地址
```
/Users/lizhigang/conductor/workspaces/hackathon/algiers/lending-protocol
```
