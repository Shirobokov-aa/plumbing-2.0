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
import { Edit, Trash2, Search } from "lucide-react";
import { ProductCategory } from "@/types/catalog";
import Link from "next/link";
import { toast } from "sonner";
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
import { deleteCategory } from "@/actions/catalog-admin";

interface CategoriesTableProps {
  categories: ProductCategory[];
  onRefresh: () => void; // Добавляем функцию обновления списка после удаления
}

export function CategoriesTable({ categories, onRefresh }: CategoriesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Фильтрация категорий по поисковому запросу
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Группировка категорий (родительские и дочерние)
  const parentCategories = filteredCategories.filter((category) => !category.parentId);
  const childCategories = filteredCategories.filter((category) => category.parentId);

  // Функция для получения имени родительской категории
  const getParentName = (parentId?: number) => {
    if (!parentId) return "-";
    const parent = categories.find((cat) => cat.id === parentId);
    return parent ? parent.name : `ID: ${parentId}`;
  };

  // Открытие диалога подтверждения удаления
  const handleDeleteClick = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setDeleteDialogOpen(true);
  };

  // Подтверждение удаления категории
  const handleConfirmDelete = async () => {
    if (selectedCategoryId === null) return;

    setIsDeleting(true);
    try {
      const result = await deleteCategory(selectedCategoryId);
      if (result.success) {
        toast.success("Категория успешно удалена");
        onRefresh();
      } else {
        toast.error(result.error || "Ошибка при удалении категории");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Не удалось удалить категорию");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedCategoryId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию или slug..."
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
              <TableHead>Название</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Родительская категория</TableHead>
              <TableHead>Порядок</TableHead>
              <TableHead>Язык</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Категории не найдены
                </TableCell>
              </TableRow>
            ) : (
              // Сначала выводим родительские категории, затем дочерние
              [...parentCategories, ...childCategories].map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.id}</TableCell>
                  <TableCell>
                    {category.parentId ? <span className="ml-4">↪ {category.name}</span> : category.name}
                  </TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell>{getParentName(category.parentId)}</TableCell>
                  <TableCell>{category.order}</TableCell>
                  <TableCell>{category.lang}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/catalog/categories/${category.id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Редактировать</span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        onClick={() => handleDeleteClick(category.id)}
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
              Вы уверены, что хотите удалить эту категорию? Это действие необратимо.
              Категорию можно удалить только если в ней нет товаров и подкатегорий.
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
