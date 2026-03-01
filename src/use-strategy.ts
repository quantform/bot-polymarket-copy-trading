import { forkJoin, merge, tap } from 'rxjs';
import { watchOraclePrice } from './watch-oracle-price';
import { watchLeaderExecution } from './watch-leader-execution';
import { MarketAggregate } from './market-aggregate';
import { useTimestamp } from '@quantform/core';

export function useStrategy() {
  let aggregate = MarketAggregate.for(useTimestamp() / 10000, 'btc');

  return merge(
    watchOraclePrice().pipe(tap(it => aggregate.apply(it))),
    watchLeaderExecution().pipe(tap(it => aggregate.apply(it)))
  ).pipe(
    tap(() => {
      if (aggregate.next && aggregate.timeLeft < 0) {
        console.log(
          'switching aggregate',
          aggregate.slug,
          aggregate.next.slug,
          aggregate.timeLeft
        );
        aggregate = aggregate.next;
      }
    })
  );
}
