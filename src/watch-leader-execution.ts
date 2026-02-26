import { filter, map, Observable } from 'rxjs';
import { watchLiveDataRotated } from './watch-live-data-rotated';
import { TradeMessage } from './polymarket/watch-live-data';
import { useOptions } from './use-options';

export type LeaderExecutionEvent = {
  type: 'leader-execution';
  transactionHash: string;
  timestamp: number;
  outcome: string;
  price: number;
  size: number;
  side: string;
  slug: string;
};

export function watchLeaderExecution(): Observable<LeaderExecutionEvent> {
  const { leaderProxyWalletAddress } = useOptions();

  return watchLiveDataRotated('btc').pipe(
    filter(
      (it): it is TradeMessage =>
        it.type == 'trades' &&
        it.payload.proxyWallet == leaderProxyWalletAddress &&
        it.payload.eventSlug.startsWith('btc-updown-5m-')
    ),
    map(({ payload }) => ({
      type: 'leader-execution',
      timestamp: payload.timestamp,
      transactionHash: payload.transactionHash,
      outcome: payload.outcome,
      price: payload.price,
      size: payload.size,
      side: payload.side,
      slug: payload.eventSlug
    }))
  );
}
