import React from "react";
import { usePoolInfo } from "../hooks/useLendingProtocol";
import type { BrowserProvider } from "ethers";

interface PoolInfoProps {
  provider: BrowserProvider | null;
}

export function PoolInfo({ provider }: PoolInfoProps) {
  const { poolInfo, isLoading } = usePoolInfo(provider);

  if (isLoading) {
    return (
      <div className="glass-card animate-pulse">
        <div className="h-6 bg-white/10 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-28 bg-white/5 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!poolInfo) {
    return (
      <div className="glass-card text-center">
        <svg className="w-16 h-16 mx-auto mb-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <p className="text-white/50">Connect wallet to view pool information</p>
      </div>
    );
  }

  const utilizationRate = Number(poolInfo.utilizationRate);
  const totalSupplyValue = Number(poolInfo.totalSupply) / 1e18;
  const totalBorrowValue = Number(poolInfo.totalBorrow) / 1e18;

  const utilizationConfig = utilizationRate < 50
    ? { color: "emerald", text: "text-emerald-400", bg: "bg-emerald-500", track: "bg-emerald-500/20" }
    : utilizationRate < 80
    ? { color: "yellow", text: "text-yellow-400", bg: "bg-yellow-500", track: "bg-yellow-500/20" }
    : { color: "red", text: "text-red-400", bg: "bg-red-500", track: "bg-red-500/20" };

  const stats = [
    {
      label: "Total Supply",
      value: totalSupplyValue.toLocaleString("en-US", { maximumFractionDigits: 2 }),
      unit: "USD8",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
        </svg>
      ),
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Total Borrowed",
      value: totalBorrowValue.toLocaleString("en-US", { maximumFractionDigits: 2 }),
      unit: "USD8",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
        </svg>
      ),
      color: "text-red-400",
      bgColor: "bg-red-500/10",
    },
    {
      label: "Utilization Rate",
      value: `${utilizationRate.toFixed(2)}%`,
      unit: "",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: utilizationConfig.text,
      bgColor: `${utilizationConfig.color}-500/10`,
      isProgress: true,
    },
    {
      label: "Supply APY",
      value: `${Number(poolInfo.supplyRate).toFixed(2)}%`,
      unit: "Per Year",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Borrow APY",
      value: `${Number(poolInfo.borrowRate).toFixed(2)}%`,
      unit: "Per Year",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      ),
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="glass-card">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-xl ${utilizationConfig.bgColor}`}>
          <svg className="w-5 h-5 ${utilizationConfig.color}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Pool Information</h2>
          <p className="text-xs text-white/50">Real-time market data</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card group">
            <div className="relative z-10">
              <div className={`inline-flex p-2 rounded-lg ${stat.bgColor} ${stat.color} mb-3 group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <p className="text-white/50 text-xs mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
              {stat.unit && <p className="text-white/30 text-xs mt-1">{stat.unit}</p>}

              {stat.isProgress && (
                <div className="mt-3">
                  <div className={`h-1.5 ${stat.track} rounded-full overflow-hidden`}>
                    <div
                      className={`h-full ${stat.bgColor} ${stat.color} transition-all duration-500`}
                      style={{ width: `${Math.min(utilizationRate, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
