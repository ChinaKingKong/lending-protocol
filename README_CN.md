# DeFi 借贷协议仪表板

PQA Labs 编程测试 - Web3 全栈开发工程师岗位

一个完整的 DeFi 借贷协议，包含 React/TypeScript 前端、Solidity 智能合约和 ethers.js v6 集成。

## 功能特性

### 智能合约
- **TestToken**：用于测试的 ERC20 代币（USD8 稳定币和 WETH）
- **SimpleLending**：借贷协议，支持供应、借款、取款和还款功能
- 基于利用率曲线的利率模型
- 75% LTV（抵押借贷比）
- 健康因子计算保障仓位安全

### 前端功能
- MetaMask 钱包连接
- 自动切换到 Hardhat 本地网络
- 实时余额更新
- 借贷池信息展示（总供应量、总借款量、利用率、利率）
- 用户仓位追踪与健康因子显示
- 供应/取款/借款/还款操作
- ERC20 代币授权流程
- 交易状态显示
- 加载状态和错误处理

## 技术栈

- **智能合约**：Solidity 0.8.19, Hardhat
- **前端**：React 19, TypeScript, Vite
- **Web3 库**：ethers.js v6
- **样式**：Tailwind CSS
- **状态管理**：React Hooks

## 安装说明

### 前置要求
- Node.js（推荐 v20 LTS，v25 可能存在兼容性问题）
- npm 或 yarn
- MetaMask 浏览器扩展

### 1. 安装依赖

```bash
# 安装根目录依赖（Hardhat、ethers 等）
npm install

# 安装前端依赖
cd frontend
npm install
cd ..
```

### 2. 编译合约

```bash
npx hardhat compile
```

### 3. 部署合约到本地网络

在一个终端中启动 Hardhat 本地节点：
```bash
npx hardhat node
```

在另一个终端中部署合约：
```bash
npx hardhat run scripts/deploy.ts --network localhost
```

这将：
- 部署 USD8 和 WETH 测试代币
- 部署 SimpleLending 借贷协议
- 为每个测试账户分发 10,000 个代币
- 将 ABI 和部署信息导出到 `frontend/src/`

### 4. 启动前端

```bash
cd frontend
npm run dev
```

仪表板将在 `http://localhost:5173` 上运行

### 5. 连接 MetaMask

1. 打开 MetaMask 并添加自定义网络：
   - 网络名称：Hardhat Local
   - RPC URL：http://127.0.0.1:8545
   - 链 ID：31337
   - 货币符号：ETH

2. 导入测试账户（使用启动 `hardhat node` 时显示的账户之一）：
   ```
   私钥：0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```
   这是账户 #0，拥有 10,000 ETH。

## 合约地址（本地部署）

部署后，请查看 `frontend/src/deployment.json` 获取实际地址。默认占位地址：
- USD8：`0x5FbDB2315678afecb367f032d93F642f64180aa3`
- WETH：`0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
- SimpleLending：`0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`

## 技术决策

### 架构设计
- **合约优先设计**：智能合约定义核心业务逻辑
- **类型安全**：全程使用 TypeScript 提升开发体验
- **关注点分离**：Hooks 管理状态，Components 负责 UI
- **实时更新**：通过合约事件监听实现状态实时更新

### 安全考虑
- 所有用户输入进行验证
- 使用 BigNumber 处理精确计算
- 取款前检查健康因子
- ERC20 操作的授权流程
- 交易状态追踪提升用户体验

### 错误处理
- 所有异步操作使用 try-catch 包裹
- 用户友好的错误提示信息
- 加载状态提升用户体验
- 交易收据确认机制

## 项目结构

```
lending-protocol/
├── contracts/
│   ├── TestToken.sol          # ERC20 测试代币
│   └── SimpleLending.sol      # 借贷协议合约
├── scripts/
│   ├── deploy.ts              # 部署脚本
│   └── seed.ts                # 代币分发脚本
├── test/
│   └── SimpleLending.test.ts  # 集成测试
├── frontend/
│   ├── src/
│   │   ├── abis/              # 合约 ABI
│   │   ├── components/        # React 组件
│   │   ├── hooks/             # 自定义 Hooks
│   │   ├── types/             # TypeScript 类型定义
│   │   ├── App.tsx            # 主应用组件
│   │   └── main.tsx           # 入口文件
│   └── package.json
├── hardhat.config.js          # Hardhat 配置
├── package.json
└── README.md
```

## 测试

运行集成测试：
```bash
npx hardhat test
```

## 界面预览

仪表板包含以下功能：
- 带网络切换的钱包连接
- 借贷池信息与利用率
- 用户仓位与健康因子
- 供应/取款/借款/还款操作面板 

## 作者

Zhigang Li - PQA Labs 编程测试提交
