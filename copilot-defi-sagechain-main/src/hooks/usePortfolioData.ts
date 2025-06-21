import { useState, useEffect } from 'react';
import { WalletData } from '@/components/WalletConnector';

// Mock data - replace with actual API call
const mockPortfolioData = {
  totalValue: 12345.67,
  dailyChange: 123.45,
  changePercent: 1.01,
  assets: [
    { symbol: 'ETH', name: 'Ethereum', balance: 2.5, value: 5000, price: 2000, change: 1.5 },
    { symbol: 'BTC', name: 'Bitcoin', balance: 0.1, value: 4000, price: 40000, change: -0.5 },
    { symbol: 'USDC', name: 'USD Coin', balance: 3345.67, value: 3345.67, price: 1, change: 0 },
  ],
};

export const usePortfolioData = (walletData: WalletData | null) => {
  const [data, setData] = useState(mockPortfolioData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (walletData?.address) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setData(mockPortfolioData);
        setLoading(false);
      }, 1000);
    } else {
      // Reset to empty state if no wallet is connected
      setData({
        totalValue: 0,
        dailyChange: 0,
        changePercent: 0,
        assets: [],
      });
      setLoading(false);
    }
  }, [walletData]);

  return { ...data, loading };
}; 