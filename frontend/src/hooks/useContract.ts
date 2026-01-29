import { useMemo } from "react";
import { Contract, BrowserProvider } from "ethers";
import deploymentConfig from "../deployment.json";
import testTokenAbi from "../abis/TestToken.json";
import lendingAbi from "../abis/SimpleLending.json";

export function useContract(
  address: string,
  abi: any,
  signerOrProvider: BrowserProvider | any
) {
  return useMemo(() => {
    if (!address || !abi || !signerOrProvider) return null;

    try {
      return new Contract(address, abi, signerOrProvider);
    } catch (error) {
      console.error("Failed to create contract instance:", error);
      return null;
    }
  }, [address, abi, signerOrProvider]);
}

export function useTestToken(signerOrProvider: BrowserProvider | any, tokenAddress: string) {
  return useContract(tokenAddress, testTokenAbi.abi, signerOrProvider);
}

export function useLendingProtocol(signerOrProvider: BrowserProvider | any) {
  return useContract(
    deploymentConfig.contracts.SimpleLending,
    lendingAbi.abi,
    signerOrProvider
  );
}

export const DEPLOYMENT = deploymentConfig;
