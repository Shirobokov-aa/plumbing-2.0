"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCollection } from "@/actions/collections";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Image from "next/image";
import { compressImage } from "@/lib/utils";

export default function CreateCollectionPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    imageBase64: "",
    lang: "ru",
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedFile = await compressImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData((prev) => ({ ...prev, imageBase64: base64String }));
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Ошибка при обработке изображения');
    }
  };

  const handleLanguageChange = (value: string) => {
    setFormData((prev) => ({ ...prev, lang: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const result = await createCollection(formData);
      if (result.success) {
        toast.success("Коллекция успешно создана");
        router.push("/admin/collections");
      } else {
        toast.error(result.error || "Не удалось создать коллекцию");
      }
    } catch (error) {
      console.error("Ошибка при создании коллекции:", error);
      toast.error("Не удалось создать коллекцию");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Создание коллекции</h1>
        <Button variant="outline" onClick={() => router.push("/admin/collections")}>
          Назад к списку
        </Button>
      </div>

      <Tabs defaultValue="ru" onValueChange={handleLanguageChange}>
        <TabsList>
          <TabsTrigger value="ru">Русский</TabsTrigger>
          <TabsTrigger value="en">English</TabsTrigger>
        </TabsList>

        <TabsContent value="ru">
          <Card>
            <CardHeader>
              <CardTitle>Создание коллекции</CardTitle>
              <CardDescription>
                Заполните информацию о новой коллекции
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Название</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL-slug</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Изображение</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {previewImage && (
                    <div className="mt-2 relative h-40 w-full overflow-hidden rounded-md">
                      <Image
                        src={previewImage}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                <Button type="submit" disabled={saving}>
                  {saving ? "Сохранение..." : "Создать коллекцию"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="en">
          <Card>
            <CardHeader>
              <CardTitle>Create Collection</CardTitle>
              <CardDescription>
                Fill in the information about the new collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL-slug</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {previewImage && (
                    <div className="mt-2 relative h-40 w-full overflow-hidden rounded-md">
                      <Image
                        src={previewImage}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Create Collection"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
