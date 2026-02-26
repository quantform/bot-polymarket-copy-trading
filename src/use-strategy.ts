import { forkJoin, tap } from 'rxjs';
import { watchOraclePrice } from './watch-oracle-price';
import { watchLeaderExecution } from './watch-leader-execution';
import { MarketAggregate } from './market-aggregate';

export function useStrategy() {
  const aggregate = new MarketAggregate(0);

  return forkJoin([
    watchOraclePrice().pipe(tap(it => aggregate.apply(it))),
    watchLeaderExecution().pipe(tap(it => aggregate.apply(it)))
  ]);
}
