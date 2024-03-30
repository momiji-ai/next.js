import { type Data } from '@momiji/network';
import { useEffect, useRef, useState } from 'react';
import { filter } from 'rxjs';

import { useNetwork } from './context';

export type UseRemoteData<T, E extends Error> = {
  data: T | null;
  error: E | null;
  loading: boolean;
};
type Callback<T, E extends Error> = (data: Data<T, E>) => void;
export function useRemoteData<T, E extends Error>(
  key: string,
  callback?: Callback<T, E>,
): UseRemoteData<T, E> {
  const { network } = useNetwork();
  const isQueued = network?.isQueued(key);
  const callbackRef = useRef<Callback<T, E>>();

  const [loading, setLoading] = useState(isQueued || false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const sub = network?.onLoading
      .pipe(filter((_key) => _key === key))
      .subscribe(() => setLoading(true));

    return () => {
      sub?.unsubscribe();
    };
  }, [key, network?.onLoading]);

  useEffect(() => {
    const sub = network?.onResponse
      .pipe(filter((data) => data.key === key))
      .subscribe((data) => {
        callbackRef.current?.(data as Data<T, E>);
        setLoading(false);
        console.log(data.result);
        setError(data.error as E);
        setData(data.result as T);
      });
    return () => {
      sub?.unsubscribe();
    };
  }, [key, network?.onResponse]);

  return {
    loading,
    data,
    error,
  };
}
