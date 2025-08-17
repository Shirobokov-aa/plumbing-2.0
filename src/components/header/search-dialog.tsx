import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
// import { X } from "lucide-react";
import { searchProducts } from "@/actions/catalog";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/catalog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
}

export default function SearchDialog({ isOpen, onClose, lang }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const { data } = await searchProducts(searchQuery, lang);
        setSearchResults(data);
      } catch (error) {
        console.error("Ошибка при поиске:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, lang]);

  const needsScroll = searchResults.length > 5;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogTitle asChild>
          <VisuallyHidden>Поиск товаров</VisuallyHidden>
        </DialogTitle>
        <div className="relative">
          <Input
            type="text"
            placeholder="Поиск по артикулу или названию..."
            className="w-full pr-10 py-6 text-lg border-0 rounded-none focus-visible:ring-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            {/* <X className="h-5 w-5 text-gray-500" /> */}
          </button>
        </div>

        <div className={`${needsScroll ? 'max-h-[400px]' : ''} overflow-y-auto p-4`}>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-4">
              {searchResults.map((product) => (
                <Link
                  key={product.id}
                  href={`/${lang}/catalog/${product.id}`}
                  className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={onClose}
                >
                  <div className="relative w-16 h-16 bg-gray-100 rounded">
                    <Image
                      src={typeof product.images[0] === "string" ? product.images[0] : product.images[0]?.url}
                      alt={product.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-500">Артикул: {product.article}</p>
                    <p className="text-sm font-medium mt-1">
                      {product.price.toLocaleString("ru-RU")} руб.
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : searchQuery.length >= 2 ? (
            <div className="text-center py-8 text-gray-500">
              Ничего не найдено
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
