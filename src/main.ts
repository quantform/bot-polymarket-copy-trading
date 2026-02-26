import * as dotenv from 'dotenv';
import { catchError, lastValueFrom, of } from 'rxjs';
import { useStrategy } from './use-strategy';
import { ConsoleLoggerFactory, core, logger, Module } from '@quantform/core';
import { options } from './use-options';

export async function main() {
  dotenv.config();

  const module = new Module([
    ...core(),
    logger(new ConsoleLoggerFactory()),
    options({
      leaderProxyWalletAddress: process.env['LEADER_PROXY_WALLET_ADDRESS']!
    })
  ]);

  const { act } = await module.awake();

  await act(() => {
    return lastValueFrom(
      useStrategy().pipe(
        catchError(error => {
          console.log(error);

          return of(error);
        })
      )
    );
  });
}

main();
