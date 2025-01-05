import ProductDetail from "@/components/Marketplace/ProductDetail";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return <ProductDetail productId={params.id} />;
} 