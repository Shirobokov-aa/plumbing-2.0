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
import { ProductColor } from "@/types/catalog";
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
import { deleteColor } from "@/actions/catalog-admin";

interface ColorsTableProps {
  colors: ProductColor[];
  onRefresh: () => void;
}

export function ColorsTable({ colors, onRefresh }: ColorsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Фильтрация цветов по поисковому запросу
  const filteredColors = colors.filter((color) =>
    color.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    color.suffix.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Открытие диалога подтверждения удаления
  const handleDeleteClick = (colorId: number) => {
    setSelectedColorId(colorId);
    setDeleteDialogOpen(true);
  };

  // Подтверждение удаления цвета
  const handleConfirmDelete = async () => {
    if (selectedColorId === null) return;

    setIsDeleting(true);
    try {
      const result = await deleteColor(selectedColorId);
      if (result.success) {
        toast.success("Цвет успешно удален");
        onRefresh();
      } else {
        toast.error(result.error || "Ошибка при удалении цвета");
      }
    } catch (error) {
      console.error("Error deleting color:", error);
      toast.error("Не удалось удалить цвет");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedColorId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию или суффиксу..."
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
              <TableHead className="w-[80px]">Образец</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Код цвета</TableHead>
              <TableHead>Суффикс</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredColors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Цвета не найдены
                </TableCell>
              </TableRow>
            ) : (
              filteredColors.map((color) => (
                <TableRow key={color.id}>
                  <TableCell className="font-medium">{color.id}</TableCell>
                  <TableCell>
                    <div
                      className="w-8 h-8 rounded-full border"
                      style={{ backgroundColor: color.code }}
                    ></div>
                  </TableCell>
                  <TableCell>{color.name}</TableCell>
                  <TableCell>{color.code}</TableCell>
                  <TableCell>{color.suffix}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Редактировать</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        onClick={() => handleDeleteClick(color.id)}
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
              Вы уверены, что хотите удалить этот цвет? Это действие необратимо.
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
