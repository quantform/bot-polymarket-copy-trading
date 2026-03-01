import { useSocket } from '@quantform/core';
import { defer, filter, map, switchMap } from 'rxjs';

export interface Message<K extends string, T> {
  topic: string;
  type: K;
  timestamp: number;
  payload: T;
  connection_id: string;
}

export type TradeMessage = Message<
  'trades',
  {
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
  }
>;

export type UpdateMessage = Message<
  'update',
  {
    symbol: string;
    timestamp: number;
    value: number;
  }
>;

export type Messages = TradeMessage | UpdateMessage;

export function watchLiveData(
  subscriptions: { topic: string; type: string; filters?: string }[]
) {
  return defer(() => {
    const { monitor, send, watch } = useSocket('wss://ws-live-data.polymarket.com');

    return monitor().pipe(
      filter(it => it == 'opened'),
      switchMap(() => send({ payload: { action: 'subscribe', subscriptions } })),
      switchMap(() => watch().pipe(map(it => it.payload as Messages)))
    );
  });
}
