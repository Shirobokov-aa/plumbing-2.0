"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { getCollections, deleteCollection } from "@/actions/collections";
import { Collection } from "@/types/types";
import { toast } from "sonner";

export default function CollectionsPage() {
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCollections() {
      try {
        const collectionsResult = await getCollections();
        setCollections(collectionsResult.success && collectionsResult.data ? collectionsResult.data : []);
      } catch (error) {
        console.error("Ошибка при загрузке коллекций:", error);
        toast.error("Не удалось загрузить коллекции");
      } finally {
        setLoading(false);
      }
    }

    fetchCollections();
  }, []);

  const handleEdit = (id: number) => {
    router.push(`/admin/collections/${id}`);
  };

  const handleEditDetail = (id: number) => {
    router.push(`/admin/collections/${id}/detail`);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить эту коллекцию?")) return;

    try {
      const result = await deleteCollection(id);
      if (result.success) {
        toast.success("Коллекция успешно удалена");
        // Обновляем список коллекций
        const collectionsResult = await getCollections();
        setCollections(collectionsResult.success && collectionsResult.data ? collectionsResult.data : []);
      } else {
        toast.error(result.error || "Не удалось удалить коллекцию");
      }
    } catch (error) {
      console.error("Ошибка при удалении коллекции:", error);
      toast.error("Не удалось удалить коллекцию");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Управление коллекциями</h1>
        <Button onClick={() => router.push("/admin/collections/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Создать коллекцию
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список коллекций</CardTitle>
          <CardDescription>
            Управление коллекциями сантехники
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Загрузка коллекций...</div>
          ) : collections.length === 0 ? (
            <div className="text-center py-4">Нет коллекций</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Описание</TableHead>
                  <TableHead>Дата создания</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collections.map((collection) => (
                  <TableRow key={collection.id}>
                    <TableCell>{collection.name}</TableCell>
                    <TableCell>{collection.slug}</TableCell>
                    <TableCell>{collection.description || "-"}</TableCell>
                    <TableCell>
                      {collection.createdAt ? new Date(collection.createdAt).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(collection.id)}
                        title="Редактировать основную информацию"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditDetail(collection.id)}
                        title="Редактировать детальную страницу"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(collection.id)}
                        title="Удалить коллекцию"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
