import { useState, useCallback } from "react";
import { Header } from "./components/Header";
import { PoolInfo } from "./components/PoolInfo";
import { UserPosition } from "./components/UserPosition";
import { Supply } from "./components/Supply";
import { Withdraw } from "./components/Withdraw";
import { Borrow } from "./components/Borrow";
import { Repay } from "./components/Repay";
import { useWallet } from "./hooks/useWallet";
import { usePoolInfo, useUserPosition } from "./hooks/useLendingProtocol";
import { useTokenBalance } from "./hooks/useTokenBalance";
import { useLanguage } from "./contexts/LanguageContext";

function App() {
  const { wallet, signer, provider } = useWallet();
  const { t, lang, isAnimating } = useLanguage();
  const [refreshCounter, setRefreshCounter] = useState(0);

  const { balances } = useTokenBalance(provider, wallet.address);
  const { poolInfo } = usePoolInfo(provider);
  const { position } = useUserPosition(provider, signer, wallet.address);

  const handleRefresh = useCallback(() => {
    setRefreshCounter((prev) => prev + 1);
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
      </div>

      <Header />

      {/* Only this area scrolls; language switch transition */}
      <div className="flex-1 min-h-0 overflow-auto">
        <div
          key={lang}
          className={`h-full min-h-full ${isAnimating ? "lang-transition-out" : "lang-transition-in"}`}
        >
      {/* Hero Section */}
      <section className="relative pt-16 pb-12 px-4 md:px-6">
        <div className="w-full max-w-[1920px] mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="text-white/70 text-sm">{t("hero.poweredBy")}</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="gradient-text">{t("hero.title")}</span>
          </h1>

          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-8">
            {t("hero.subtitle")}
          </p>

          {/* Quick Stats */}
          {poolInfo && (
            <div className="flex flex-wrap justify-center gap-6">
              <div className="glass-card px-6 py-3 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-white/50 text-xs">{t("hero.supplyApy")}</p>
                  <p className="text-emerald-400 font-bold">{Number(poolInfo.supplyRate).toFixed(2)}%</p>
                </div>
              </div>
              <div className="glass-card px-6 py-3 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-white/50 text-xs">{t("hero.borrowApy")}</p>
                  <p className="text-orange-400 font-bold">{Number(poolInfo.borrowRate).toFixed(2)}%</p>
                </div>
              </div>
              <div className="glass-card px-6 py-3 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-white/50 text-xs">{t("hero.collateral")}</p>
                  <p className="text-purple-400 font-bold">75% LTV</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <main className="w-full max-w-[1920px] mx-auto px-4 md:px-6 pb-20">
        <div className="space-y-8">
          {/* Connection Warning */}
          {!wallet.isConnected && (
            <div className="glass-card text-center py-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
              <div className="relative">
                <svg className="w-20 h-20 mx-auto mb-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-xl font-bold text-white mb-2">{t("connect.title")}</h3>
                <p className="text-white/50 max-w-md mx-auto">
                  {t("connect.desc")}
                </p>
              </div>
            </div>
          )}

          {/* Pool Information */}
          <PoolInfo provider={provider} />

          {/* User Position */}
          <UserPosition provider={provider} signer={signer} address={wallet.address} />

          {/* Action Cards */}
          {wallet.isConnected && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Supply
                  signer={signer}
                  address={wallet.address}
                  balances={balances}
                  onRefresh={handleRefresh}
                />
                <Withdraw
                  signer={signer}
                  address={wallet.address}
                  onRefresh={handleRefresh}
                />
                <Borrow
                  signer={signer}
                  address={wallet.address}
                  onRefresh={handleRefresh}
                />
                <Repay
                  signer={signer}
                  address={wallet.address}
                  provider={provider}
                  onRefresh={handleRefresh}
                />
              </div>

              {/* Protocol Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-white">{t("feature.supplyEarn.title")}</h4>
                  </div>
                  <p className="text-white/50 text-sm">
                    {t("feature.supplyEarn.desc")}
                  </p>
                </div>

                <div className="glass-card group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-white">{t("feature.borrow.title")}</h4>
                  </div>
                  <p className="text-white/50 text-sm">
                    {t("feature.borrow.desc")}
                  </p>
                </div>

                <div className="glass-card group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-white">{t("feature.repay.title")}</h4>
                  </div>
                  <p className="text-white/50 text-sm">
                    {t("feature.repay.desc")}
                  </p>
                </div>
              </div>

              {/* Health Factor Info Card */}
              <div className="glass-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-xl ${
                    !position || position.healthFactor === BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")
                      ? "bg-emerald-500/20 text-emerald-400"
                      : Number(position.healthFactor) / 100 > 150
                      ? "bg-emerald-500/20 text-emerald-400"
                      : Number(position.healthFactor) / 100 > 100
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
                  }`}>
                    {(!position || position.healthFactor === BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")) ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{t("health.title")}</h4>
                    <p className="text-white/50 text-xs">
                      {t("health.desc")}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-white/70">{t("health.safe")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    <span className="text-white/70">{t("health.moderate")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span className="text-white/70">{t("health.risk")}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20 py-8">
        <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold">{t("footer.title")}</p>
                <p className="text-white/40 text-xs">{t("footer.subtitle")}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-white/40">
              <span>{t("footer.builtWith")}</span>
              <span className="text-white/60 hover:text-white transition-colors">React 19</span>
              <span className="text-white/60 hover:text-white transition-colors">TypeScript</span>
              <span className="text-white/60 hover:text-white transition-colors">ethers.js v6</span>
              <span className="text-white/60 hover:text-white transition-colors">Tailwind CSS</span>
            </div>
          </div>
        </div>
      </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
