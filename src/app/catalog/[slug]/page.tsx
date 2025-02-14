import { getProductBySlug } from "@/app/actions/catalog";
import { ProductGallery } from "../components/ProductGallery";
import { ProductVariants } from "../components/ProductVariants";
import { ProductSpecifications } from "../components/ProductSpecifications";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <Header defaultTextColor="text-black" activeTextColor="text-black" />
      <div className="container mx-auto px-4 py-8 mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProductGallery images={product.images || []} productName={product.name} />
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            {product.article && <p className="text-gray-500 mt-2">Артикул: {product.article}</p>}

            {product.description && (
              <div className="prose max-w-none">
                <p>{product.description}</p>
              </div>
            )}

            {product.variants.length > 0 && <ProductVariants variants={product.variants} />}

            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <ProductSpecifications specifications={product.specifications} />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
