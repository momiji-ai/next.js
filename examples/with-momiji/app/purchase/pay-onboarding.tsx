'use client';

import { PayForm } from './pay-form';
import { ProductForm } from './product-form';

export function PayOnboarding() {
  return (
    <div>
      <ProductForm />
      <PayForm />
    </div>
  );
}
