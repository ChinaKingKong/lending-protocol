import { useState, useEffect } from "react";
import { BrowserProvider, formatUnits, Contract } from "ethers";
import { DEPLOYMENT } from "./useContract";
import lendingAbi from "../abis/SimpleLending.json";
import type { PoolInfo, UserPosition } from "../types";

export function usePoolInfo(provider: BrowserProvider | null, refreshKey = 0) {
  const [poolInfo, setPoolInfo] = useState<PoolInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPoolInfo = async () => {
      if (!provider) {
        setPoolInfo(null);
        return;
      }

      setIsLoading(true);

      try {
        const contract = new Contract(DEPLOYMENT.contracts.SimpleLending, lendingAbi.abi, provider);
        const info = await contract.getPoolInfo();
        setPoolInfo({
          totalSupply: info[0],
          totalBorrow: info[1],
          utilizationRate: info[2],
          supplyRate: info[3],
          borrowRate: info[4],
        });
      } catch (error) {
        console.error("Failed to fetch pool info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoolInfo();
  }, [provider, refreshKey]);

  const refresh = () => {
    if (provider) {
      const contract = new Contract(DEPLOYMENT.contracts.SimpleLending, lendingAbi.abi, provider);
      contract.getPoolInfo().then((info: any) => {
        setPoolInfo({
          totalSupply: info[0],
          totalBorrow: info[1],
          utilizationRate: info[2],
          supplyRate: info[3],
          borrowRate: info[4],
        });
      });
    }
  };

  return { poolInfo, isLoading, refresh };
}

export function useUserPosition(provider: BrowserProvider | null, signer: any, address: string | null, refreshKey = 0) {
  const [position, setPosition] = useState<UserPosition | null>(null);
  const [maxWithdraw, setMaxWithdraw] = useState("0");
  const [maxBorrow, setMaxBorrow] = useState("0");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserPosition = async () => {
      if (!provider || !signer || !address) {
        setPosition(null);
        setMaxWithdraw("0");
        setMaxBorrow("0");
        return;
      }

      setIsLoading(true);

      try {
        const contract = new Contract(DEPLOYMENT.contracts.SimpleLending, lendingAbi.abi, signer);
        const [pos, maxW, maxB] = await Promise.all([
          contract.getUserPosition(address),
          contract.calculateMaxWithdraw(address),
          contract.calculateMaxBorrow(address),
        ]);

        setPosition({
          supplied: pos[0],
          borrowed: pos[1],
          collateralValue: pos[2],
          healthFactor: pos[3],
        });
        setMaxWithdraw(formatUnits(maxW, 18));
        setMaxBorrow(formatUnits(maxB, 18));
      } catch (error) {
        console.error("Failed to fetch user position:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPosition();
  }, [provider, signer, address, refreshKey]);

  const refresh = () => {
    if (provider && signer && address) {
      const contract = new Contract(DEPLOYMENT.contracts.SimpleLending, lendingAbi.abi, signer);
      Promise.all([
        contract.getUserPosition(address),
        contract.calculateMaxWithdraw(address),
        contract.calculateMaxBorrow(address),
      ]).then(([pos, maxW, maxB]: any[]) => {
        setPosition({
          supplied: pos[0],
          borrowed: pos[1],
          collateralValue: pos[2],
          healthFactor: pos[3],
        });
        setMaxWithdraw(formatUnits(maxW, 18));
        setMaxBorrow(formatUnits(maxB, 18));
      });
    }
  };

  return { position, maxWithdraw, maxBorrow, isLoading, refresh };
}
