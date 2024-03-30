/**
 * TODO: This file should be generated of typings from the Open API Spec
 *
 *
 */

export type PayConfig = {
  provider: string;
  public_key: string;
  secret: string;
};

export type CreateSubscriptionResult = {
  client_secret: string;
};

export type Product = {
  id: number;
  name: string;
  is_recurring: boolean;
  product_type: string;
  enterprise_only: boolean;
  active: boolean;
};

export type GetProductListResult = {
  data: Product[];
};
