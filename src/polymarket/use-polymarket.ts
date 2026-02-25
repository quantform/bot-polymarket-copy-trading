import { watchLiveData } from './watch-live-data';

export function usePolymarket() {
  return {
    name: 'polymarket',
    useRealTimeClient: watchLiveData
  };
}
