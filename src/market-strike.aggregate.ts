import { OraclePriceEvent } from './watch-oracle-price';

export class MarketStrikeAggregate {
  private readonly windows = new Map<number, { open: number; close: number }>();

  apply(event: OraclePriceEvent) {
    const window = toMarketWindow(event.timestamp);
    const existing = this.windows.get(window);

    if (!existing) {
      this.windows.set(window, { open: event.price, close: event.price });

      console.log(`strike ${window} open: ${event.price}`);
    } else {
      existing.close = event.price;
    }
  }

  get(window: number) {
    return this.windows.get(window);
  }
}

export function toMarketWindow(timestamp: number): number {
  return Math.floor(timestamp / 300) * 300;
}
