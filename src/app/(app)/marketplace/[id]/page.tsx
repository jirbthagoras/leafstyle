import ProductDetail from "@/components/Marketplace/ProductDetail";
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  
  if (!resolvedParams?.id) {
    notFound();
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductDetail productId={resolvedParams.id} />
    </Suspense>
  );
} 