export type SupportedToken = 'ETH' | 'USDT' | 'USDC' | 'DAI' | 'WBTC';

export const tokenAddresses: Record<number, Record<SupportedToken, string>> = {
1: {
// Ethereum Mainnet
ETH: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
WBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
},
137: {
// Polygon Mainnet
ETH: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
USDT: '0xC2132D05D31c914A87C6611C10748AEb04B58e8F',
USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
DAI: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
WBTC: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
}
};