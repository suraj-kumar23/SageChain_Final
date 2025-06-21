import { useState } from "react";
import { ethers } from "ethers";
import SageTokenABI from "../../artifacts/contracts/SageToken.sol/SageToken.json";
import TokenSwapABI from "../../artifacts/contracts/TokenSwap.sol/TokenSwap.json";

const sageTokenAddress = "0x..."; // use deployed address
const tokenSwapAddress = "0x...";

export default function SwapPanel() {
  const [amount, setAmount] = useState("");

  async function buy() {
    if (!window.ethereum) return;
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(tokenSwapAddress, TokenSwapABI.abi, signer);

    const tx = await contract.buyTokens({ value: ethers.utils.parseEther(amount) });
    await tx.wait();
    alert("Tokens bought!");
  }

  return (
    <div className="p-4 border rounded-xl bg-white w-full max-w-md space-y-3">
      <h2 className="text-lg font-bold">Buy SAGE Tokens</h2>
      <input
        type="number"
        placeholder="ETH amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2 w-full"
      />
      <button onClick={buy} className="bg-blue-600 text-white px-4 py-2 rounded">
        Buy Tokens
      </button>
    </div>
  );
}
