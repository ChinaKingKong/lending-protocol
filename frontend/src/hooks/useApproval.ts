import { useState, useEffect } from "react";
import { parseUnits, formatUnits } from "ethers";
import { useTestToken } from "./useContract";
import { DEPLOYMENT } from "./useContract";

export function useApproval(
  signer: any,
  owner: string | null,
  spenderAddress: string,
  tokenAddress: string
) {
  const [allowance, setAllowance] = useState("0");
  const [isApproved, setIsApproved] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    const fetchAllowance = async () => {
      if (!signer || !owner) {
        setAllowance("0");
        setIsApproved(false);
        return;
      }

      try {
        const contract = useTestToken(signer, tokenAddress);
        if (!contract) return;

        const allowanceValue = await contract.allowance(owner, spenderAddress);
        const formatted = formatUnits(allowanceValue, 18);
        setAllowance(formatted);
        // Consider approved if allowance is very large (unlimited)
        setIsApproved(allowanceValue >= parseUnits("1000000", 18));
      } catch (error) {
        console.error("Failed to fetch allowance:", error);
      }
    };

    fetchAllowance();
  }, [signer, owner, spenderAddress, tokenAddress]);

  const approve = async (amount: string = "1000000") => {
    if (!signer) {
      throw new Error("Wallet not connected");
    }

    setIsApproving(true);

    try {
      const contract = useTestToken(signer, tokenAddress);
      if (!contract) {
        throw new Error("Contract not found");
      }

      const amountToApprove = parseUnits(amount, 18);
      const tx = await contract.approve(spenderAddress, amountToApprove);
      await tx.wait();

      const newAllowance = await contract.allowance(await signer.getAddress(), spenderAddress);
      setAllowance(formatUnits(newAllowance, 18));
      setIsApproved(true);

      return tx;
    } catch (error: any) {
      console.error("Approval failed:", error);
      throw error;
    } finally {
      setIsApproving(false);
    }
  };

  return { allowance, isApproved, isApproving, approve };
}
