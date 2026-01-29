import { useState, useEffect } from "react";
import { BrowserProvider, formatUnits } from "ethers";
import { useTestToken } from "./useContract";
import { DEPLOYMENT } from "./useContract";

export function useTokenBalance(provider: BrowserProvider | null, address: string | null) {
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

        // Get USD8 balance
        const usd8Contract = useTestToken(provider, DEPLOYMENT.contracts.USD8);
        const usd8Balance = usd8Contract ? await usd8Contract.balanceOf(address) : 0n;

        // Get WETH balance
        const wethContract = useTestToken(provider, DEPLOYMENT.contracts.WETH);
        const wethBalance = wethContract ? await wethContract.balanceOf(address) : 0n;

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
  }, [provider, address]);

  const refresh = () => {
    if (provider && address) {
      // Trigger re-fetch
      provider.getBalance(address).then((ethBalance) => {
        useTestToken(provider, DEPLOYMENT.contracts.USD8)?.balanceOf(address).then((usd8Balance: bigint) => {
          useTestToken(provider, DEPLOYMENT.contracts.WETH)?.balanceOf(address).then((wethBalance: bigint) => {
            setBalances({
              usd8: formatUnits(usd8Balance, 18),
              weth: formatUnits(wethBalance, 18),
              eth: formatUnits(ethBalance, 18),
            });
          });
        });
      });
    }
  };

  return { balances, isLoading, refresh };
}
