import { useTimestamp } from '@quantform/core';
import { distinctUntilChanged, interval, map, of, switchMap } from 'rxjs';
import { queryMarket } from './polymarket/query-market';

export function watchActivePredictionMarket(symbol: 'btc') {
  return interval(1000).pipe(
    map(() => getMarketSlug(symbol, useTimestamp())),
    distinctUntilChanged(),
    switchMap(slug => queryMarket(slug)),
    distinctUntilChanged((a, b) => a.id === b.id)
  );
}

function getMarketSlug(
  symbol: string,
  timestamp: number
): `${string}-updown-5m-${number}` {
  const window = Math.floor(timestamp / 300000) * 300;

  return `${symbol}-updown-5m-${window}`;
}
