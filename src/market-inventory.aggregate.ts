import { LeaderExecutionEvent } from './watch-leader-execution';

export type MarketInventoryEvent = LeaderExecutionEvent;

export class MarketInventoryAggregate {
  private readonly seen = new Set<string>();
  private readonly up = { shares: 0, cost: 0 };
  private readonly down = { shares: 0, cost: 0 };

  get ratio() {
    return this.up.shares / (this.up.shares + this.down.shares);
  }

  constructor(private readonly slug: string) {}

  apply(event: LeaderExecutionEvent) {
    switch (event.type) {
      case 'leader-execution':
        const key = marketExecutionKey(event);
        if (this.seen.has(key)) {
          return;
        } else {
          this.seen.add(key);
        }

        const sign = event.side === 'BUY' ? 1 : -1;
        const outcome = event.outcome === 'Up' ? this.up : this.down;

        outcome.shares += sign * event.size;
        outcome.cost += sign * event.size * event.price;

        console.log(this.slug, { ratio: this.ratio, up: this.up, down: this.down });

        break;
    }
  }
}

function marketExecutionKey(event: LeaderExecutionEvent) {
  return `${event.timestamp}${event.outcome}${event.price}${event.size}${event.transactionHash}`;
}
