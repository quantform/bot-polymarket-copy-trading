import { watchRealTimeData } from './watch-real-time-data';

export function usePolymarket() {
  return {
    name: 'polymarket',
    useRealTimeClient: watchRealTimeData
  };
}
