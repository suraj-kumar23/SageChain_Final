import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Play, Calculator, TrendingUp, AlertCircle, CheckCircle2, Settings } from "lucide-react";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const SimulationPanel = () => {
  const [simulationType, setSimulationType] = useState('swap');
  const [fromToken, setFromToken] = useState('');
  const [toToken, setToToken] = useState('');
  const [amount, setAmount] = useState('');
  const [slippageTolerance, setSlippageTolerance] = useState([0.5]);
  const [selectedProtocol, setSelectedProtocol] = useState('');
  const [collateral, setCollateral] = useState('');
  const [borrowAmount, setBorrowAmount] = useState('');
  const [lendingPeriod, setLendingPeriod] = useState('');
  const [interestRate, setInterestRate] = useState([5.0]);
  const [leverage, setLeverage] = useState([1.0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: 'Price',
        data: [] as number[],
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Volume',
        data: [] as number[],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.4,
        fill: true,
        yAxisID: 'volume',
      },
    ],
  });

  const mockTokens = [
    { symbol: 'ETH', name: 'Ethereum', price: 2534.12, apy: 4.5 },
    { symbol: 'USDC', name: 'USD Coin', price: 1.00, apy: 8.2 },
    { symbol: 'USDT', name: 'Tether', price: 1.00, apy: 8.0 },
    { symbol: 'AAVE', name: 'Aave', price: 98.76, apy: 12.4 },
    { symbol: 'UNI', name: 'Uniswap', price: 12.84, apy: 15.6 },
  ];

  const swapProtocols = [
    { name: 'Uniswap V3', fee: '0.05%', liquidity: 'High' },
    { name: 'Uniswap V2', fee: '0.30%', liquidity: 'Medium' },
    { name: 'SushiSwap', fee: '0.25%', liquidity: 'Medium' },
    { name: '1inch', fee: 'Variable', liquidity: 'Aggregated' },
    { name: 'Curve', fee: '0.04%', liquidity: 'Stable pairs' },
    { name: 'Balancer', fee: 'Variable', liquidity: 'Multi-token' },
  ];

  const lendingProtocols = [
    { name: 'Aave V3', type: 'Supply & Borrow', risk: 'Low' },
    { name: 'Compound V3', type: 'Supply & Borrow', risk: 'Low' },
    { name: 'MakerDAO', type: 'CDP', risk: 'Medium' },
    { name: 'Euler', type: 'Supply & Borrow', risk: 'Medium' },
  ];

  const resetSimulation = () => {
    setFromToken('');
    setToToken('');
    setAmount('');
    setSlippageTolerance([0.5]);
    setSelectedProtocol('');
    setCollateral('');
    setBorrowAmount('');
    setLendingPeriod('');
    setInterestRate([5.0]);
    setLeverage([1.0]);
    setIsSimulating(false);
    setSimulationResult(null);
    setChartData({
      labels: [],
      datasets: [
        {
          label: 'Price',
          data: [],
          borderColor: '#8B5CF6',
          backgroundColor: 'rgba(139, 92, 246, 0.2)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Volume',
          data: [],
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          tension: 0.4,
          fill: true,
          yAxisID: 'volume',
        },
      ],
    });
  };

  const runSimulation = async () => {
    setIsSimulating(true);
    setChartData({
      labels: [],
      datasets: [
        { 
          label: 'Price', 
          data: [], 
          borderColor: '#8B5CF6', 
          backgroundColor: 'rgba(139, 92, 246, 0.2)', 
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Volume',
          data: [],
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          tension: 0.4,
          fill: true,
          yAxisID: 'volume',
        }
      ]
    });
    let count = 0;
    let lastPrice = 100;
    let trend = 1;

    const interval = setInterval(() => {
      // Simulate price movement with trends and volatility
      const volatility = Math.random() * 2 - 1;
      const trendStrength = Math.random() * 0.3;
      const priceChange = (volatility + trendStrength * trend) * 2;
      lastPrice = Math.max(60, Math.min(140, lastPrice + priceChange));
      
      // Simulate trading volume
      const volume = Math.abs(priceChange) * (Math.random() * 50 + 50);
      
      // Occasionally change trend
      if (Math.random() < 0.1) trend *= -1;

      setChartData((prev) => ({
        labels: [...prev.labels, `${count}s`],
        datasets: [
          { 
            ...prev.datasets[0], 
            data: [...prev.datasets[0].data, lastPrice]
          },
          {
            ...prev.datasets[1],
            data: [...prev.datasets[1].data, volume]
          }
        ]
      }));
      count++;
    }, 500);

    setTimeout(() => {
      clearInterval(interval);
      let mockResult;
      
      switch(simulationType) {
        case 'swap':
          mockResult = {
            type: 'swap',
            success: true,
            estimatedOutput: '2.456 ETH',
            gasFee: '$12.34',
            priceImpact: '0.12%',
            slippage: `${slippageTolerance[0]}%`,
            route: selectedProtocol ? [selectedProtocol] : ['Uniswap V3', '1inch', 'Paraswap'],
            confidence: 94,
            risks: [
              { level: 'low', message: 'Price impact within acceptable range' },
              { level: 'medium', message: 'Consider splitting large orders' },
            ],
          };
          break;

        case 'buy':
          const leveragedAmount = parseFloat(amount) * leverage[0];
          mockResult = {
            type: 'buy',
            success: true,
            estimatedOutput: `${leveragedAmount.toFixed(2)} ${toToken}`,
            totalCost: `$${(leveragedAmount * mockTokens.find(t => t.symbol === toToken)?.price || 0).toFixed(2)}`,
            leverage: `${leverage[0]}x`,
            liquidationPrice: `$${(mockTokens.find(t => t.symbol === toToken)?.price * 0.8 || 0).toFixed(2)}`,
            gasFee: '$15.45',
            confidence: 92,
            risks: [
              { level: 'medium', message: 'Using leverage increases liquidation risk' },
              { level: 'high', message: 'Market volatility may trigger liquidation' },
            ],
          };
          break;

        case 'lend':
          const borrowingPower = parseFloat(amount) * 0.75; // 75% LTV ratio
          const interestEarned = (parseFloat(amount) * (mockTokens.find(t => t.symbol === collateral)?.apy || 0) / 100) * (parseFloat(lendingPeriod) / 365);
          const borrowingCost = (parseFloat(borrowAmount) * interestRate[0] / 100) * (parseFloat(lendingPeriod) / 365);
          
          mockResult = {
            type: 'lend',
            success: true,
            collateralValue: `${amount} ${collateral}`,
            borrowingPower: `${borrowingPower.toFixed(2)} ${collateral}`,
            borrowAmount: `${borrowAmount} USDC`,
            estimatedInterestEarned: `$${interestEarned.toFixed(2)}`,
            borrowingCost: `$${borrowingCost.toFixed(2)}`,
            netAPY: `${(mockTokens.find(t => t.symbol === collateral)?.apy || 0).toFixed(1)}%`,
            healthFactor: ((parseFloat(amount) * 0.75) / parseFloat(borrowAmount || '1')).toFixed(2),
            confidence: 96,
            risks: [
              { level: 'low', message: 'Collateral ratio within safe range' },
              { level: 'medium', message: 'Monitor market conditions for rate changes' },
            ],
          };
          break;
      }
      setSimulationResult(mockResult);
      setIsSimulating(false);
    }, 5000);
  };
  
  // Root container styles for full-height purple background and vertical scrolling
  const rootStyle = {
    minHeight: '100vh',
    backgroundColor: '#8B5CF6',
    overflowY: 'auto' as const,
    overflowX: 'hidden' as const,
    padding: '2rem',
  };

  return (
    <div style={rootStyle} className="w-full max-w-7xl mx-auto space-y-6 overflow-y-auto overflow-x-hidden">
      <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* All your existing UI (Input, Buttons, Tabs, etc.) goes here unchanged */}
      <Card className="w-full bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-purple-400" />
            DeFi Simulation Lab
          </CardTitle>
          <CardDescription className="text-purple-300">
            Test your DeFi strategies risk-free before executing on-chain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="swap" className="space-y-4" onValueChange={(value) => setSimulationType(value)}>
            <TabsList className="w-full sm:w-auto bg-black/20">
              <TabsTrigger value="swap">Swap</TabsTrigger>
              <TabsTrigger value="buy">Buy</TabsTrigger>
              <TabsTrigger value="lend">Lend</TabsTrigger>
            </TabsList>

            <TabsContent value="swap" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-purple-300">From Token</label>
                  <Select onValueChange={setFromToken}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTokens.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol}>
                          {token.symbol} - {token.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-purple-300">To Token</label>
                  <Select onValueChange={setToToken}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTokens.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol}>
                          {token.symbol} - {token.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-purple-300">Amount</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-purple-300">Protocol</label>
                <Select onValueChange={setSelectedProtocol}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select protocol" />
                  </SelectTrigger>
                  <SelectContent>
                    {swapProtocols.map((protocol) => (
                      <SelectItem key={protocol.name} value={protocol.name}>
                        {protocol.name} - Fee: {protocol.fee}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm text-purple-300">Slippage Tolerance</label>
                  <span className="text-sm text-purple-300">{slippageTolerance}%</span>
                </div>
                <Slider
                  value={slippageTolerance}
                  onValueChange={setSlippageTolerance}
                  max={2}
                  step={0.1}
                />
              </div>
            </TabsContent>

            <TabsContent value="buy" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-purple-300">Token to Buy</label>
                <Select onValueChange={setToToken}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTokens.map((token) => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        {token.symbol} - ${token.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-purple-300">Amount (USD)</label>
                <Input
                  type="number"
                  placeholder="Enter USD amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm text-purple-300">Leverage</label>
                  <span className="text-sm text-purple-300">{leverage}x</span>
                </div>
                <Slider
                  value={leverage}
                  onValueChange={setLeverage}
                  min={1}
                  max={10}
                  step={0.5}
                />
              </div>
            </TabsContent>

            <TabsContent value="lend" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-purple-300">Collateral Token</label>
                  <Select onValueChange={setCollateral}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTokens.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol}>
                          {token.symbol} - APY: {token.apy}%
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-purple-300">Lending Protocol</label>
                  <Select onValueChange={setSelectedProtocol}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select protocol" />
                    </SelectTrigger>
                    <SelectContent>
                      {lendingProtocols.map((protocol) => (
                        <SelectItem key={protocol.name} value={protocol.name}>
                          {protocol.name} - {protocol.type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-purple-300">Collateral Amount</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-purple-300">Borrow Amount</label>
                <Input
                  type="number"
                  placeholder="Enter amount to borrow"
                  value={borrowAmount}
                  onChange={(e) => setBorrowAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-purple-300">Lending Period (days)</label>
                <Input
                  type="number"
                  placeholder="Enter lending period"
                  value={lendingPeriod}
                  onChange={(e) => setLendingPeriod(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm text-purple-300">Interest Rate</label>
                  <span className="text-sm text-purple-300">{interestRate}% APR</span>
                </div>
                <Slider
                  value={interestRate}
                  onValueChange={setInterestRate}
                  min={1}
                  max={20}
                  step={0.5}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                className="flex-1 bg-purple-600 hover:bg-purple-700"
                onClick={runSimulation}
                disabled={isSimulating}
              >
                <Play className="w-4 h-4 mr-2" />
                {isSimulating ? 'Simulating...' : 'Run Simulation'}
              </Button>
              <Button
                className="flex-1 bg-slate-600 hover:bg-slate-700"
                onClick={resetSimulation}
                disabled={isSimulating}
              >
                <Settings className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isSimulating && (
        <Card className="w-full bg-black/40 border-purple-800/30 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Live Simulation Graph</CardTitle>
          </CardHeader>
          <CardContent>
            <Line
              data={chartData}
              options={{
                responsive: true,
                interaction: {
                  mode: 'index',
                  intersect: false,
                },
                scales: {
                  x: { 
                    title: { display: true, text: 'Time' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                  },
                  y: { 
                    title: { display: true, text: 'Price' },
                    min: 60,
                    max: 140,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                  },
                  volume: {
                    position: 'right',
                    title: { display: true, text: 'Volume' },
                    grid: { drawOnChartArea: false },
                  }
                },
                plugins: {
                  legend: {
                    labels: { color: 'rgba(255, 255, 255, 0.7)' }
                  },
                  tooltip: {
                    mode: 'index',
                    intersect: false,
                  }
                },
                animation: {
                  duration: 0
                }
              }}
            />
          </CardContent>
        </Card>
      )}

      {simulationResult && (
        <Card className="w-full bg-black/40 border-green-800/30 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              Simulation Results
            </CardTitle>
            <CardDescription className="text-green-300">
              Preview of your transaction before execution
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-purple-300">Confidence Score</span>
                <span className="text-sm text-white font-medium">{simulationResult.confidence}%</span>
              </div>
              <Progress value={simulationResult.confidence} className="bg-slate-800" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {simulationResult.type === 'swap' && (
                <>
                  <div className="p-4 bg-slate-800/30 rounded-lg">
                    <div className="text-sm text-purple-300">Expected Output</div>
                    <div className="text-lg font-semibold text-white">{simulationResult.estimatedOutput}</div>
                  </div>
                  <div className="p-4 bg-slate-800/30 rounded-lg">
                    <div className="text-sm text-purple-300">Price Impact</div>
                    <div className="text-lg font-semibold text-white">{simulationResult.priceImpact}</div>
                  </div>
                  <div className="p-4 bg-slate-800/30 rounded-lg">
                    <div className="text-sm text-purple-300">Slippage</div>
                    <div className="text-lg font-semibold text-white">{simulationResult.slippage}</div>
                  </div>
                </>
              )}

              {simulationResult.type === 'buy' && (
                <>
                  <div className="p-4 bg-slate-800/30 rounded-lg">
                    <div className="text-sm text-purple-300">Amount to Receive</div>
                    <div className="text-lg font-semibold text-white">{simulationResult.estimatedOutput}</div>
                  </div>
                  <div className="p-4 bg-slate-800/30 rounded-lg">
                    <div className="text-sm text-purple-300">Total Cost</div>
                    <div className="text-lg font-semibold text-white">{simulationResult.totalCost}</div>
                  </div>
                  <div className="p-4 bg-slate-800/30 rounded-lg">
                    <div className="text-sm text-purple-300">Liquidation Price</div>
                    <div className="text-lg font-semibold text-white">{simulationResult.liquidationPrice}</div>
                  </div>
                </>
              )}

              {simulationResult.type === 'lend' && (
                <>
                  <div className="p-4 bg-slate-800/30 rounded-lg">
                    <div className="text-sm text-purple-300">Borrowing Power</div>
                    <div className="text-lg font-semibold text-white">{simulationResult.borrowingPower}</div>
                  </div>
                  <div className="p-4 bg-slate-800/30 rounded-lg">
                    <div className="text-sm text-purple-300">Net APY</div>
                    <div className="text-lg font-semibold text-white">{simulationResult.netAPY}</div>
                  </div>
                  <div className="p-4 bg-slate-800/30 rounded-lg">
                    <div className="text-sm text-purple-300">Health Factor</div>
                    <div className="text-lg font-semibold text-white">{simulationResult.healthFactor}</div>
                  </div>
                </>
              )}
            </div>

            {simulationResult.type === 'lend' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-800/30 rounded-lg">
                  <div className="text-sm text-purple-300">Interest Earned</div>
                  <div className="text-lg font-semibold text-white">{simulationResult.estimatedInterestEarned}</div>
                </div>
                <div className="p-4 bg-slate-800/30 rounded-lg">
                  <div className="text-sm text-purple-300">Borrowing Cost</div>
                  <div className="text-lg font-semibold text-white">{simulationResult.borrowingCost}</div>
                </div>
              </div>
            )}
            <div className="space-y-3">
              <h4 className="text-white font-medium">Optimal Route</h4>
              <div className="flex flex-wrap items-center gap-2">
                {simulationResult.route.map((step, index) => (
                  <div key={index} className="flex items-center">
                    <Badge variant="outline" className="border-blue-600 text-blue-300">
                      {step}
                    </Badge>
                    {index < simulationResult.route.length - 1 && (
                      <TrendingUp className="w-4 h-4 text-purple-400 mx-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-white font-medium">Risk Assessment</h4>
              <div className="space-y-2">
                {simulationResult.risks.map((risk, index) => (
                  <div key={index} className={`flex items-center space-x-2 p-2 rounded-lg ${risk.level === 'low' ? 'bg-green-900/20' : 'bg-orange-900/20'}`} >
                    <AlertCircle className={`w-4 h-4 ${risk.level === 'low' ? 'text-green-400' : 'text-orange-400'}`} />
                    <span className={`text-sm ${risk.level === 'low' ? 'text-green-300' : 'text-orange-300'}`} >
                      {risk.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-700">
              <Button 
                className="bg-slate-600 hover:bg-slate-700 flex-1"
                onClick={resetSimulation}
                disabled={isSimulating}
              >
                <Settings className="w-4 h-4 mr-2" />
                Reset Simulation
              </Button>
              <Button 
                variant="outline" 
                className="border-purple-600 text-purple-400"
                onClick={() => setSimulationType('swap')}
              >
                Modify Parameters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
};

export default SimulationPanel;
