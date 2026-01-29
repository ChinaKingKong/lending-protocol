import { useWallet } from "../hooks/useWallet";
import { useLanguage } from "../contexts/LanguageContext";

export function Header() {
  const { wallet, isConnecting, connect, disconnect } = useWallet();
  const { lang, setLang, t } = useLanguage();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const networkLabel =
    wallet.chainId === 31337
      ? t("header.hardhatNetwork")
      : wallet.chainId
        ? t("header.chainId", { id: String(wallet.chainId) })
        : t("header.notConnected");

  return (
    <header className="flex-shrink-0 z-50 glass border-b border-white/10">
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-4">
              <img src="/logo.svg" alt={t("header.logoAlt")} className="h-12 w-auto" />
            </a>
            <div>
              <h1 className="text-xl font-bold gradient-text">{t("header.title")}</h1>
              <p className="text-xs text-white/50 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                {networkLabel}
              </p>
            </div>
          </div>

          {/* Wallet + Language */}
          <div className="flex items-center gap-4">
            {/* Language switcher */}
            <div className="flex items-center rounded-xl overflow-hidden border border-white/10 bg-white/5">
              <button
                onClick={() => setLang("en")}
                className={`px-3 py-2 text-sm font-medium transition-all ${
                  lang === "en"
                    ? "bg-purple-500/30 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {t("lang.en")}
              </button>
              <button
                onClick={() => setLang("zh")}
                className={`px-3 py-2 text-sm font-medium transition-all ${
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
                    {t("header.disconnect")}
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
                {isConnecting ? t("header.connecting") : t("header.connectWallet")}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
