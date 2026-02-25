import { withMemo } from '@quantform/core';
import { filter, map, switchMap } from 'rxjs';
import { useSocket } from './use-socket';

export type Message = {
  event_type: string;
};

export type LastTradePriceEvent = {
  event_type: 'last_trade_price';
  market: string;
  asset_id: string;
};

export type BestBidAskEvent = {
  event_type: 'best_bid_ask';
  market: string;
  asset_id: string;
  best_bid: string;
  best_ask: string;
  timestamp: string;
};

export type MarketEvent = LastTradePriceEvent | BestBidAskEvent;

export const watchMarket = withMemo((assets: string[]) => {
  return useSocket('wss://ws-subscriptions-clob.polymarket.com/ws/market').pipe(
    switchMap(socket => {
      return socket.monitor().pipe(
        filter(it => it === 'opened'),
        switchMap(() =>
          socket.send({
            payload: {
              assets_ids: assets,
              type: 'market',
              custom_feature_enabled: true
            }
          })
        ),
        switchMap(() => socket.watch().pipe(map(it => it.payload as MarketEvent)))
      );
    })
  );
});
