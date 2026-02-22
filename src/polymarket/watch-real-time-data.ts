import { withMemo, useSocket } from '@quantform/core';
import { filter, map, switchMap } from 'rxjs';

export interface Message {
  topic: string;
  type: string;
  timestamp: number;
  payload: object;
  connection_id: string;
}

export const watchRealTimeData = withMemo(
  (subscriptions: [{ topic: string; type: string }]) => {
    const { monitor, send, watch } = useSocket('wss://ws-live-data.polymarket.com');

    return monitor().pipe(
      filter(it => it == 'opened'),
      switchMap(() => send({ payload: { action: 'subscribe', subscriptions } })),
      switchMap(() => watch().pipe(map(it => it.payload as Message)))
    );
  }
);
