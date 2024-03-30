'use client';

import { useProducts } from './pay-context';

export function ProductForm() {
  const { data: list, loading } = useProducts();

  if (loading) {
    return <div>loading....</div>;
  }

  return (
    <div>
      <div>Product List</div>
      {list?.data?.length &&
        list.data.map((product) => (
          <div key={product.id}>
            <div>{product.name}</div>
            <div>Enterprise Only: {product.enterprise_only}</div>
          </div>
        ))}
    </div>
  );
}
