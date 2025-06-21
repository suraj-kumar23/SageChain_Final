import { useEffect, useState } from "react";
import { ethers } from "ethers";
import SageTokenABI from "../../artifacts/contracts/SageToken.sol/SageToken.json";

const sageTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // replace with your actual contract address

export default function CompanyProjection() {
  const [tvl, setTVL] = useState("0");

  useEffect(() => {
    async function fetchTVL() {
      const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
      const contract = new ethers.Contract(sageTokenAddress, SageTokenABI.abi, provider);
      const balance = await contract.balanceOf("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");
    console.log(ethers.utils.formatEther(balance));
    }

    fetchTVL();
    const interval = setInterval(fetchTVL, 5000);
    return () => clearInterval(interval);
  }, []);

  return <p className="text-lg">TVL: {tvl} SAGE</p>;
}
