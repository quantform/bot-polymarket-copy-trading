import { filter, map, Observable } from 'rxjs';
import { watchLiveDataRotated } from './watch-live-data-rotated';
import { UpdateMessage } from './polymarket/watch-live-data';

export type OraclePriceEvent = {
  type: 'ev-oracle-price';
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
    map(it => it as UpdateMessage),
    dedupeByTimestamp(),
    map(({ payload }) => ({
      type: 'ev-oracle-price',
      price: payload.value,
      timestamp: payload.timestamp
    }))
  );
}

function dedupeByTimestamp<T extends { timestamp: number }>() {
  let timestamp = -1;

  return (source: Observable<T>) =>
    source.pipe(
      map(value => {
        if (value.timestamp <= timestamp) {
          return undefined;
        }

        timestamp = value.timestamp;
        return value;
      }),
      filter((it): it is T => it !== undefined)
    );
}
