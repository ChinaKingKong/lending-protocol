import React, { useState } from "react";
import { parseUnits, Contract } from "ethers";
import { useApproval } from "../hooks/useApproval";
import { useLendingProtocol, DEPLOYMENT } from "../hooks/useContract";

interface SupplyProps {
  signer: any;
  address: string | null;
  balances: { usd8: string };
  onRefresh: () => void;
}

export function Supply({ signer, address, balances, onRefresh }: SupplyProps) {
  const [amount, setAmount] = useState("");
  const [isSupplying, setIsSupplying] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { allowance, isApproved, isApproving, approve } = useApproval(
    signer,
    address,
    DEPLOYMENT.contracts.SimpleLending,
    DEPLOYMENT.contracts.USD8
  );

  const handleMax = () => {
    setAmount(balances.usd8);
  };

  const handleApprove = async () => {
    try {
      setError(null);
      await approve();
    } catch (err: any) {
      setError(err.message || "Approval failed");
    }
  };

  const handleSupply = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (parseFloat(amount) > parseFloat(balances.usd8)) {
      setError("Insufficient balance");
      return;
    }

    setIsSupplying();
    setError(null);
    setTxHash(null);

    try {
      const contract: Contract = useLendingProtocol(signer);
      if (!contract) {
        throw new Error("Contract not connected");
      }

      const amountToSupply = parseUnits(amount, 18);
      const tx = await contract.supply(amountToSupply);
      setTxHash(tx.hash);

      await tx.wait();

      setAmount("");
      onRefresh();
    } catch (err: any) {
      console.error("Supply failed:", err);
      setError(err.message || "Supply failed");
      setTxHash(null);
    } finally {
      setIsSupplying(false);
    }
  };

  return (
    <div className="glass-card relative overflow-hidden">
      {/* Gradient decoration */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>

      {/* Header */}
      <div className="relative flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Supply Assets</h3>
          <p className="text-xs text-white/50">Earn interest on your deposits</p>
        </div>
        <div className="ml-auto px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-semibold">
          Supply APY: ~2%
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
              disabled={isSupplying || isApproving}
            />
            <button
              onClick={handleMax}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              disabled={isSupplying || isApproving}
            >
              MAX
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-white/30 text-xs">
            Balance:{" "}
            <span className="text-white/70">
              {parseFloat(balances.usd8).toLocaleString("en-US", { maximumFractionDigits: 4 })} USD8
            </span>
          </p>
        </div>
      </div>

      {/* Action Button */}
      {!isApproved ? (
        <button
          onClick={handleApprove}
          disabled={isApproving || !amount}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          {isApproving ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Approving...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Approve USD8
            </>
          )}
        </button>
      ) : (
        <button
          onClick={handleSupply}
          disabled={isSupplying || !amount}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          {isSupplying ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Supplying...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
              Supply {amount && `${amount} USD8`}
            </>
          )}
        </button>
      )}

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

      {isApproved && (
        <div className="mt-4 flex items-center gap-2 text-emerald-400 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Approved: {parseFloat(allowance).toLocaleString()} USD8
        </div>
      )}
    </div>
  );
}
