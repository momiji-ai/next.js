'use client';

import React, { useMemo, useState } from 'react';
import { loadStripe, Stripe, StripeElementsOptions } from '@stripe/stripe-js';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { createSubscription } from './data';
import { usePayConfig } from './pay-context';

function useStripeOptions(amount = 0, currency = 'usd'): StripeElementsOptions {
  return useMemo(() => {
    const options: StripeElementsOptions = {
      mode: 'subscription',
      setupFutureUsage: 'off_session',
      loader: 'never',
      amount,
      currency,
    };

    return options;
  }, [amount, currency]);
}

function useStripePromise(public_key?: string): Promise<Stripe | null> | null {
  return useMemo(() => {
    if (public_key) {
      return loadStripe(public_key);
    }

    return null;
  }, [public_key]);
}

function Form() {
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setSubmitting(true);

    if (stripe == null) {
      setSubmitting(false);
      return;
    }
    if (elements == null) {
      setSubmitting(false);
      return;
    }

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      // Show error to your customer
      setErrorMessage(submitError.message);
      setSubmitting(false);
      return;
    }

    const payload = await createSubscription();
    if (payload.error) {
      setErrorMessage(payload.error.message);
      setSubmitting(false);
      return;
    }

    if (!payload.result?.client_secret) {
      setErrorMessage('Failed to create a subscription');
      setSubmitting(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret: payload.result.client_secret,
      confirmParams: {
        return_url: 'http://localhost:3000/login',
      },
      redirect: 'if_required',
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
      const response = await fetch(
        'http://localhost:8004/v1/stripe/subscriptions/validate',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          redirect: 'manual',
        },
      );

      if (response.type === 'opaqueredirect') {
        window.location.href = response.url;
      }

      if (response.status >= 400) {
        const message = await response.json();
        setErrorMessage(message);
      }
    }

    setSubmitting(false);
  };

  const handleReady = () => {
    setReady(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement onReady={handleReady} />
      {ready && (
        <button type="submit" disabled={!stripe || !elements || submitting}>
          Pay
        </button>
      )}
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
}

export function PayForm() {
  const { data: payConfig, loading: configLoading } = usePayConfig();
  const options = useStripeOptions();
  const stripePromise = useStripePromise(payConfig?.secret);
  const loading = !payConfig || configLoading;

  return (
    <Elements stripe={stripePromise} options={options}>
      {loading && <div>Loading...</div>}
      {!loading && <Form />}
    </Elements>
  );
}
