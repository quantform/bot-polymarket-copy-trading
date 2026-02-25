import { defer, merge, mergeMap, retry, share, takeUntil, timer } from 'rxjs';
import { watchLiveData } from './polymarket/watch-live-data';
import { useMemo } from '@quantform/core';

export function watchLiveDataRotated(symbol: 'btc', rotation: number = 60000) {
  const subscriptions = [
    /**
     * Streams real-time market trade executions (fills), used for
     * tracking order flow and updating local market leader state.
     */
    { topic: 'activity', type: 'trades' },
    /**
     * Streams Chainlink BTC/USD oracle price updates used as an
     * external reference price for strike value / pricing logic.
     */
    {
      topic: 'crypto_prices_chainlink',
      type: 'update',
      filters: '"{\"symbol\":\"btc/usd\"}"'
    }
  ];

  /**
   * Dual-socket connection rotation (make-before-break) to prevent data gaps during WS reconnects.
   *
   * Maintains overlapping live subscriptions to the Polymarket stream:
   *
   * - Primary socket starts immediately and streams data.
   * - Every `rotation` ms, a new standby socket is spawned and subscribes in parallel.
   * - Each standby lives for `rotation * 2` ms, ensuring overlap with the next socket.
   *
   * This guarantees that at least one already-subscribed connection is always active,
   * eliminating blind spots caused by:
   *   - reconnect latency
   *   - subscription processing delay on server
   *   - infra-enforced connection TTL (~5–10 min)
   *
   * During overlap both sockets may emit the same updates; downstream
   * deduplication (e.g. by timestamp) is required.
   */
  return useMemo(() => {
    return merge(
      defer(() => watchLiveData(subscriptions).pipe(retry())),
      timer(0, rotation).pipe(
        mergeMap(() =>
          watchLiveData(subscriptions).pipe(retry(), takeUntil(timer(rotation * 2)))
        )
      )
    ).pipe(share());
  }, [symbol, rotation]);
}
