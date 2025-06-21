import { useEffect, useState } from 'react';

export function use1inchPrices() {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,tether,usd-coin,dai,wrapped-bitcoin&vs_currencies=inr');
        const json = await res.json();
        setPrices({
          ETH: json.ethereum.inr,
          USDT: json.tether.inr,
          USDC: json["usd-coin"].inr,
          DAI: json.dai.inr,
          WBTC: json["wrapped-bitcoin"].inr,
        });
      } catch (e) {
        console.error("Price fetch failed", e);
      } finally {
        setLoading(false);
      }
    }
    fetchPrices();
  }, []);

  return { prices, loading };
}
