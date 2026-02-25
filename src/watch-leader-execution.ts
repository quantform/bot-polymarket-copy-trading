import { filter, map, Observable } from 'rxjs';
import { watchLiveDataRotated } from './watch-live-data-rotated';
import { TradeMessage } from './polymarket/watch-live-data';
import { useTimestamp } from '@quantform/core';

export type LeaderExecutionEvent = {
  type: 'ev-leader-execution';
  timestamp: number;
  outcome: string;
  price: number;
  size: number;
  side: string;
};

export function watchLeaderExecution(
  leaderWallet: string
): Observable<LeaderExecutionEvent> {
  return watchLiveDataRotated('btc').pipe(
    filter(
      (it): it is TradeMessage =>
        it.type == 'trades' &&
        it.payload.proxyWallet == leaderWallet &&
        it.payload.eventSlug.startsWith('btc-updown-5m-')
    ),
    dedupeByTrade(),
    map(({ payload }) => ({
      type: 'ev-leader-execution',
      timestamp: payload.timestamp,
      outcome: payload.outcome,
      price: payload.price,
      size: payload.size,
      side: payload.side
    }))
  );
}

function dedupeByTrade(windowMs = 120_000) {
  const seen = new Map<string, number>();

  return (source: Observable<TradeMessage>) =>
    source.pipe(
      filter(trade => {
        const p = trade.payload;

        const key =
          p.transactionHash + ':' + p.outcomeIndex + ':' + p.price + ':' + p.size;

        const now = useTimestamp();

        const prev = seen.get(key);
        if (prev && now - prev < windowMs) {
          return false;
        }

        seen.set(key, now);

        for (const [k, t] of seen) {
          if (now - t > windowMs) seen.delete(k);
        }

        return true;
      })
    );
}
