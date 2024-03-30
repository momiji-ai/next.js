'use client';

import { CreateSubscriptionResult, PayConfig } from '@/generated-types';
import { Data } from '@momiji/network';

export async function getPayConfig(key = 'getPayConfig') {
  const response = await fetch('http://localhost:8004/v1/config', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const data: Data<PayConfig, Error> = {
    key,
    result: null,
    error: null,
  };

  const result = await response.json();
  if (!response.ok) {
    data.error = result;
    return data;
  }

  data.result = result;
  return data;
}

export async function createSubscription(key = 'getPayConfig') {
  const response = await fetch(
    'http://localhost:8004/v1/stripe/subscriptions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            price_id: 'price_1OcfgTIHvhsF0iJ2HnLB2TZS',
            quantity: 1,
          },
        ],
      }),
    },
  );

  const data: Data<CreateSubscriptionResult, Error> = {
    key,
    result: null,
    error: null,
  };

  const result = await response.json();
  if (!response.ok) {
    data.error = result;
    return data;
  }

  data.result = result;
  return data;
}
