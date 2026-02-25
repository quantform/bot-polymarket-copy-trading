import { forkJoin, tap } from 'rxjs';
import { watchOraclePrice } from './watch-oracle-price';
import { useLogger } from '@quantform/core';
import { watchLeaderExecution } from './watch-leader-execution';

export function useStrategy() {
  const { info } = useLogger('strategy');

  return forkJoin([
    watchOraclePrice().pipe(tap(it => info(`${it.timestamp} - ${it.price}`))),
    watchLeaderExecution('0x1d0034134e339a309700Ff2D34e99FA2d48b0313').pipe(
      tap(it => info(`${it.timestamp} - ${it.outcome} ${it.price}@${it.size}`))
    )
  ]);
}
