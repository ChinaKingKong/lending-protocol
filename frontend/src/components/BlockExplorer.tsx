import React, { useEffect, useCallback } from "react";
import { useWallet } from "../hooks/useWallet";
import { useBlockExplorer } from "../hooks/useBlockExplorer";
import { useLanguage } from "../contexts/LanguageContext";
import { formatUnits } from "ethers";

const HASH_PREFIX = "#explorer";
const BLOCK_PREFIX = "#block/";
const TX_PREFIX = "#tx/";

function useExplorerHash() {
  const [hash, setHashState] = React.useState(() => window.location.hash);
  useEffect(() => {
    const onHashChange = () => setHashState(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  const setHash = useCallback((h: string) => {
    window.location.hash = h;
    setHashState(h);
  }, []);
  return [hash, setHash] as const;
}

export function BlockExplorer() {
  const { provider } = useWallet();
  const { t } = useLanguage();
  const [hash, setHash] = useExplorerHash();
  const {
    blocks,
    blockDetail,
    txDetail,
    isLoadingBlocks,
    isLoadingBlock,
    isLoadingTx,
    error,
    fetchBlocks,
    fetchBlockByNumber,
    fetchTxByHash,
  } = useBlockExplorer(provider);

  const isList = hash === HASH_PREFIX || hash.startsWith(HASH_PREFIX + "/");
  const blockMatch = hash.startsWith(BLOCK_PREFIX) ? hash.slice(BLOCK_PREFIX.length) : null;
  const txHashParam = hash.startsWith(TX_PREFIX) ? hash.slice(TX_PREFIX.length) : null;

  useEffect(() => {
    if (!provider) return;
    if (isList) fetchBlocks();
  }, [provider, isList, fetchBlocks]);

  useEffect(() => {
    if (!provider || !blockMatch) return;
    const num = parseInt(blockMatch, 10);
    if (!Number.isNaN(num)) fetchBlockByNumber(num);
  }, [provider, blockMatch, fetchBlockByNumber]);

  useEffect(() => {
    if (!provider || !txHashParam) return;
    if (txHashParam.startsWith("0x")) fetchTxByHash(txHashParam);
  }, [provider, txHashParam, fetchTxByHash]);

  const goToList = () => setHash(HASH_PREFIX);

  if (!provider) {
    return (
      <div className="relative pt-16 pb-12 px-4 md:px-6 max-w-[1920px] mx-auto">
        <div className="glass-card text-center py-12">
          <p className="text-white/50">{t("explorer.connectFirst")}</p>
        </div>
      </div>
    );
  }

  // Block detail view
  if (blockMatch && blockDetail) {
    return (
      <div className="relative pt-16 pb-12 px-4 md:px-6 max-w-[1920px] mx-auto">
        <button
          onClick={goToList}
          className="mb-6 flex items-center gap-2 text-white/70 hover:text-white text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t("explorer.backToList")}
        </button>
        <div className="glass-card">
          <h2 className="text-xl font-bold text-white mb-6">{t("explorer.block")} #{blockDetail.number}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-white/50 text-xs mb-1">{t("explorer.blockHash")}</p>
              <p className="text-emerald-400 font-mono text-sm break-all">{blockDetail.hash}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-white/50 text-xs mb-1">{t("explorer.timestamp")}</p>
              <p className="text-white">{new Date(blockDetail.timestamp * 1000).toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-white/50 text-xs mb-1">{t("explorer.txCount")}</p>
              <p className="text-white">{blockDetail.transactionCount}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-white/50 text-xs mb-1">{t("explorer.gasUsed")}</p>
              <p className="text-white">{blockDetail.gasUsed.toString()}</p>
            </div>
          </div>
          <h3 className="text-sm font-semibold text-white/70 mb-3">{t("explorer.transactions")}</h3>
          <ul className="space-y-2">
            {blockDetail.transactions.length === 0 ? (
              <li className="text-white/50 text-sm">{t("explorer.noTransactions")}</li>
            ) : (
              blockDetail.transactions.map((txHash) => (
                <li key={txHash}>
                  <button
                    onClick={() => setHash(TX_PREFIX + txHash)}
                    className="text-emerald-400 hover:underline font-mono text-sm break-all text-left"
                  >
                    {txHash}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    );
  }

  // Transaction detail view
  if (txHashParam && txDetail) {
    return (
      <div className="relative pt-16 pb-12 px-4 md:px-6 max-w-[1920px] mx-auto">
        <button
          onClick={goToList}
          className="mb-6 flex items-center gap-2 text-white/70 hover:text-white text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t("explorer.backToList")}
        </button>
        <div className="glass-card">
          <h2 className="text-xl font-bold text-white mb-6">{t("explorer.transaction")}</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-white/50 text-xs mb-1">{t("explorer.txHash")}</p>
              <p className="text-emerald-400 font-mono text-sm break-all">{txDetail.hash}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-white/50 text-xs mb-1">{t("explorer.from")}</p>
              <p className="text-white font-mono text-sm break-all">{txDetail.from}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-white/50 text-xs mb-1">{t("explorer.to")}</p>
              <p className="text-white font-mono text-sm break-all">{txDetail.to ?? "—"}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-white/50 text-xs mb-1">{t("explorer.value")}</p>
              <p className="text-white">{formatUnits(txDetail.value, 18)} ETH</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-white/50 text-xs mb-1">{t("explorer.blockNumber")}</p>
              <p className="text-white">
                {txDetail.blockNumber != null ? (
                  <button
                    onClick={() => setHash(BLOCK_PREFIX + txDetail.blockNumber)}
                    className="text-emerald-400 hover:underline"
                  >
                    {txDetail.blockNumber}
                  </button>
                ) : (
                  "—"
                )}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-white/50 text-xs mb-1">{t("explorer.status")}</p>
              <p className={txDetail.status === 1 ? "text-emerald-400" : "text-red-400"}>
                {txDetail.status === 1 ? t("explorer.success") : txDetail.status === 0 ? t("explorer.failed") : "—"}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-white/50 text-xs mb-1">{t("explorer.gasUsed")}</p>
              <p className="text-white">{txDetail.gasUsed?.toString() ?? "—"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Block not found (error)
  if (blockMatch && !isLoadingBlock && !blockDetail && error) {
    return (
      <div className="relative pt-16 pb-12 px-4 md:px-6 max-w-[1920px] mx-auto">
        <button onClick={goToList} className="mb-6 flex items-center gap-2 text-white/70 hover:text-white text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t("explorer.backToList")}
        </button>
        <div className="glass-card py-12 text-center text-red-400">{error}</div>
      </div>
    );
  }

  // Loading for block
  if (blockMatch && isLoadingBlock) {
    return (
      <div className="relative pt-16 pb-12 px-4 md:px-6 max-w-[1920px] mx-auto">
        <button onClick={goToList} className="mb-6 flex items-center gap-2 text-white/70 hover:text-white text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t("explorer.backToList")}
        </button>
        <div className="glass-card animate-pulse py-12 text-center text-white/50">{t("explorer.loading")}</div>
      </div>
    );
  }
  if (txHashParam && (isLoadingTx || error)) {
    return (
      <div className="relative pt-16 pb-12 px-4 md:px-6 max-w-[1920px] mx-auto">
        <button onClick={goToList} className="mb-6 flex items-center gap-2 text-white/70 hover:text-white text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t("explorer.backToList")}
        </button>
        <div className="glass-card py-12 text-center">
          {error ? <p className="text-red-400">{error}</p> : <p className="text-white/50">{t("explorer.loading")}</p>}
        </div>
      </div>
    );
  }

  // Blocks list
  return (
    <div className="relative pt-16 pb-12 px-4 md:px-6 max-w-[1920px] mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">{t("explorer.title")}</h2>
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
      )}
      {isLoadingBlocks ? (
        <div className="glass-card animate-pulse py-12 text-center text-white/50">{t("explorer.loading")}</div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-3 px-4 text-white/70 text-sm font-semibold">{t("explorer.blockNumber")}</th>
                  <th className="py-3 px-4 text-white/70 text-sm font-semibold">{t("explorer.timestamp")}</th>
                  <th className="py-3 px-4 text-white/70 text-sm font-semibold">{t("explorer.txCount")}</th>
                  <th className="py-3 px-4 text-white/70 text-sm font-semibold">{t("explorer.gasUsed")}</th>
                  <th className="py-3 px-4 text-white/70 text-sm font-semibold">{t("explorer.blockHash")}</th>
                </tr>
              </thead>
              <tbody>
                {blocks.map((b) => (
                  <tr
                    key={b.number}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setHash(BLOCK_PREFIX + b.number)}
                        className="text-emerald-400 hover:underline font-mono"
                      >
                        {b.number}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-white/80 text-sm">
                      {new Date(b.timestamp * 1000).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-white/80">{b.transactionCount}</td>
                    <td className="py-3 px-4 text-white/80 font-mono text-sm">{b.gasUsed.toString()}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setHash(BLOCK_PREFIX + b.number)}
                        className="text-emerald-400/80 hover:text-emerald-400 hover:underline font-mono text-xs break-all max-w-[200px] truncate block text-left w-full"
                        title={b.hash}
                      >
                        {b.hash}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {blocks.length === 0 && !isLoadingBlocks && (
            <div className="py-12 text-center text-white/50">{t("explorer.noBlocks")}</div>
          )}
        </div>
      )}
    </div>
  );
}
