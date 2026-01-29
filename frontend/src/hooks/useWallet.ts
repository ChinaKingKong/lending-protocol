import { useState, useEffect, useCallback } from "react";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import type { WalletState } from "../types";

const LOCAL_CHAIN_ID = 31337;
const LOCAL_RPC_URL = "http://127.0.0.1:8545";

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    chainId: null,
    balance: 0n,
  });
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (!window.ethereum) return;

      try {
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();

        if (accounts.length > 0) {
          const address = await accounts[0].getAddress();
          const balance = await provider.getBalance(address);
          const network = await provider.getNetwork();

          setWallet({
            isConnected: true,
            address,
            chainId: Number(network.chainId),
            balance,
          });
          setSigner(await provider.getSigner());
          setProvider(provider);
        }
      } catch (err) {
        console.error("Failed to check connection:", err);
      }
    };

    checkConnection();
  }, []);

  // Listen for account/network changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        updateWalletInfo(accounts[0]);
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  const updateWalletInfo = async (address: string) => {
    if (!provider) return;

    try {
      const balance = await provider.getBalance(address);
      const network = await provider.getNetwork();

      setWallet({
        isConnected: true,
        address,
        chainId: Number(network.chainId),
        balance,
      });
    } catch (err) {
      console.error("Failed to update wallet info:", err);
    }
  };

  const switchToLocalNetwork = async (): Promise<boolean> => {
    if (!window.ethereum) return false;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${LOCAL_CHAIN_ID.toString(16)}` }],
      });
      return true;
    } catch (switchError: any) {
      // Network doesn't exist, try to add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: `0x${LOCAL_CHAIN_ID.toString(16)}`,
              chainName: "Hardhat Local",
              nativeCurrency: {
                name: "Ether",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: [LOCAL_RPC_URL],
            }],
          });
          return true;
        } catch (addError) {
          console.error("Failed to add network:", addError);
          setError("Failed to add Hardhat network to MetaMask");
          return false;
        }
      }
      return false;
    }
  };

  const connect = async () => {
    if (!window.ethereum) {
      setError("MetaMask not installed. Please install MetaMask to continue.");
      return false;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const address = accounts[0];
      const balance = await provider.getBalance(address);
      const network = await provider.getNetwork();
      let chainId = Number(network.chainId);

      // Check if on correct network, if not, switch
      if (chainId !== LOCAL_CHAIN_ID) {
        const switched = await switchToLocalNetwork();
        if (!switched) {
          setError("Please switch to Hardhat local network (Chain ID: 31337)");
          setIsConnecting(false);
          return false;
        }
        // Re-fetch network after switch
        const newNetwork = await provider.getNetwork();
        chainId = Number(newNetwork.chainId);
      }

      const signer = await provider.getSigner();

      setWallet({
        isConnected: true,
        address,
        chainId,
        balance,
      });
      setSigner(signer);
      setProvider(provider);

      return true;
    } catch (err: any) {
      console.error("Failed to connect wallet:", err);
      setError(err.message || "Failed to connect wallet");
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setWallet({
      isConnected: false,
      address: null,
      chainId: null,
      balance: 0n,
    });
    setSigner(null);
    setProvider(null);
  };

  return {
    wallet,
    signer,
    provider,
    isConnecting,
    error,
    connect,
    disconnect,
  };
}

// Extend window.ethereum type
declare global {
  interface Window {
    ethereum?: any;
  }
}
