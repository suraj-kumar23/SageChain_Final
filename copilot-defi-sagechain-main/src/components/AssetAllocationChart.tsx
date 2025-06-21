import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { WalletData } from "./WalletConnector";

const chartConfig = {
  eth: {
    label: "ETH",
    color: "hsl(260, 100%, 80%)",
  },
  usdc: {
    label: "USDC", 
    color: "hsl(200, 100%, 70%)",
  },
  lpTokens: {
    label: "LP Tokens",
    color: "hsl(280, 100%, 70%)",
  },
  other: {
    label: "Other",
    color: "hsl(320, 100%, 70%)",
  },
};

interface Asset {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  price: number;
  change: number;
}

interface AssetAllocationChartProps {
  walletData?: WalletData | null;
  isConnected: boolean;
  assets: Asset[];
}

const AssetAllocationChart = ({ walletData, isConnected, assets }: AssetAllocationChartProps) => {
  // Generate allocation data based on real wallet balance
  const getAllocationData = () => {
    if (!isConnected || assets.length === 0) {
      // Default data when no wallet connected
      return [
        { name: "No Assets", value: 100, color: "hsl(260, 20%, 50%)" }
      ];
    }
    
    const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

    return assets.map(asset => ({
      name: asset.symbol,
      value: (asset.value / totalValue) * 100,
      color: chartConfig[asset.symbol.toLowerCase() as keyof typeof chartConfig]?.color || chartConfig.other.color,
    }));
  };

  const data = getAllocationData();

  return (
    <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white">
          Asset Allocation (Real-Time)
          {isConnected && walletData && (
            <span className="block text-sm font-normal text-purple-300 mt-1">
              Based on MetaMask wallet: {walletData.address.slice(0, 6)}...{walletData.address.slice(-4)}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value, name) => [`${value}%`, name]}
              />
            </PieChart>
          </ChartContainer>
        </div>
        
        {/* Legend */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-purple-300 text-sm">{item.name}: {item.value}%</span>
            </div>
          ))}
        </div>
        
        {!isConnected && (
          <div className="text-center mt-4 p-3 bg-purple-900/20 rounded-lg border border-purple-800/30">
            <p className="text-purple-300 text-sm">Connect your MetaMask wallet to see real allocation data</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssetAllocationChart;
