# DeFi Lending Protocol Dashboard

PQA Labs Coding Test - Web3 Full Stack Developer Role

A complete DeFi lending protocol with a React/TypeScript frontend, Solidity smart contracts, and ethers.js v6 integration.

## Features

### Smart Contracts
- **TestToken**: ERC20-like token for testing (USD8 stablecoin and WETH)
- **SimpleLending**: Lending protocol with supply, borrow, withdraw, and repay functionality
- Interest rates based on utilization curve
- 75% LTV (Loan-to-Value) ratio
- Health factor calculation for position safety

### Frontend
- MetaMask wallet connection
- Network switching to Hardhat local network
- Real-time balance updates
- Pool information display (total supply, borrow, utilization, rates)
- User position tracking with health factor
- Supply/Withdraw/Borrow/Repay operations
- Approval flow for ERC20 tokens
- Transaction status display
- Loading states and error handling

## Tech Stack

- **Smart Contracts**: Solidity 0.8.19, Hardhat
- **Frontend**: React 19, TypeScript, Vite
- **Web3 Library**: ethers.js v6
- **Styling**: Tailwind CSS
- **State Management**: React Hooks

## Setup Instructions

### Prerequisites
- Node.js (v20 LTS recommended, v25 may have compatibility issues)
- npm or yarn
- MetaMask browser extension

### 1. Install Dependencies

```bash
# Install root dependencies (Hardhat, ethers, etc.)
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Compile Contracts

```bash
npx hardhat compile
```

### 3. Deploy Contracts to Local Network

In one terminal, start the Hardhat local node:
```bash
npx hardhat node
```

In another terminal, deploy the contracts:
```bash
npx hardhat run scripts/deploy.ts --network localhost
```

This will:
- Deploy USD8 and WETH test tokens
- Deploy the SimpleLending protocol
- Seed test accounts with 10,000 tokens each
- Export ABIs and deployment info to `frontend/src/`

### 4. Start the Frontend

```bash
cd frontend
npm run dev
```

The dashboard will be available at `http://localhost:5173`

### 5. Connect MetaMask

1. Open MetaMask and add a custom network:
   - Network Name: Hardhat Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency Symbol: ETH

2. Import a test account (use one of the accounts shown when you started `hardhat node`):
   ```
   Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```
   This is Account #0 with 10,000 ETH.

## Contract Addresses (Local Deployment)

After deployment, check `frontend/src/deployment.json` for actual addresses. Default placeholder addresses:
- USD8: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- WETH: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
- SimpleLending: `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`

## Technical Decisions

### Architecture
- **Contract-First Design**: Smart contracts define the core logic
- **Type Safety**: TypeScript throughout for better developer experience
- **Separation of Concerns**: Hooks for state management, components for UI
- **Real-time Updates**: Contract event listeners for live state updates

### Security Considerations
- Input validation on all user inputs
- BigNumber handling for precise calculations
- Health factor checks before withdrawals
- Approval flow for ERC20 operations
- Transaction status tracking for better UX

### Error Handling
- Try-catch blocks for all async operations
- User-friendly error messages
- Loading states for better UX
- Transaction receipts for confirmation

## Project Structure

```
lending-protocol/
├── contracts/
│   ├── TestToken.sol          # ERC20-like test token
│   └── SimpleLending.sol      # Lending protocol contract
├── scripts/
│   ├── deploy.ts              # Deployment script
│   └── seed.ts                # Token seeding script
├── test/
│   └── SimpleLending.test.ts  # Integration tests
├── frontend/
│   ├── src/
│   │   ├── abis/              # Contract ABIs
│   │   ├── components/        # React components
│   │   ├── hooks/             # Custom hooks
│   │   ├── types/             # TypeScript types
│   │   ├── App.tsx            # Main app component
│   │   └── main.tsx           # Entry point
│   └── package.json
├── hardhat.config.js          # Hardhat configuration
├── package.json
└── README.md
```

## Testing

Run integration tests:
```bash
npx hardhat test
```

## Screenshots

The dashboard includes:
- Wallet connection with network switching
- Pool information with utilization rates
- User position with health factor
- Supply/Withdraw/Borrow/Repay actions 

## Author

Zhigang Li - PQA Labs Coding Test Submission
