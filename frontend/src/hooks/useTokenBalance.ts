import { useState, useEffect } from "react";
import { BrowserProvider, formatUnits, Contract } from "ethers";
import { DEPLOYMENT } from "./useContract";
import testTokenAbi from "../abis/TestToken.json";

export function useTokenBalance(provider: BrowserProvider | null, address: string | null, refreshKey = 0) {
  const [balances, setBalances] = useState({
    usd8: "0",
    weth: "0",
    eth: "0",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!provider || !address) {
        setBalances({ usd8: "0", weth: "0", eth: "0" });
        return;
      }

      setIsLoading(true);

      try {
        // Get ETH balance
        const ethBalance = await provider.getBalance(address);

        // Get USD8 balance - create contract instance directly
        const usd8Contract = new Contract(DEPLOYMENT.contracts.USD8, testTokenAbi.abi, provider);
        const usd8Balance = await usd8Contract.balanceOf(address);

        // Get WETH balance - create contract instance directly
        const wethContract = new Contract(DEPLOYMENT.contracts.WETH, testTokenAbi.abi, provider);
        const wethBalance = await wethContract.balanceOf(address);

        setBalances({
          usd8: formatUnits(usd8Balance, 18),
          weth: formatUnits(wethBalance, 18),
          eth: formatUnits(ethBalance, 18),
        });
      } catch (error) {
        console.error("Failed to fetch balances:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalances();
  }, [provider, address, refreshKey]);

  const refresh = () => {
    if (provider && address) {
      // Trigger re-fetch
      const usd8Contract = new Contract(DEPLOYMENT.contracts.USD8, testTokenAbi.abi, provider);
      const wethContract = new Contract(DEPLOYMENT.contracts.WETH, testTokenAbi.abi, provider);

      Promise.all([
        provider.getBalance(address),
        usd8Contract.balanceOf(address),
        wethContract.balanceOf(address),
      ]).then(([ethBalance, usd8Balance, wethBalance]) => {
        setBalances({
          usd8: formatUnits(usd8Balance, 18),
          weth: formatUnits(wethBalance, 18),
          eth: formatUnits(ethBalance, 18),
        });
      });
    }
  };

  return { balances, isLoading, refresh };
}
