"use client";

import { ProductWithDetails } from "@/types/catalog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductDetailTabsProps {
  product: ProductWithDetails;
  lang: string;
}

export function ProductDetailTabs({ product }: ProductDetailTabsProps) {
  const hasCharacteristics = product.characteristics && product.characteristics.length > 0;
  const hasDocuments = product.documents && product.documents.length > 0;
  const hasTechnologies = product.technologies && product.technologies.length > 0;
  const hasCollection = product.collection || product.crossCollection;

  // Определяем вкладку по умолчанию (первая вкладка, которая имеет содержимое)
  const defaultTab = hasCharacteristics
    ? "characteristics"
    : hasDocuments
    ? "documents"
    : hasTechnologies
    ? "technologies"
    : hasCollection
    ? "collection"
    : null;

  if (!defaultTab) {
    return null; // Если нет информации для отображения, не показываем табы
  }

  return (
    <Tabs defaultValue={defaultTab} className="mt-10">
      <TabsList className="border-b w-full justify-start rounded-none mb-6">
        {hasCharacteristics && (
          <TabsTrigger value="characteristics">
            Характеристики
          </TabsTrigger>
        )}

        {hasDocuments && (
          <TabsTrigger value="documents">
            Документация
          </TabsTrigger>
        )}

        {hasTechnologies && (
          <TabsTrigger value="technologies">
            Технологии
          </TabsTrigger>
        )}
      </TabsList>

      {hasCharacteristics && (
        <TabsContent value="characteristics">
          <div className="space-y-4">
            <h3 className="text-xl font-medium mb-4">Характеристики</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.characteristics?.map((char) => (
                <div key={char.id} className="flex border-b pb-2">
                  <div className="font-medium w-1/2">{char.name}</div>
                  <div className="w-1/2">{char.value}</div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      )}

      {hasDocuments && (
        <TabsContent value="documents">
          <div className="space-y-4">
            <h3 className="text-xl font-medium mb-4">Документация</h3>
            <div className="space-y-2">
              {product.documents?.map((doc) => (
                <div key={doc.id} className="flex items-center p-3 border rounded">
                  <div className="flex-1">
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-gray-500">
                      {(doc.fileSize / 1024 / 1024).toFixed(2)} МБ
                    </p>
                  </div>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded transition-colors"
                  >
                    Скачать
                  </a>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      )}

      {hasTechnologies && (
        <TabsContent value="technologies">
          <div className="space-y-4">
            <h3 className="text-xl font-medium mb-4">Технологии</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.technologies?.map((tech) => (
                <div key={tech.id} className="p-4 border rounded flex">
                  {tech.icon && (
                    <div className="mr-4 flex-shrink-0">
                      <div
                        className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full"
                        dangerouslySetInnerHTML={{ __html: tech.icon }}
                      />
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium">{tech.title}</h4>
                    {tech.description && (
                      <p className="text-sm text-gray-600 mt-1">{tech.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      )}
    </Tabs>
  );
}
