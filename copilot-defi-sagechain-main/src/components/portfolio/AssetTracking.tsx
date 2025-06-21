import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { WalletData } from "../WalletConnector";

interface Asset {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  price: number;
  change: number;
}

interface AssetTrackingProps {
  isConnected: boolean;
  walletData?: WalletData | null;
  assets: Asset[];
  loading: boolean;
}

const AssetTracking = ({ isConnected, walletData, assets, loading }: AssetTrackingProps) => {
  const [hideBalances, setHideBalances] = useState(false);

  const formatValue = (value: number) => {
    if (hideBalances) return '****';
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatBalance = (balance: number, symbol: string) => {
    if (hideBalances) return '****';
    return `${balance.toFixed(4)} ${symbol}`;
  };

  if (!isConnected) {
    return (
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            🔎 Asset Tracking
          </CardTitle>
          <CardDescription className="text-purple-300">
            Connect your wallet to view your crypto holdings
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              🔎 Asset Tracking
            </CardTitle>
            <CardDescription className="text-purple-300">
              Your crypto holdings from MetaMask wallet
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setHideBalances(!hideBalances)}
            className="text-purple-300 hover:text-white"
          >
            {hideBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Total Net Worth */}
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-800/30">
          <div className="text-center">
            <p className="text-sm text-purple-300 mb-1">Total Net Worth</p>
            <p className="text-3xl font-bold text-white">{formatValue(walletData?.balance ? parseFloat(walletData.balance.replace(' ETH', '')) * 2000 : 0)}</p>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400 text-sm">Live MetaMask Data</span>
            </div>
          </div>
        </div>

        {/* Assets List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8 text-purple-300">Loading assets...</div>
          ) : assets.length > 0 ? (
            assets.map((asset) => (
              <div key={asset.symbol} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">{asset.symbol}</span>
                      <Badge variant="outline" className="border-purple-600 text-purple-300 text-xs">
                        {asset.name}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="text-right flex-1 max-w-xs">
                  <div className="text-white font-medium">{formatValue(asset.value)}</div>
                  <div className="text-sm text-slate-400">{formatBalance(asset.balance, asset.symbol)}</div>
                  <div className="text-xs text-slate-500">${asset.price.toLocaleString()}</div>
                </div>
                
                <div className="text-right min-w-[80px]">
                  <div className={`flex items-center justify-end ${asset.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    <TrendingUp className="w-3 h-3 mr-1" />
                    <span className="text-sm">{asset.change.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-purple-300">No assets found in connected wallet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetTracking;
