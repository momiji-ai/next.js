'use client';

import { PropsWithChildren, createContext, useContext, useEffect } from 'react';

import { GetProductListResult, PayConfig } from '@/generated-types';
import { type UseRemoteData, useRemoteData } from '@/core/network/use-remote';
import { useNetwork } from '@/core/network/context';

type UsePay = {
  payConfigData: UseRemoteData<PayConfig, Error>;
  productsData: UseRemoteData<GetProductListResult, Error>;
};
const PayContext = createContext({} as UsePay);
export function PayProvider({ children }: PropsWithChildren) {
  const { network } = useNetwork();
  const payConfigData = useRemoteData<PayConfig, Error>('getPayConfig');
  const productsData = useRemoteData<GetProductListResult, Error>(
    'getProducts',
  );

  useEffect(() => {
    network?.sendRequest({
      key: 'getPayConfig',
      url: 'http://localhost:8004/v1/config',
      method: 'GET',
    });

    network?.sendRequest({
      key: 'getProducts',
      url: 'http://localhost:8005/v1/products',
      method: 'GET',
    });
  }, [network]);

  return (
    <PayContext.Provider
      value={{
        payConfigData,
        productsData,
      }}
    >
      {children}
    </PayContext.Provider>
  );
}

export function usePayConfig(): UseRemoteData<PayConfig, Error> {
  const context = useContext(PayContext);
  if (!context) {
    throw new Error('usePayConfig should be used under <PayProvider />');
  }

  return context.payConfigData;
}

export function useProducts(): UseRemoteData<GetProductListResult, Error> {
  const context = useContext(PayContext);
  if (!context) {
    throw new Error('useProducts should be used under <PayProvider />');
  }

  return context.productsData;
}
