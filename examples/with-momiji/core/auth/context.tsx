'use client';

import { useSearchParams } from 'next/navigation';
import { PropsWithChildren, createContext, useEffect, useMemo } from 'react';
import { useConfig } from '../config/context';

// const clientId = '7f2f74e6-5eaf-4d05-93b8-1a1b9ea2d9b7' // TODO: read from build time config
// const tokenEndpointUrl = 'http://localhost:8000/v1/token' // TODO: read from build time config
const state = 'random-state'; // TODO: read from browser cookie storage
const providerName = 'google-oauth'; // TODO: read from browser cookie storage
const AuthRouterContext = createContext({});
type Props = PropsWithChildren<{
  allowRedirect: boolean;
}>;
export function AuthRouter({ children, allowRedirect = false }: Props) {
  const { tokenEndpointURL, clientId } = useConfig();

  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  const tokenUrl = useMemo(() => {
    if (!code) {
      return null;
    }

    const url = new URL(tokenEndpointURL);
    url.searchParams.append('code', code);
    url.searchParams.append('client_id', clientId);
    url.searchParams.append('state', state);
    url.searchParams.append('provider_name', providerName);
    return url.toString();
  }, [clientId, code, tokenEndpointURL]);

  useEffect(() => {
    console.log({ tokenUrl });
    if (!tokenUrl) {
      return;
    }

    if (!allowRedirect) {
      fetch(tokenUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        const payload = response.json();
        console.log({ payload });
      });
      return;
    }

    window.location.href = tokenUrl;
  }, [tokenUrl, allowRedirect]);
  return (
    <AuthRouterContext.Provider value={{}}>
      {children}
    </AuthRouterContext.Provider>
  );
}

export default AuthRouterContext;
