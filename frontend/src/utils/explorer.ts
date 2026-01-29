/**
 * 根据 chainId 返回区块浏览器交易链接
 */
export function getExplorerTxUrl(chainId: number | null, txHash: string): string {
  if (!chainId || !txHash) return "#";
  const base = getExplorerBase(chainId);
  if (!base) return "#";
  return `${base}/tx/${txHash}`;
}

/**
 * 根据 chainId 返回区块浏览器地址链接
 */
export function getExplorerAddressUrl(chainId: number | null, address: string): string {
  if (!chainId || !address) return "#";
  const base = getExplorerBase(chainId);
  if (!base) return "#";
  return `${base}/address/${address}`;
}

/**
 * 获取交易或地址在 Hardhat 本地网络上的显示信息
 * 由于 Hardhat 本地网络没有浏览器，返回 null
 */
export function getLocalNetworkInfo(chainId: number | null): { explorerUrl: string | null; note: string } | null {
  if (chainId === 31337) {
    return {
      explorerUrl: null,
      note: "Local network - view in Hardhat console terminal"
    };
  }
  return null;
}

function getExplorerBase(chainId: number): string {
  switch (chainId) {
    case 1:
      return "https://etherscan.io";
    case 11155111:
      return "https://sepolia.etherscan.io";
    case 31337:
      // Hardhat 本地网络没有可视化浏览器
      // 返回空字符串，让前端显示提示信息
      return "";
    default:
      return "https://etherscan.io";
  }
}
