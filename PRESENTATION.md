# DeFi Lending Protocol 项目演示文档

> PQA Labs Web3 Full Stack Developer 面试测评项目
>
> 作者: Zhigang Li
> 日期: 2026年1月

---

## 目录

1. [项目概述](#1-项目概述)
2. [技术架构](#2-技术架构)
3. [核心功能实现](#3-核心功能实现)
4. [技术亮点](#4-技术亮点)
5. [演示步骤](#5-演示步骤)
6. [常见问题解答](#6-常见问题解答)
7. [技术决策说明](#7-技术决策说明)

---

## 1. 项目概述

### 1.1 项目背景

这是一个完整的 DeFi 借贷协议前端 Dashboard，实现了与以太坊智能合约的完整交互。项目展示了作为 Web3 全栈开发者的核心能力：智能合约理解、前端开发、Web3 集成。

### 1.2 核心功能

| 功能模块 | 描述 |
|---------|------|
| 钱包连接 | MetaMask 集成，支持网络自动切换 |
| 借贷池信息 | 实时显示总供应量、借款量、利用率 |
| 用户仓位 | 显示用户的供应、借款、健康因子 |
| 供应操作 | 存入 USD8 获得利息收益 |
| 取款操作 | 取出已供应的代币 |
| 借款操作 | 以抵押品为担保借款 |
| 还款操作 | 偿还已借款项 |

### 1.3 技术栈

```
智能合约: Solidity 0.8.19
开发框架: Hardhat
前端框架: React 19 + TypeScript
Web3库: ethers.js v6
构建工具: Vite
样式框架: Tailwind CSS
```

---

## 2. 技术架构

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        用户界面层                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  Wallet  │ │   Pool   │ │ Position │ │  Action  │       │
│  │ Connect  │ │   Info   │ │ Display  │ │  Panels  │       │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘       │
└───────┼────────────┼────────────┼────────────┼──────────────┘
        │            │            │            │
┌───────┴────────────┴────────────┴────────────┴──────────────┐
│                      React Hooks 层                          │
│  ┌────────────┐ ┌────────────┐ ┌────────────────────┐       │
│  │ useWallet  │ │ useContract│ │ useLendingProtocol │       │
│  └────────────┘ └────────────┘ └────────────────────┘       │
└───────┬───────────────────────────────────┬──────────────────┘
        │                                   │
┌───────┴──────────┐              ┌─────────┴─────────┐
│  ethers.js v6    │              │  Smart Contracts  │
│  (Web3 Provider) │◄────────────►│  (Ethereum)       │
└──────────────────┘              └───────────────────┘
```

### 2.2 文件结构

```
lending-protocol/
├── contracts/                 # 智能合约
│   ├── TestToken.sol         # 测试代币合约
│   └── SimpleLending.sol     # 借贷协议核心合约
├── scripts/                   # 部署脚本
│   ├── deploy.ts             # 合约部署脚本
│   └── seed.ts               # 代币分发脚本
├── test/                      # 测试文件
│   └── SimpleLending.test.js # 集成测试
├── frontend/
│   └── src/
│       ├── components/       # React 组件
│       │   ├── Header.tsx    # 头部导航
│       │   ├── PoolInfo.tsx  # 池子信息面板
│       │   ├── UserPosition.tsx # 用户仓位
│       │   ├── Supply.tsx    # 供应操作
│       │   ├── Withdraw.tsx  # 取款操作
│       │   ├── Borrow.tsx    # 借款操作
│       │   └── Repay.tsx     # 还款操作
│       ├── hooks/            # 自定义 Hooks
│       │   ├── useWallet.ts  # 钱包连接
│       │   ├── useContract.ts# 合约实例化
│       │   ├── useLendingProtocol.ts # 借贷协议交互
│       │   ├── useTokenBalance.ts # 余额查询
│       │   └── useApproval.ts # ERC20 授权
│       ├── types/            # TypeScript 类型定义
│       ├── abis/             # 合约 ABI
│       └── deployment.json   # 部署配置
└── hardhat.config.js         # Hardhat 配置
```

---

## 3. 核心功能实现

### 3.1 智能合约核心逻辑

**SimpleLending.sol** 核心参数：

```solidity
// LTV 比率：75% - 用户最多可以借出抵押品的 75%
uint256 public constant LTV_RATIO = 75;

// 清算阈值：80% - 低于此值存在清算风险
uint256 public constant LIQUIDATION_THRESHOLD = 80;

// 基础利率：2%
uint256 public constant BASE_RATE = 2;
```

**健康因子计算**：
```
健康因子 = (抵押品价值 × LTV比率) / 借款金额 × 100
```

### 3.2 钱包连接实现 (useWallet.ts)

```typescript
// 核心功能：
// 1. 检测 MetaMask 安装
// 2. 请求账户连接
// 3. 自动切换到 Hardhat 本地网络 (Chain ID: 31337)
// 4. 监听账户和网络变化

const connect = async () => {
  const provider = new BrowserProvider(window.ethereum);
  const accounts = await provider.send("eth_requestAccounts", []);

  // 自动切换到本地网络
  if (chainId !== 31337) {
    await switchToLocalNetwork();
  }

  const signer = await provider.getSigner();
  // ... 更新状态
}
```

### 3.3 供应流程 (Supply)

```
用户操作流程：
1. 用户输入供应金额
2. 检查 USD8 余额是否充足
3. 调用 ERC20 approve() 授权合约
4. 调用 SimpleLending.supply() 存入代币
5. 监听交易状态，更新 UI
```

### 3.4 健康因子显示

```typescript
// 健康因子颜色编码
const getHealthColor = (hf: number) => {
  if (hf === Infinity) return "text-green-500";  // 无借款
  if (hf > 150) return "text-green-500";         // 安全
  if (hf > 100) return "text-yellow-500";        // 警告
  return "text-red-500";                         // 危险
}
```

---

## 4. 技术亮点

### 4.1 类型安全

全程使用 TypeScript，定义了完整的类型：

```typescript
// frontend/src/types/index.ts
interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  balance: bigint;
}

interface UserPosition {
  supplied: bigint;
  borrowed: bigint;
  collateralValue: bigint;
  healthFactor: bigint;
}
```

### 4.2 安全的数值处理

使用 ethers.js v6 的 `BigInt` 进行精确的数值计算：

```typescript
// 避免浮点数精度问题
const amount = ethers.parseUnits(userInput, 18);
const formatted = ethers.formatUnits(contractValue, 18);
```

### 4.3 错误处理

```typescript
try {
  const tx = await contract.supply(amount);
  setTxHash(tx.hash);
  await tx.wait();
  // 成功后刷新数据
  onRefresh();
} catch (err: any) {
  // 用户友好的错误提示
  setError(err.message || "Supply failed");
}
```

### 4.4 交易状态管理

```typescript
// 三种状态：pending、confirmed、failed
type TransactionStatus = "pending" | "confirmed" | "failed";

const [txStatus, setTxStatus] = useState<TransactionStatus>("pending");
```

---

## 5. 演示步骤

### 5.1 准备工作（面试前）

```bash
# 1. 启动本地网络
cd lending-protocol
npx hardhat node

# 2. 新开终端，部署合约
npx hardhat run scripts/deploy.ts --network localhost

# 3. 新开终端，启动前端
cd frontend
npm run dev
```

### 5.2 演示流程

**第一步：展示项目结构**
```
"这是一个完整的借贷协议项目，包含智能合约和前端应用。"
→ 展示目录结构
→ 重点介绍 contracts 和 frontend/src
```

**第二步：启动演示**
```
"首先启动 Hardhat 本地网络，它会预生成 20 个测试账户。"
→ 展示 hardhat node 输出
→ "然后部署合约，可以看到生成的合约地址"
```

**第三步：连接钱包**
```
"现在打开前端页面，点击 Connect Wallet 连接 MetaMask。"
→ 展示添加网络功能（自动切换到 Chain ID 31337）
→ 展示导入测试账户的私钥
→ "连接成功后可以看到账户地址和 ETH 余额"
```

**第四步：供应操作演示**
```
"首先需要供应 USD8 作为抵押品。输入 1000 USD8..."
→ 展示 Approve 流程（首次需要授权）
→ 展示 Supply 交易
→ "交易完成后可以看到 Pool Info 和 User Position 的变化"
```

**第五步：借款操作演示**
```
"现在可以借款了。根据 75% 的 LTV，最多可以借 750 USD8。"
→ 输入 500 USD8 进行借款
→ 展示健康因子变化（Infinity → 150）
→ "健康因子大于 100 表示仓位安全"
```

**第六步：还款和取款**
```
"现在演示还款和取款功能..."
→ 展示 Repay 操作
→ 展示 Withdraw 操作
→ "取款时会检查健康因子，防止取款后仓位不健康"
```

**第七步：展示代码**
```
"现在看一下核心代码的实现..."
→ 展示 hooks/useWallet.ts（钱包连接）
→ 展示 hooks/useLendingProtocol.ts（合约交互）
→ 展示 components/Supply.tsx（前端组件）
```

---

## 6. 常见问题解答

### Q1: 为什么选择 ethers.js v6 而不是 web3.js？

**答**: ethers.js v6 是目前最现代的以太坊 JavaScript 库：
- 更好的 TypeScript 支持
- 更简洁的 API 设计
- 更小的包体积
- 更活跃的维护和社区支持
- 原生支持 EIP-1559 交易类型

### Q2: 如何处理前端状态与链上状态的一致性？

**答**: 采用了多种策略：
1. **交易确认后刷新**：每次交易完成后调用 `onRefresh()` 更新数据
2. **事件监听**：监听合约的 Supplied/Withdrawn 等事件
3. **区块轮询**：定期查询合约状态
4. **账户变化监听**：监听 MetaMask 的 accountsChanged 和 chainChanged 事件

### Q3: 如何保证数值精度？

**答**:
1. **BigInt**：所有金额使用 BigInt 类型，避免 JavaScript 浮点数精度问题
2. **parseUnits/formatUnits**：使用 ethers.js 的工具函数进行单位转换
3. **链上计算**：复杂计算（如健康因子）在合约中完成

### Q4: 安全方面有哪些考虑？

**答**:
1. **输入验证**：所有用户输入都进行验证
2. **余额检查**：操作前检查余额是否充足
3. **授权管理**：只授权必要的金额
4. **健康因子检查**：取款前检查是否会导致仓位不健康
5. **交易状态**：显示交易状态，防止用户重复提交

### Q5: 如果要部署到测试网，需要做哪些修改？

**答**:
1. 更新 `hardhat.config.js` 中的网络配置（添加 Sepolia 测试网）
2. 设置环境变量存储私钥和 RPC URL
3. 更新 `deployment.json` 中的网络信息
4. 前端添加网络检测，提示用户切换到正确的网络

### Q6: 前端如何处理大量数据的性能问题？

**答**:
1. **按需获取**：只在需要时获取数据
2. **缓存机制**：使用 React 的 useMemo 和 useCallback
3. **状态管理**：使用 React Hooks 而非大型状态管理库，减少重渲染
4. **懒加载**：组件按需加载

---

## 7. 技术决策说明

### 7.1 为什么使用 React 而非 Vue？

**答**:
1. 个人更熟悉 React 生态系统
2. ethers.js 与 React 有良好的集成实践
3. React Hooks 提供了清晰的状态管理方式
4. 大型 DeFi 项目（如 Uniswap）使用 React，有更多参考

### 7.2 为什么使用 Tailwind CSS？

**答**:
1. 快速开发：无需编写自定义 CSS
2. 响应式设计：内置响应式工具类
3. 一致性：设计系统统一
4. 可维护性：样式与组件结构紧密相关

### 7.3 为什么没有使用 Redux/Zustand？

**答**:
1. 项目规模适中，React Hooks 足够
2. 减少依赖复杂度
3. 使用 Context API 和自定义 Hooks 可以很好地管理状态
4. 更符合现代 React 开发模式

### 7.4 合约中为什么没有实现复利？

**答**:
1. 这是测试项目，需要聚焦核心功能
2. 简化利率模型，便于测试和演示
3. 真实的 DeFi 协议会使用指数利率或区块累积的利率指数

---

## 8. 未来改进方向

如果时间允许，我会添加以下功能：

1. **多币种支持**：支持多种抵押资产
2. **价格预言机**：集成 Chainlink 价格源
3. **清算功能**：实现仓位清算机制
4. **历史记录**：显示用户的历史交易记录
5. **多语言支持**：添加国际化
6. **单元测试**：增加前端组件单元测试
7. **E2E 测试**：使用 Cypress 进行端到端测试

---

## 9. 总结

这个项目展示了我在以下方面的能力：

- ✅ Solidity 智能合约理解与集成
- ✅ React + TypeScript 前端开发
- ✅ ethers.js v6 Web3 库使用
- ✅ DeFi 协议核心概念理解
- ✅ 安全编码实践
- ✅ 用户体验设计

感谢您的时间和考虑！

---

**Zhigang Li**
Web3 Full Stack Developer
Email: lizhigang@example.com
