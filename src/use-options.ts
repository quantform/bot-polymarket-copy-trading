import { useContext } from '@quantform/core';

export interface PolymarketCopyTradingOptions {
  leaderProxyWalletAddress: string;
}

const token = Symbol.for('bot-polymarket-copy-trading');

export function options(options: PolymarketCopyTradingOptions) {
  return {
    provide: token,
    useValue: options
  };
}

export function useOptions() {
  return useContext<PolymarketCopyTradingOptions>(token);
}
