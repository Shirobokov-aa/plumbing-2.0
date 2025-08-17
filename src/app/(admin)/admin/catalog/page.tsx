"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { getProducts, getProductCategories, getProductColors, getProductTechnologies, getCollections, getProductsByCollectionId } from "@/actions/catalog";
import { ProductsTable } from "./components/products-table";
import { CategoriesTable } from "./components/categories-table";
import { AddProductDialog } from "./components/add-product-dialog";
import { AddCategoryDialog } from "./components/add-category-dialog";
import { AddColorDialog } from "./components/add-color-dialog";
import { AddTechnologyDialog } from "./components/add-technology-dialog";
import { AddCollectionDialog } from "./components/add-collection-dialog";
import { Product, ProductCategory, ProductColor, ProductTechnology, Collection } from "@/types/catalog";
import { ColorsTable } from "./components/colors-table";
import { TechnologiesTable } from "./components/technologies-table";
import { CollectionsTable, CollectionProductsTable } from "./components/collections-table";

export default function CatalogPage() {
  const [showAddProductDialog, setShowAddProductDialog] = useState(false);
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
  const [showAddColorDialog, setShowAddColorDialog] = useState(false);
  const [showAddTechnologyDialog, setShowAddTechnologyDialog] = useState(false);
  const [showAddCollectionDialog, setShowAddCollectionDialog] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [colors, setColors] = useState<ProductColor[]>([]);
  const [technologies, setTechnologies] = useState<ProductTechnology[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  // Состояния для коллекций
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | null>(null);
  const [collectionProducts, setCollectionProducts] = useState<Product[]>([]);

  // Функция для загрузки данных
  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        { products: productsData },
        { data: categoriesData },
        { data: colorsData },
        { data: technologiesData },
        { data: collectionsData }
      ] = await Promise.all([
        getProducts({ limit: 1000 }),
        getProductCategories(),
        getProductColors(),
        getProductTechnologies(),
        getCollections()
      ]);

      setProducts(productsData || []);
      setCategories(categoriesData || []);
      setColors(colorsData || []);
      setTechnologies(technologiesData || []);
      setCollections(collectionsData || []);
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    fetchData();
  }, []);

  // Обработчики для открытия/закрытия диалогов
  const handleOpenAddProductDialog = () => setShowAddProductDialog(true);
  const handleCloseAddProductDialog = () => setShowAddProductDialog(false);
  const handleOpenAddCategoryDialog = () => setShowAddCategoryDialog(true);
  const handleCloseAddCategoryDialog = () => setShowAddCategoryDialog(false);
  const handleOpenAddColorDialog = () => setShowAddColorDialog(true);
  const handleCloseAddColorDialog = () => setShowAddColorDialog(false);
  const handleOpenAddTechnologyDialog = () => setShowAddTechnologyDialog(true);
  const handleCloseAddTechnologyDialog = () => setShowAddTechnologyDialog(false);
  const handleOpenAddCollectionDialog = () => setShowAddCollectionDialog(true);
  const handleCloseAddCollectionDialog = () => setShowAddCollectionDialog(false);

  // Обработчики для успешного добавления
  const handleProductAdded = () => {
    fetchData();
    handleCloseAddProductDialog();
  };

  const handleCategoryAdded = () => {
    fetchData();
    handleCloseAddCategoryDialog();
  };

  const handleColorAdded = () => {
    fetchData();
    handleCloseAddColorDialog();
  };

  const handleTechnologyAdded = () => {
    fetchData();
    handleCloseAddTechnologyDialog();
  };

  const handleCollectionAdded = () => {
    fetchData();
    handleCloseAddCollectionDialog();
  };

  // Функция для загрузки товаров конкретной коллекции
  const handleSelectCollection = async (collectionId: number) => {
    try {
      const { data } = await getProductsByCollectionId(collectionId);
      setCollectionProducts((data || []).map(product => ({
        ...product,
        images: product.images || [],
        featured: product.featured ?? false,
        isActive: product.isActive ?? false,
      })));
      setSelectedCollectionId(collectionId);
    } catch (error) {
      console.error(`Ошибка при загрузке товаров коллекции ${collectionId}:`, error);
    }
  };

  // Обработчик возврата к списку коллекций
  const handleBackToCollections = () => {
    setSelectedCollectionId(null);
    setCollectionProducts([]);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Управление каталогом</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleOpenAddProductDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить товар
          </Button>
        </div>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Товары</TabsTrigger>
          <TabsTrigger value="categories">Категории</TabsTrigger>
          <TabsTrigger value="colors">Цвета</TabsTrigger>
          <TabsTrigger value="technologies">Технологии</TabsTrigger>
          <TabsTrigger value="collections">Коллекции</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          {loading ? (
            <div>Загрузка...</div>
          ) : (
            <ProductsTable products={products} categories={categories} onRefresh={fetchData} />
          )}
          <div className="flex justify-end">
            <Button onClick={handleOpenAddProductDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить товар
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          {loading ? <div>Загрузка...</div> : <CategoriesTable categories={categories} onRefresh={fetchData} />}
          <div className="flex justify-end">
            <Button onClick={handleOpenAddCategoryDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить категорию
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="colors" className="space-y-4">
          {loading ? <div>Загрузка...</div> : <ColorsTable colors={colors} onRefresh={fetchData} />}
          <div className="flex justify-end">
            <Button onClick={handleOpenAddColorDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить цвет
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="technologies" className="space-y-4">
          {loading ? <div>Загрузка...</div> : <TechnologiesTable technologies={technologies} onRefresh={fetchData} />}
          <div className="flex justify-end">
            <Button onClick={handleOpenAddTechnologyDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить технологию
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="collections" className="space-y-4">
          {loading ? (
            <div>Загрузка...</div>
          ) : selectedCollectionId ? (
            <CollectionProductsTable
              products={collectionProducts}
              collectionInfo={
                collections.find((c) => c.id === selectedCollectionId)
                  ? {
                      id: selectedCollectionId,
                      name: collections.find((c) => c.id === selectedCollectionId)?.name || "",
                    }
                  : null
              }
              onBack={handleBackToCollections}
            />
          ) : (
            <>
              <CollectionsTable collections={collections} onSelect={handleSelectCollection} onRefresh={fetchData} />
              <div className="flex justify-end">
                <Button onClick={handleOpenAddCollectionDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить коллекцию
                </Button>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Модальные окна для добавления */}
      <AddProductDialog
        open={showAddProductDialog}
        onOpenChange={setShowAddProductDialog}
        onSuccess={handleProductAdded}
        categories={categories}
        colors={colors}
        technologies={technologies}
        collections={collections}
      />

      <AddCategoryDialog
        open={showAddCategoryDialog}
        onOpenChange={setShowAddCategoryDialog}
        onSuccess={handleCategoryAdded}
        categories={categories}
      />

      <AddColorDialog
        open={showAddColorDialog}
        onOpenChange={setShowAddColorDialog}
        onSuccess={handleColorAdded}
      />

      <AddTechnologyDialog
        open={showAddTechnologyDialog}
        onOpenChange={setShowAddTechnologyDialog}
        onSuccess={handleTechnologyAdded}
      />

      <AddCollectionDialog
        open={showAddCollectionDialog}
        onOpenChange={setShowAddCollectionDialog}
        onSuccess={handleCollectionAdded}
      />
    </div>
  );
}
