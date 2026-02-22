import { tap } from 'rxjs';
import { watchLeaderTrades } from './watch-leader-trades';

export function useStrategy() {
  return watchLeaderTrades('0x1d0034134e').pipe(tap(it => console.log(it)));
}
