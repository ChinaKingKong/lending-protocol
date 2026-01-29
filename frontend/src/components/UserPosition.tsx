import React from "react";
import { useUserPosition } from "../hooks/useLendingProtocol";
import type { BrowserProvider, JsonRpcSigner } from "ethers";

interface UserPositionProps {
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  address: string | null;
}

export function UserPosition({ provider, signer, address }: UserPositionProps) {
  const { position, maxWithdraw, maxBorrow, isLoading } = useUserPosition(provider, signer, address);

  if (isLoading) {
    return (
      <div className="glass-card animate-pulse">
        <div className="h-6 bg-white/10 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white/5 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!position) {
    return (
      <div className="glass-card text-center py-12">
        <svg className="w-20 h-20 mx-auto mb-4 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <p className="text-white/50">Connect wallet to view your position</p>
      </div>
    );
  }

  const supplied = Number(position.supplied) / 1e18;
  const borrowed = Number(position.borrowed) / 1e18;
  const healthFactor = position.healthFactor === BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF") ?
    "Infinity" : (Number(position.healthFactor) / 100).toFixed(2);

  const getHealthConfig = (hf: string) => {
    if (hf === "Infinity") {
      return {
        color: "emerald",
        text: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
        label: "Safe",
        icon: "shield-check"
      };
    }
    const numHf = Number(hf);
    if (numHf > 150) {
      return {
        color: "emerald",
        text: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
        label: "Safe",
        icon: "shield-check"
      };
    } else if (numHf > 100) {
      return {
        color: "yellow",
        text: "text-yellow-400",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/30",
        label: "Moderate",
        icon: "exclamation-triangle"
      };
    } else {
      return {
        color: "red",
        text: "text-red-400",
        bg: "bg-red-500/10",
        border: "border-red-500/30",
        label: "At Risk",
        icon: "exclamation-circle"
      };
    }
  };

  const healthConfig = getHealthConfig(healthFactor);

  const icons = {
    "shield-check": (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    ),
    "exclamation-triangle": (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    ),
    "exclamation-circle": (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    )
  };

  const positionStats = [
    {
      label: "Supplied",
      value: supplied.toLocaleString("en-US", { maximumFractionDigits: 2 }),
      unit: "USD8",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Borrowed",
      value: borrowed.toLocaleString("en-US", { maximumFractionDigits: 2 }),
      unit: "USD8",
      color: "text-red-400",
      bg: "bg-red-500/10",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      ),
    },
  ];

  return (
    <div className="glass-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${healthConfig.bg}`}>
            <svg className={`w-5 h-5 ${healthConfig.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Your Position</h2>
            <p className="text-xs text-white/50">Account overview and status</p>
          </div>
        </div>

        {/* Health Factor Badge */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${healthConfig.bg} ${healthConfig.border} border`}>
          <svg className={`w-4 h-4 ${healthConfig.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {icons[healthConfig.icon as keyof typeof icons]}
          </svg>
          <div>
            <p className="text-xs text-white/50">Health Factor</p>
            <p className={`text-lg font-bold ${healthConfig.text}`}>{healthFactor}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {positionStats.map((stat, index) => (
          <div key={index} className="relative overflow-hidden rounded-xl bg-white/5 border border-white/10 p-5 group hover:border-white/20 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full"></div>
            <div className="relative">
              <div className={`inline-flex p-2 rounded-lg ${stat.bg} ${stat.color} mb-3`}>
                {stat.icon}
              </div>
              <p className="text-white/50 text-xs mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-white/30 text-xs mt-1">{stat.unit}</p>
            </div>
          </div>
        ))}

        {/* Max Withdraw */}
        <div className="relative overflow-hidden rounded-xl bg-white/5 border border-white/10 p-5 group hover:border-white/20 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full"></div>
          <div className="relative">
            <div className="inline-flex p-2 rounded-lg bg-blue-500/10 text-blue-400 mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-white/50 text-xs mb-1">Max Withdraw</p>
            <p className="text-xl font-bold text-blue-400">
              {parseFloat(maxWithdraw).toLocaleString("en-US", { maximumFractionDigits: 2 })}
            </p>
            <p className="text-white/30 text-xs mt-1">USD8 available</p>
          </div>
        </div>

        {/* Max Borrow */}
        <div className="relative overflow-hidden rounded-xl bg-white/5 border border-white/10 p-5 group hover:border-white/20 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full"></div>
          <div className="relative">
            <div className="inline-flex p-2 rounded-lg bg-purple-500/10 text-purple-400 mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <p className="text-white/50 text-xs mb-1">Max Borrow</p>
            <p className="text-xl font-bold text-purple-400">
              {parseFloat(maxBorrow).toLocaleString("en-US", { maximumFractionDigits: 2 })}
            </p>
            <p className="text-white/30 text-xs mt-1">USD0 available</p>
          </div>
        </div>
      </div>

      {/* Health Factor Progress Bar */}
      {healthFactor !== "Infinity" && (
        <div className="mt-6 p-4 rounded-xl bg-white/5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-white/70">Health Factor Progress</span>
            <span className={`text-sm font-semibold ${healthConfig.text}`}>{healthConfig.label}</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                Number(healthFactor) > 150 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                Number(healthFactor) > 100 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                'bg-gradient-to-r from-red-500 to-red-400'
              }`}
              style={{ width: `${Math.min(Number(healthFactor), 200) / 2}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-white/30">
            <span>Risk</span>
            <span>Safe</span>
          </div>
        </div>
      )}
    </div>
  );
}
