import { LeaderExecutionEvent } from './watch-leader-execution';
import { OraclePriceEvent } from './watch-oracle-price';
import { MarketInventoryAggregate } from './market-inventory.aggregate';

export type MarketEvent = OraclePriceEvent | LeaderExecutionEvent;

export class MarketAggregate {
  static for(timestamp: number, symbol: string) {
    const window = Math.floor(timestamp / 300) * 300;

    return new MarketAggregate(`${symbol}-updown-5m-${window}`, window);
  }

  private readonly inventory = new Map<string, MarketInventoryAggregate>();
  next?: MarketAggregate;

  time = 0;
  timeLeft = 0;

  private constructor(
    readonly slug: string,
    readonly window: number
  ) {}

  apply(event: MarketEvent) {
    this.time = Math.max(this.time, event.timestamp);
    this.timeLeft = 300 - (this.time - this.window);

    switch (event.type) {
      case 'oracle-price':
        break;

      case 'leader-execution':
        let inventory = this.inventory.get(event.slug);
        if (!inventory) {
          inventory = new MarketInventoryAggregate(event.slug);

          this.inventory.set(event.slug, inventory);
        }

        console.log('is active: ', this.window, this.timeLeft, event.timestamp);

        inventory.apply(event);
        break;
    }

    if (!this.next && this.timeLeft < 100) {
      this.next = MarketAggregate.for((this.window + 300) * 1000, 'btc');
    } else {
      this.next?.apply(event);
    }
  }
}
