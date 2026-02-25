import { withRequest } from '@quantform/core';
import { map } from 'rxjs';
import z from 'zod';

const response = z.object({
  id: z.string(),
  question: z.string(),
  conditionId: z.string(),
  slug: z.string(),
  outcomes: z.preprocess(val => JSON.parse(val as any), z.array(z.string())),
  active: z.boolean(),
  closed: z.boolean(),
  enableOrderBook: z.boolean(),
  clobTokenIds: z.preprocess(val => JSON.parse(val as any), z.array(z.string())),
  endDate: z.preprocess(val => (typeof val === 'string' ? new Date(val) : val), z.date())
});

export function queryMarket(slug: string) {
  return withRequest({
    url: `https://gamma-api.polymarket.com/markets/slug/${slug}`,
    method: 'GET'
  }).pipe(map(it => response.parse(it.payload)));
}
