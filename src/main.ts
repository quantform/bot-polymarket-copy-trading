import * as dotenv from 'dotenv';
import { catchError, lastValueFrom, of } from 'rxjs';
import { useStrategy } from './use-strategy';
import { ConsoleLoggerFactory, core, logger, Module } from '@quantform/core';

export async function main() {
  dotenv.config();

  const module = new Module([...core(), logger(new ConsoleLoggerFactory())]);

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
