/**
 * 根据 chainId 返回区块浏览器交易链接
 */
export function getExplorerTxUrl(chainId: number | null, txHash: string): string {
  if (!chainId || !txHash) return "#";
  const base = getExplorerBase(chainId);
  return `${base}/tx/${txHash}`;
}

function getExplorerBase(chainId: number): string {
  switch (chainId) {
    case 1:
      return "https://etherscan.io";
    case 11155111:
      return "https://sepolia.etherscan.io";
    default:
      return "https://etherscan.io";
  }
}
