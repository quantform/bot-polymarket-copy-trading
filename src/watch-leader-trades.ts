import { filter } from 'rxjs';
import { watchTrades } from './polymarket/watch-trades';

export function watchLeaderTrades(leader: string) {
  return watchTrades().pipe(
    filter(
      ({ payload }) =>
        payload.name == leader && payload.eventSlug.startsWith('btc-updown-5m-')
    )
  );
}
