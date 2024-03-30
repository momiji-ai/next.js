'use client';

import { useState } from 'react';

function ContinueWithEmail({ onSSOClick }: { onSSOClick: () => void }) {
  return (
    <div>
      <form>
        <label htmlFor="momiji-email-input">Email</label>
        <input name="momiji-email-input" type="text" />
      </form>
      <div>
        You can also{' '}
        <button onClick={onSSOClick}>continue with Enterprise SSO</button>
      </div>
    </div>
  );
}

function ContinueWithSSO({ onEmailClick }: { onEmailClick: () => void }) {
  return (
    <div>
      <form>
        <label htmlFor="momiji-company-email-input">Company Email</label>
        <input name="momiji-company-email-input" type="text" />
      </form>
      <div>
        You can also <button onClick={onEmailClick}>continue with email</button>
      </div>
    </div>
  );
}

export default function EmailForm() {
  const [isSSO, setIsSSO] = useState(false);
  const handleSSOToggle = () => {
    setIsSSO((isSSO) => !isSSO);
  };

  if (isSSO) {
    return <ContinueWithSSO onEmailClick={handleSSOToggle} />;
  }
  return <ContinueWithEmail onSSOClick={handleSSOToggle} />;
}
