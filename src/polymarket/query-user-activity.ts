import { withRequest } from '@quantform/core';
import { expand, map, Observable, of, reduce } from 'rxjs';
import z from 'zod';

const response = z.array(
  z.object({
    proxyWallet: z.string(),
    timestamp: z.number(),
    conditionId: z.string(),
    type: z.string(),
    size: z.number(),
    usdcSize: z.number(),
    price: z.number(),
    asset: z.string(),
    side: z.string(),
    outcome: z.string()
  })
);

export function queryUserActivity(
  market: string,
  user: string,
  limit: number = 500
): Observable<z.output<typeof response>[]> {
  const fetchPage = (offset: number) =>
    withRequest({
      url: `https://data-api.polymarket.com/activity?market=${market}&user=${user}&limit=${limit}&offset=${offset}`,
      method: 'GET'
    }).pipe(map(it => response.parse(it.payload)));

  return fetchPage(0).pipe(
    expand((batch, i) => (batch.length < limit ? of() : fetchPage((i + 1) * limit))),
    reduce((acc, batch) => acc.concat(batch), [] as z.output<typeof response>[])
  );
}
