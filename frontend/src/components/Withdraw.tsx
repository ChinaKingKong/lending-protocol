import React, { useState } from "react";
import { parseUnits, Contract } from "ethers";
import { useUserPosition } from "../hooks/useLendingProtocol";
import { useLendingProtocol } from "../hooks/useContract";

interface WithdrawProps {
  signer: any;
  address: string | null;
  onRefresh: () => void;
}

export function Withdraw({ signer, address, onRefresh }: WithdrawProps) {
  const [amount, setAmount] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { maxWithdraw, position } = useUserPosition(null, signer, address);

  const handleMax = () => {
    setAmount(maxWithdraw);
  };

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    const max = parseFloat(maxWithdraw);
    if (parseFloat(amount) > max) {
      setError(`Maximum withdrawable is ${max.toFixed(2)} USD8`);
      return;
    }

    setIsWithdrawing();
    setError(null);
    setTxHash(null);

    try {
      const contract: Contract = useLendingProtocol(signer);
      if (!contract) {
        throw new Error("Contract not connected");
      }

      const amountToWithdraw = parseUnits(amount, 18);
      const tx = await contract.withdraw(amountToWithdraw);
      setTxHash(tx.hash);

      await tx.wait();

      setAmount("");
      onRefresh();
    } catch (err: any) {
      console.error("Withdraw failed:", err);
      setError(err.message || "Withdraw failed");
      setTxHash(null);
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="glass-card relative overflow-hidden">
      {/* Gradient decoration */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>

      {/* Header */}
      <div className="relative flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Withdraw Assets</h3>
          <p className="text-xs text-white/50">Remove your deposited tokens</p>
        </div>
      </div>

      {/* Input Section */}
      <div className="relative mb-6">
        <label className="text-white/50 text-sm mb-2 block">Amount (USD8)</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="input-field pr-20"
              disabled={isWithdrawing}
            />
            <button
              onClick={handleMax}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              disabled={isWithdrawing}
            >
              MAX
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-white/30 text-xs">
            Supplied:{" "}
            <span className="text-white/70">
              {position ? (Number(position.supplied) / 1e18).toFixed(2) : "0.00"} USD8
            </span>
          </p>
          <p className="text-blue-400 text-xs">
            Available: {parseFloat(maxWithdraw).toLocaleString("en-US", { maximumFractionDigits: 2 })} USD8
          </p>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleWithdraw}
        disabled={isWithdrawing || !amount}
        className="w-full btn-primary flex items-center justify-center gap-2"
      >
        {isWithdrawing ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Withdrawing...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
            Withdraw {amount && `${amount} USD8`}
          </>
        )}
      </button>

      {/* Status Messages */}
      {error && (
        <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-2">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {txHash && (
        <div className="mt-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm flex items-start gap-2">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="font-medium">Transaction submitted</p>
            <p className="text-white/50 text-xs mt-1 break-all">
              {txHash.slice(0, 12)}...{txHash.slice(-10)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
