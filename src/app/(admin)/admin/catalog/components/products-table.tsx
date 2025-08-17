"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Search, Eye } from "lucide-react";
import { Product, ProductCategory } from "@/types/catalog";
import { deleteProduct } from "@/actions/catalog-admin";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProductsTableProps {
  products: Product[];
  categories: ProductCategory[];
  onRefresh: () => void; // Добавлена функция обновления списка после удаления
}

export function ProductsTable({ products, categories, onRefresh }: ProductsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Фильтрация товаров по поисковому запросу
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.article.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Функция для получения имени категории по ID
  const getCategoryName = (categoryId: number): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : `ID: ${categoryId}`;
  };

  // Функция для получения имени подкатегории по ID
  const getSubcategoryName = (subcategoryId: number | null): string => {
    if (!subcategoryId) return "Нет";
    const subcategory = categories.find(cat => cat.id === subcategoryId);
    return subcategory ? subcategory.name : `ID: ${subcategoryId}`;
  };

  // Функция для получения слага категории по ID
  const getCategorySlug = (categoryId: number): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.slug : "";
  };

  // Функция для получения слага подкатегории по ID
  const getSubcategorySlug = (subcategoryId: number | null): string => {
    if (!subcategoryId) return "";
    const subcategory = categories.find(cat => cat.id === subcategoryId);
    return subcategory ? subcategory.slug : "";
  };

  // Функция для открытия диалога подтверждения удаления
  const handleDeleteClick = (productId: number) => {
    setSelectedProductId(productId);
    setDeleteDialogOpen(true);
  };

  // Функция для подтверждения удаления продукта
  const handleConfirmDelete = async () => {
    if (selectedProductId === null) return;

    setIsDeleting(true);
    try {
      const result = await deleteProduct(selectedProductId);
      if (result.success) {
        toast.success("Товар успешно удален");
        onRefresh(); // Обновление списка продуктов
      } else {
        toast.error(result.error || "Ошибка при удалении товара");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Не удалось удалить товар");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedProductId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию или артикулу..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead className="w-[80px]">Изображение</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Артикул</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead>Подкатегория</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  Товары не найдены
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell>
                    {product.images && product.images[0] ? (
                      <div className="relative h-10 w-10">
                        <Image
                          src={typeof product.images[0] === "string" ? product.images[0] : product.images[0]?.url}
                          alt={product.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 bg-gray-100 rounded-md"></div>
                    )}
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.article}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {getCategoryName(product.categoryId)}
                      <span className="text-xs text-gray-500 ml-1">({getCategorySlug(product.categoryId)})</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {product.subcategoryId ? (
                      <Badge variant="secondary" className="font-normal">
                        {getSubcategoryName(product.subcategoryId)}
                        <span className="text-xs text-gray-500 ml-1">({getSubcategorySlug(product.subcategoryId)})</span>
                      </Badge>
                    ) : (
                      <span className="text-gray-500 text-sm">Нет</span>
                    )}
                  </TableCell>
                  <TableCell>{product.price.toLocaleString("ru-RU")} руб.</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.isActive ? 'Активен' : 'Скрыт'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/catalog/${product.id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Редактировать</span>
                        </Button>
                      </Link>
                      <Link href={`/${product.lang}/catalog/${product.id}`} target="_blank">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Просмотр</span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        onClick={() => handleDeleteClick(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Удалить</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Диалог подтверждения удаления */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Подтверждение удаления</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить этот товар? Это действие необратимо и приведет к удалению всех связанных данных (характеристики, цвета, технологии, документы).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Удаление..." : "Удалить"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
