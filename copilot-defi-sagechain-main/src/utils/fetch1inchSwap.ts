// src/utils/fetch1inchSwap.ts

interface SwapParams {
    fromTokenAddress: string;
    toTokenAddress: string;
    amount: string; // in wei
    fromAddress: string;
    chainId: number;
    slippage?: number;
    apiKey?: string;
  }
  
  export async function fetch1inchSwap({
    fromTokenAddress,
    toTokenAddress,
    amount,
    fromAddress,
    chainId,
    slippage = 1,
    apiKey = 'B9FP22fxls62KdLd6BDEXroT2FftwaY2'
  }: SwapParams): Promise<{ tx: any }> {
    const url = `https://api.1inch.dev/swap/v5.2/${chainId}/swap?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${amount}&fromAddress=${fromAddress}&slippage=${slippage}`;
  
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        accept: 'application/json'
      }
    });
  
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Swap API failed: ${res.status} - ${errText}`);
    }
  
    return await res.json();
  }
  