import { filter, map, Observable } from 'rxjs';
import { watchLiveDataRotated } from './watch-live-data-rotated';
import { UpdateMessage } from './polymarket/watch-live-data';

export type OraclePriceEvent = {
  type: 'oracle-price';
  timestamp: number;
  price: number;
};

export function watchOraclePrice(): Observable<OraclePriceEvent> {
  return watchLiveDataRotated('btc').pipe(
    filter(
      (it): it is UpdateMessage =>
        it.type == 'update' &&
        it.topic == 'crypto_prices_chainlink' &&
        it.payload.symbol == 'btc/usd'
    ),
    map(({ payload }) => ({
      type: 'oracle-price',
      price: payload.value,
      timestamp: payload.timestamp
    }))
  );
}
