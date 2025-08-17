"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDirections } from "@/actions/query";
import { DirectionData, createDirection, updateDirection, deleteDirection } from "@/actions/inserts";
import { toast } from "sonner";
import Image from "next/image";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Direction {
  id: number;
  title: string | null;
  description: string | null;
  imageBase64: string;
  link: string;
  order: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  lang?: string;
}

export default function DirectionsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [directions, setDirections] = useState<Direction[]>([]);
  const [currentLang, setCurrentLang] = useState("ru");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDirection, setEditingDirection] = useState<Direction | null>(null);
  const [formData, setFormData] = useState<DirectionData>({
    title: "",
    description: "",
    imageBase64: "",
    link: "",
    order: 0,
    lang: "ru",
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchDirections = useCallback(async () => {
    setLoading(true);
    try {
      const { items } = await getDirections(currentLang);
      setDirections((items || []).map(item => ({ ...item, lang: currentLang })));
    } catch (error) {
      console.error("Failed to fetch directions:", error);
      toast.error("Не удалось загрузить данные");
    } finally {
      setLoading(false);
    }
  }, [currentLang]);

  useEffect(() => {
    fetchDirections();
  }, [fetchDirections]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLanguageChange = (value: string) => {
    setCurrentLang(value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData((prev) => ({ ...prev, imageBase64: base64String }));
      setPreviewImage(base64String);
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      imageBase64: "",
      link: "",
      order: 0,
      lang: currentLang,
    });
    setPreviewImage(null);
    setEditingDirection(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (direction: Direction) => {
    setFormData({
      title: direction.title,
      description: direction.description,
      imageBase64: direction.imageBase64,
      link: direction.link,
      order: direction.order || 0,
      lang: direction.lang || currentLang,
    });
    setPreviewImage(direction.imageBase64);
    setEditingDirection(direction);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let result;
      if (editingDirection) {
        result = await updateDirection(editingDirection.id, formData);
      } else {
        result = await createDirection(formData);
      }

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(editingDirection ? "Направление обновлено" : "Направление создано");
        setIsDialogOpen(false);
        fetchDirections();
      }
    } catch (error) {
      console.error("Failed to save direction:", error);
      toast.error("Не удалось сохранить данные");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить это направление?")) return;

    try {
      const result = await deleteDirection(id, currentLang);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Направление удалено");
        fetchDirections();
      }
    } catch (error) {
      console.error("Failed to delete direction:", error);
      toast.error("Не удалось удалить направление");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Управление направлениями</h1>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить направление
        </Button>
      </div>

      <Tabs defaultValue="ru" onValueChange={handleLanguageChange}>
        <TabsList>
          <TabsTrigger value="ru">Русский</TabsTrigger>
          <TabsTrigger value="en">English</TabsTrigger>
        </TabsList>

        <TabsContent value="ru" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Список направлений</CardTitle>
              <CardDescription>
                Управление направлениями для русской версии сайта
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Загрузка...</div>
              ) : directions.length === 0 ? (
                <div className="text-center py-4">Нет направлений</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Заголовок</TableHead>
                      <TableHead>Ссылка</TableHead>
                      <TableHead>Порядок</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {directions.map((direction) => (
                      <TableRow key={direction.id}>
                        <TableCell>{direction.title}</TableCell>
                        <TableCell>{direction.link}</TableCell>
                        <TableCell>{direction.order}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(direction)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(direction.id)}
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
        </TabsContent>

        <TabsContent value="en" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Directions List</CardTitle>
              <CardDescription>
                Managing directions for the English version of the site
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : directions.length === 0 ? (
                <div className="text-center py-4">No directions</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Link</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {directions.map((direction) => (
                      <TableRow key={direction.id}>
                        <TableCell>{direction.title}</TableCell>
                        <TableCell>{direction.link}</TableCell>
                        <TableCell>{direction.order}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(direction)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(direction.id)}
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
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingDirection ? "Редактирование направления" : "Добавление направления"}
            </DialogTitle>
            <DialogDescription>
              {editingDirection
                ? "Измените информацию о направлении"
                : "Заполните информацию о новом направлении"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Заголовок
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Описание
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="link" className="text-right">
                  Ссылка
                </Label>
                <Input
                  id="link"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="order" className="text-right">
                  Порядок
                </Label>
                <Input
                  id="order"
                  name="order"
                  type="number"
                  value={formData.order}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">
                  Изображение
                </Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="col-span-3"
                />
              </div>
              {previewImage && (
                <div className="relative h-40 w-full overflow-hidden rounded-md">
                  <Image
                    src={previewImage}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={saving}>
                {saving ? "Сохранение..." : "Сохранить"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
