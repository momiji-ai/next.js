'use client';

import { useConfig } from '@/core/config/context';

export default function SocialLogin() {
  const config = useConfig();
  const continueWithGoogle = () => {
    const state = 'random-state';
    if (window) {
      window.location.href = `${config.authorizeEndpointURL}?client_id=${config.clientId}&provider_name=google-oauth&state=${state}`;
    }
    return;
  };

  const continueWithApple = () => {
    const state = 'random-state';
    if (window) {
      window.location.href = `${config.authorizeEndpointURL}?client_id=${config.clientId}&provider_name=apple&state=${state}`;
    }
    return;
  };
  return (
    <div>
      <button onClick={continueWithGoogle}>
        <div>Continue with Google</div>
      </button>
      <button onClick={continueWithApple}>
        <div>Continue with Apple</div>
      </button>
    </div>
  );
}
