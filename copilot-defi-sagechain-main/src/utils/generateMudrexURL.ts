export function generateMudrexURL({
  token,
  walletAddress,
  amountINR,
  network = 'polygon'
}: {
  token: string;
  walletAddress: string;
  amountINR: number;
  network?: 'polygon' | 'ethereum';
}) {
  const baseUrl = 'https://app.mudrex.com/onramp';
  const params = new URLSearchParams({
    token,
    amount: amountINR.toString(),
    wallet: walletAddress,
    network
  });

  return `${baseUrl}?${params.toString()}`;
}

export async function fetch1inchPrice(tokenAddress: string, chainId: number = 1) {
  // USDC address on Ethereum
  const usdcAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
  const url = `https://api.1inch.dev/price/v1.1/${chainId}/${tokenAddress}?quoteToken=${usdcAddress}`;
  const res = await fetch(url, {
    headers: {
      Authorization: 'Bearer 3pAulSfGvU4fvxxUMva801cNvI5ABone'
    }
  });
  if (!res.ok) throw new Error('1inch API error');
  return res.json();
}