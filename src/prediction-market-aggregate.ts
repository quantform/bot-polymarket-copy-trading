import { LeaderExecutionEvent } from './watch-leader-execution';
import { OraclePriceEvent } from './watch-oracle-price';

export type MarketEvent = OraclePriceEvent | LeaderExecutionEvent;

export class PredictionMarketAggregate {
  private price: number;

  constructor(private readonly strike: number) {
    this.price = strike;
  }

  apply(event: MarketEvent) {
    switch (event.type) {
      case 'ev-oracle-price':
        this.price = event.price;
        break;

      case 'ev-leader-execution':
        break;
    }
  }
}
