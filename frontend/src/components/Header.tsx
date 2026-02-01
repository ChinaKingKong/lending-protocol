import { useWallet } from "../hooks/useWallet";
import { useLanguage } from "../contexts/LanguageContext";
import { formatUnits } from "ethers";

export function Header() {
  const { wallet, isConnecting, connect, disconnect } = useWallet();
  const { lang, setLang, t } = useLanguage();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const networkLabel = wallet.chainId === 31337
      ? t("header.hardhatNetwork")
      : wallet.chainId
        ? t("header.chainId", { id: String(wallet.chainId) })
        : t("header.notConnected");

  return (
    <header className="flex-shrink-0 z-50 glass border-b border-white/10">
      <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="flex flex-wrap justify-between items-center gap-3 sm:gap-4">
          {/* Logo + Title */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-shrink-0">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = "";
              }}
              className="flex items-center gap-2 sm:gap-4 flex-shrink-0"
            >
              <img src="/logo.svg" alt={t("header.logoAlt")} className="h-9 sm:h-12 w-auto" />
            </a>
            <div className="min-w-0 max-w-[140px] sm:max-w-none">
              <h1 className="text-base sm:text-xl font-bold gradient-text truncate">{t("header.title")}</h1>
              <p className="text-xs text-white/50 flex items-center gap-2 truncate">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse flex-shrink-0"></span>
                <span className="truncate">{networkLabel}</span>
              </p>
            </div>
          </div>

          {/* Block Explorer + Language + Wallet */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 flex-shrink-0">
            {wallet.chainId === 31337 && (
              <a
                href="#explorer"
                className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
              >
                {t("header.blockExplorer")}
              </a>
            )}
            {/* Language switcher */}
            <div className="flex rounded-lg sm:rounded-xl overflow-hidden border border-white/10 bg-white/5">
              <button
                onClick={() => setLang("en")}
                className={`px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all ${
                  lang === "en"
                    ? "bg-purple-500/30 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {t("lang.en")}
              </button>
              <button
                onClick={() => setLang("zh")}
                className={`px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all ${
                  lang === "zh"
                    ? "bg-purple-500/30 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {t("lang.zh")}
              </button>
            </div>

            {wallet.isConnected ? (
              <>
                <div className="hidden sm:block text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-white">{formatAddress(wallet.address!)}</p>
                  <p className="text-xs text-white/50">
                    {parseFloat(formatUnits(wallet.balance || 0n, 18)).toFixed(2)} ETH
                  </p>
                </div>
                <div className="hidden sm:block h-8 sm:h-10 w-px bg-white/10 flex-shrink-0"></div>
                <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 flex-shrink-0">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <button
                    onClick={disconnect}
                    className="text-xs sm:text-sm text-white/70 hover:text-white transition-colors whitespace-nowrap"
                  >
                    {t("header.disconnect")}
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="btn-primary flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {isConnecting ? t("header.connecting") : t("header.connectWallet")}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
