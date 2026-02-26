import { LeaderExecutionEvent } from './watch-leader-execution';
import { OraclePriceEvent } from './watch-oracle-price';
import { MarketInventoryAggregate } from './market-inventory.aggregate';

export type MarketEvent = OraclePriceEvent | LeaderExecutionEvent;

export class MarketAggregate {
  private readonly inventory = new Map<string, MarketInventoryAggregate>();
  private price: number;

  constructor(private readonly strike: number) {
    this.price = strike;
  }

  apply(event: MarketEvent) {
    switch (event.type) {
      case 'oracle-price':
        this.price = event.price;
        break;

      case 'leader-execution':
        let inventory = this.inventory.get(event.slug);
        if (!inventory) {
          inventory = new MarketInventoryAggregate(event.slug);

          this.inventory.set(event.slug, inventory);
        }

        inventory.apply(event);
        break;
    }
  }
}
