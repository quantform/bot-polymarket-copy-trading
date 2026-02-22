import { filter, map } from 'rxjs';
import { watchRealTimeData } from './watch-real-time-data';

export type TradeMessage = {
  payload: {
    asset: string;
    bio: string;
    conditionId: string;
    eventSlug: string;
    name: string;
    outcome: string;
    outcomeIndex: number;
    side: string;
    size: number;
    price: number;
    proxyWallet: string;
    timestamp: number;
    title: string;
    transactionHash: string;
  };
};

export function watchTrades() {
  return watchRealTimeData([{ topic: 'activity', type: 'trades' }]).pipe(
    filter(({ type }) => type == 'trades'),
    map(it => it as TradeMessage)
  );
}
