import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, TrendingUp, DollarSign, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import type { WalletData } from "./WalletConnector";
import { fetch1inchSwap } from "@/utils/fetch1inchSwap";
import { tokenAddresses, SupportedToken } from "@/utils/tokenAddresses";

interface Props {
  walletData: WalletData | null;
}

const tokenList = [
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "USDT", name: "Tether" },
  { symbol: "USDC", name: "USD Coin" },
  { symbol: "DAI", name: "Dai" },
  { symbol: "WBTC", name: "Wrapped Bitcoin" },
  { symbol: "MATIC", name: "Polygon" },
  { symbol: "UNI", name: "Uniswap" },
  { symbol: "AAVE", name: "Aave" },
  { symbol: "LINK", name: "Chainlink" }
];

const CryptoTrading = ({ walletData }: Props) => {
  const { toast } = useToast();
  const [buyINRAmount, setBuyINRAmount] = useState('');
  const [selectedBuyCrypto, setSelectedBuyCrypto] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [selectedSellCrypto, setSelectedSellCrypto] = useState('');
  const [swapFromAmount, setSwapFromAmount] = useState('');
  const [selectedSwapFrom, setSelectedSwapFrom] = useState('');
  const [selectedSwapTo, setSelectedSwapTo] = useState('');
  const [prices, setPrices] = useState<{ [symbol: string]: number }>({});
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,tether,usd-coin,dai,wrapped-bitcoin,polygon,uniswap,aave,chainlink&vs_currencies=inr'
        );
        const data = await response.json();
        const formatted: { [symbol: string]: number } = {
          ETH: data.ethereum?.inr,
          USDT: data.tether?.inr,
          USDC: data["usd-coin"]?.inr,
          DAI: data.dai?.inr,
          WBTC: data["wrapped-bitcoin"]?.inr,
          MATIC: data.polygon?.inr,
          UNI: data.uniswap?.inr,
          AAVE: data.aave?.inr,
          LINK: data.chainlink?.inr
        };
        setPrices(formatted);
      } catch (err) {
        console.error('Failed to fetch prices:', err);
      } finally {
        setLoadingPrices(false);
      }
    };
    fetchPrices();
  }, []);

  const handleTransaction = async ({
    fromSymbol,
    toSymbol,
    amount,
  }: {
    fromSymbol: SupportedToken;
    toSymbol: SupportedToken;
    amount: string;
  }) => {
    if (!walletData?.address || !window.ethereum) {
      toast({ title: 'Wallet Error', description: 'Connect your wallet', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const fromAddress = await signer.getAddress();
      const { chainId } = await provider.getNetwork();

      const fromToken = tokenAddresses[chainId][fromSymbol];
      const toToken = tokenAddresses[chainId][toSymbol];
      const amountWei = ethers.utils.parseEther(amount).toString();

      if (fromSymbol !== 'ETH') {
        const tokenContract = new ethers.Contract(fromToken, [
          'function approve(address spender, uint amount) public returns (bool)',
          'function allowance(address owner, address spender) public view returns (uint)'
        ], signer);
        const spender = '0x1111111254EEB25477B68fb85Ed929f73A960582';
        const allowance = await tokenContract.allowance(fromAddress, spender);
        if (allowance.lt(amountWei)) {
          await tokenContract.approve(spender, amountWei);
        }
      }

      const data = await fetch1inchSwap({
        fromTokenAddress: fromToken,
        toTokenAddress: toToken,
        amount: amountWei,
        fromAddress,
        chainId,
        apiKey: 'B9FP22fxls62KdLd6BDEXroT2FftwaY2', // Updated 1inch API Key
      });

      const tx = await signer.sendTransaction({
        to: data.tx.to,
        data: data.tx.data,
        value: ethers.BigNumber.from(data.tx.value),
        gasLimit: 500000,
      });

      await tx.wait();
      toast({ title: 'Transaction Successful', description: `${amount} ${fromSymbol} → ${toSymbol}` });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Transaction failed', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyWithINR = () => {
    if (!walletData?.address || !buyINRAmount || !selectedBuyCrypto) {
      toast({ title: 'Missing Info', description: 'Enter INR amount and crypto', variant: 'destructive' });
      return;
    }
    const url = `https://metamask.app.link/dapp/onramp.money?wallet=${walletData.address}&amount=${buyINRAmount}&crypto=${selectedBuyCrypto}`;
    window.open(url, '_blank', 'width=420,height=720');
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Cryptocurrency Trading
          </CardTitle>
          <CardDescription className="text-purple-300">
            Buy, sell, and swap cryptocurrencies with competitive rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="buy" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
              <TabsTrigger value="buy">Buy</TabsTrigger>
              <TabsTrigger value="sell">Sell</TabsTrigger>
              <TabsTrigger value="swap">Swap</TabsTrigger>
            </TabsList>

            <TabsContent value="buy" className="space-y-4">
              <Label className="text-purple-300">Buy with INR (UPI)</Label>
              <Input placeholder="Amount in INR" value={buyINRAmount} onChange={(e) => setBuyINRAmount(e.target.value)} />
              <Select value={selectedBuyCrypto} onValueChange={setSelectedBuyCrypto}>
                <SelectTrigger><SelectValue placeholder="Select Token" /></SelectTrigger>
                <SelectContent>
                  {tokenList.map(t => <SelectItem key={t.symbol} value={t.symbol}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button onClick={handleBuyWithINR} className="bg-yellow-500 hover:bg-yellow-600 w-full">
                Pay via UPI & Receive Crypto
              </Button>
            </TabsContent>

            <TabsContent value="sell" className="space-y-4">
              <Input placeholder="Amount to sell" value={sellAmount} onChange={(e) => setSellAmount(e.target.value)} />
              <Select value={selectedSellCrypto} onValueChange={setSelectedSellCrypto}>
                <SelectTrigger><SelectValue placeholder="Select Token" /></SelectTrigger>
                <SelectContent>
                  {tokenList.filter(t => t.symbol !== 'ETH').map(t => <SelectItem key={t.symbol} value={t.symbol}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button onClick={() => handleTransaction({ fromSymbol: selectedSellCrypto as SupportedToken, toSymbol: 'ETH', amount: sellAmount })} disabled={isLoading}>
                Sell
              </Button>
            </TabsContent>

            <TabsContent value="swap" className="space-y-4">
              <Input placeholder="Amount to swap" value={swapFromAmount} onChange={(e) => setSwapFromAmount(e.target.value)} />
              <Select value={selectedSwapFrom} onValueChange={setSelectedSwapFrom}>
                <SelectTrigger><SelectValue placeholder="From Token" /></SelectTrigger>
                <SelectContent>
                  {tokenList.map(t => <SelectItem key={t.symbol} value={t.symbol}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={selectedSwapTo} onValueChange={setSelectedSwapTo}>
                <SelectTrigger><SelectValue placeholder="To Token" /></SelectTrigger>
                <SelectContent>
                  {tokenList.filter(t => t.symbol !== selectedSwapFrom).map(t => <SelectItem key={t.symbol} value={t.symbol}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button onClick={() => handleTransaction({ fromSymbol: selectedSwapFrom as SupportedToken, toSymbol: selectedSwapTo as SupportedToken, amount: swapFromAmount })} disabled={isLoading}>
                Swap
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Market Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tokenList.map(token => (
              <div key={token.symbol} className="p-4 bg-slate-800/30 rounded-lg border border-purple-800/20">
                <h3 className="text-white">{token.name} ({token.symbol})</h3>
                <p className="text-purple-300 text-sm">
                  {loadingPrices ? 'Loading...' : prices[token.symbol] ? `₹${prices[token.symbol].toLocaleString()}` : 'N/A'}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CryptoTrading;
