import { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "../../artifacts/contracts/MyContract.sol/MyContract.json";

// Replace with your deployed contract address
const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

export default function ContractUI() {
  const [value, setValue] = useState("");
  const [input, setInput] = useState("");

  const getValue = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI.abi, provider);
      const result = await contract.value();
      setValue(result.toString());
    } catch (err) {
      console.error("Error reading value:", err);
    }
  };

  const setValueOnContract = async () => {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);

      const tx = await contract.setValue(parseInt(input));
      await tx.wait();

      getValue(); // refresh value
      setInput("");
    } catch (err) {
      console.error("Error setting value:", err);
    }
  };

  useEffect(() => {
    getValue();
  }, []);

  return (
    <div className="p-4 rounded-xl border shadow-xl w-full max-w-md mx-auto mt-10 bg-white space-y-4">
      <h2 className="text-xl font-semibold">Smart Contract Interaction</h2>
      <div>
        <p className="mb-2">Current Value: <strong>{value}</strong></p>
        <input
          type="number"
          className="border rounded p-2 w-full mb-2"
          placeholder="Enter new value"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={setValueOnContract}
        >
          Set Value
        </button>
      </div>
    </div>
  );
}
