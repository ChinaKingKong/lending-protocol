import React from "react";
import { useWallet } from "../hooks/useWallet";

export function Header() {
  const { wallet, isConnecting, connect, disconnect } = useWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/10">
      <div className="container mx-auto px-3 sm:px-4 lg:px-5 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-4">
              <img src="/logo.svg" alt="Lending Protocol" className="h-12 w-auto" />
            </a>
            <div>
              <h1 className="text-xl font-bold gradient-text">Lending Protocol</h1>
              <p className="text-xs text-white/50 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                {wallet.chainId === 31337 ? "Hardhat Local Network" : wallet.chainId ? `Chain ID: ${wallet.chainId}` : "Not Connected"}
              </p>
            </div>
          </div>

          {/* Wallet Section */}
          <div className="flex items-center gap-4">
            {wallet.isConnected ? (
              <>
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-white">{formatAddress(wallet.address!)}</p>
                  <p className="text-xs text-white/50">
                    {parseFloat(wallet.balance.toString() || "0").toFixed(4)} ETH
                  </p>
                </div>
                <div className="h-10 w-px bg-white/10"></div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <button
                    onClick={disconnect}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="btn-primary flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
