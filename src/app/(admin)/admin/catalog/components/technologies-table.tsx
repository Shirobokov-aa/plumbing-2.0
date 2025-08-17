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
import { Edit, Trash2, Search, Eye } from "lucide-react";
import { ProductTechnology } from "@/types/catalog";
import { toast } from "sonner";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { deleteTechnology } from "@/actions/catalog-admin";
import { EditTechnologyDialog } from "./edit-technology-dialog";

interface TechnologiesTableProps {
  technologies: ProductTechnology[];
  onRefresh: () => void;
}

export function TechnologiesTable({ technologies, onRefresh }: TechnologiesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTech, setSelectedTech] = useState<ProductTechnology | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Фильтрация технологий по поисковому запросу
  const filteredTechnologies = technologies.filter((tech) =>
    tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Открытие диалога подтверждения удаления
  const handleDeleteClick = (tech: ProductTechnology) => {
    setSelectedTech(tech);
    setDeleteDialogOpen(true);
  };

  // Открытие диалога предпросмотра технологии
  const handlePreviewClick = (tech: ProductTechnology) => {
    setSelectedTech(tech);
    setPreviewDialogOpen(true);
  };

  // Открытие диалога редактирования технологии
  const handleEditClick = (tech: ProductTechnology) => {
    setSelectedTech(tech);
    setEditDialogOpen(true);
  };

  // Подтверждение удаления технологии
  const handleConfirmDelete = async () => {
    if (!selectedTech) return;

    setIsDeleting(true);
    try {
      const result = await deleteTechnology(selectedTech.id);
      if (result.success) {
        toast.success("Технология успешно удалена");
        onRefresh();
      } else {
        toast.error(result.error || "Ошибка при удалении технологии");
      }
    } catch (error) {
      console.error("Error deleting technology:", error);
      toast.error("Не удалось удалить технологию");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedTech(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию или заголовку..."
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
              <TableHead className="w-[80px]">Иконка</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Заголовок</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTechnologies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Технологии не найдены
                </TableCell>
              </TableRow>
            ) : (
              filteredTechnologies.map((tech) => (
                <TableRow key={tech.id}>
                  <TableCell className="font-medium">{tech.id}</TableCell>
                  <TableCell>
                    <div className="relative h-10 w-10">
                      <Image
                        src={tech.icon || "/placeholder.svg?height=40&width=40"}
                        alt={tech.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </TableCell>
                  <TableCell>{tech.name}</TableCell>
                  <TableCell>{tech.title}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handlePreviewClick(tech)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Просмотр</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(tech)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Редактировать</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        onClick={() => handleDeleteClick(tech)}
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
              Вы уверены, что хотите удалить технологию &quot;{selectedTech?.name}&quot;? Это действие необратимо.
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

      {/* Диалог просмотра технологии */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedTech && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedTech.name}</DialogTitle>
                <DialogDescription>
                  {selectedTech.title}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex justify-center">
                  <div className="relative h-32 w-32">
                    <Image
                      src={selectedTech.icon || "/placeholder.svg?height=128&width=128"}
                      alt={selectedTech.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                {selectedTech.description && (
                  <div className="border rounded-md p-4">
                    <p className="text-sm">{selectedTech.description}</p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button onClick={() => setPreviewDialogOpen(false)}>
                  Закрыть
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Диалог редактирования технологии */}
      <EditTechnologyDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={() => {
          setEditDialogOpen(false);
          onRefresh();
        }}
        technology={selectedTech}
      />
    </div>
  );
}
