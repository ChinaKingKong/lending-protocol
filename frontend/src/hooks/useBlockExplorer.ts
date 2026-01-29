import { useState, useEffect, useCallback } from "react";
import type { BrowserProvider } from "ethers";

const BLOCKS_PAGE_SIZE = 20;

export interface BlockSummary {
  number: number;
  timestamp: number;
  transactionCount: number;
  gasUsed: bigint;
  hash: string;
}

export function useBlockExplorer(provider: BrowserProvider | null) {
  const [latestBlockNumber, setLatestBlockNumber] = useState<number | null>(null);
  const [blocks, setBlocks] = useState<BlockSummary[]>([]);
  const [blockDetail, setBlockDetail] = useState<BlockSummary & { transactions: string[] } | null>(null);
  const [txDetail, setTxDetail] = useState<{
    hash: string;
    from: string;
    to: string | null;
    value: bigint;
    blockNumber: number | null;
    gasLimit: bigint;
    gasUsed: bigint | null;
    status: number | null;
    data: string;
  } | null>(null);
  const [isLoadingBlocks, setIsLoadingBlocks] = useState(false);
  const [isLoadingBlock, setIsLoadingBlock] = useState(false);
  const [isLoadingTx, setIsLoadingTx] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBlocks = useCallback(async () => {
    if (!provider) return;
    setIsLoadingBlocks(true);
    setError(null);
    try {
      const blockNumber = await provider.getBlockNumber();
      setLatestBlockNumber(blockNumber);
      const summaries: BlockSummary[] = [];
      const to = Math.max(0, blockNumber - BLOCKS_PAGE_SIZE + 1);
      for (let i = blockNumber; i >= to; i--) {
        const block = await provider.getBlock(i, false);
        if (!block) continue;
        const txCount = Array.isArray(block.transactions)
          ? block.transactions.length
          : (block.transactions as unknown[]).length;
        summaries.push({
          number: block.number!,
          timestamp: block.timestamp,
          transactionCount: typeof txCount === "number" ? txCount : 0,
          gasUsed: block.gasUsed,
          hash: block.hash!,
        });
      }
      setBlocks(summaries);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to fetch blocks");
    } finally {
      setIsLoadingBlocks(false);
    }
  }, [provider]);

  const fetchBlockByNumber = useCallback(async (number: number) => {
    if (!provider) return;
    setIsLoadingBlock(true);
    setError(null);
    setBlockDetail(null);
    try {
      const block = await provider.getBlock(number, true);
      if (!block) {
        setError("Block not found");
        return;
      }
      const txs = block.transactions as unknown[];
      const txHashes = (Array.isArray(txs) ? txs : []).map((t: unknown) =>
        typeof t === "string" ? t : (t && typeof t === "object" && "hash" in t ? String((t as { hash: string }).hash) : "")
      ).filter(Boolean);
      setBlockDetail({
        number: block.number!,
        timestamp: block.timestamp,
        transactionCount: txHashes.length,
        gasUsed: block.gasUsed,
        hash: block.hash!,
        transactions: txHashes.filter(Boolean),
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to fetch block");
    } finally {
      setIsLoadingBlock(false);
    }
  }, [provider]);

  const fetchTxByHash = useCallback(async (hash: string) => {
    if (!provider) return;
    setIsLoadingTx(true);
    setError(null);
    setTxDetail(null);
    try {
      const [tx, receipt] = await Promise.all([
        provider.getTransaction(hash),
        provider.getTransactionReceipt(hash),
      ]);
      if (!tx) {
        setError("Transaction not found");
        return;
      }
      setTxDetail({
        hash: tx.hash,
        from: tx.from,
        to: tx.to ?? null,
        value: tx.value,
        blockNumber: tx.blockNumber ?? null,
        gasLimit: tx.gasLimit,
        gasUsed: receipt?.gasUsed ?? null,
        status: receipt?.status ?? null,
        data: tx.data,
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to fetch transaction");
    } finally {
      setIsLoadingTx(false);
    }
  }, [provider]);

  return {
    latestBlockNumber,
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
  };
}
