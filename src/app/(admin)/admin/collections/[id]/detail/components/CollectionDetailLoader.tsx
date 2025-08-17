"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCollectionPage } from "@/actions/query";
import { upsertCollectionPage } from "@/actions/inserts";
import { toast } from "sonner";
import Image from "next/image";
import { CollectionSection } from "@/types/types";
import { compressImage } from "@/lib/utils";

interface CollectionDetailLoaderProps {
  id: string;
}

interface CollectionPageFormData {
  title: string;
  description: string;
  subTitle: string;
  heroImage: string;
  bannerImage?: string;
  content: {
    sections: CollectionSection[];
  };
  lang: string;
}

export function CollectionDetailLoader({ id }: CollectionDetailLoaderProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentLang, setCurrentLang] = useState("ru");
  const [formData, setFormData] = useState<CollectionPageFormData>({
    title: "",
    description: "",
    subTitle: "",
    heroImage: "",
    bannerImage: "",
    content: {
      sections: []
    },
    lang: "ru",
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewBannerImage, setPreviewBannerImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollectionPage = async () => {
      try {
        const { data } = await getCollectionPage(parseInt(id), currentLang);
        if (data) {
          setFormData({
            title: data.title || "",
            description: data.description || "",
            subTitle: data.subTitle || "",
            heroImage: data.heroImage || "",
            bannerImage: data.bannerImage || "",
            content: data.content || { sections: [] },
            lang: currentLang,
          });
          setPreviewImage(data.heroImage || null);
          setPreviewBannerImage(data.bannerImage || null);
        }
      } catch (error) {
        console.error("Ошибка при загрузке страницы коллекции:", error);
        toast.error("Не удалось загрузить данные страницы коллекции");
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionPage();
  }, [id, currentLang]);

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
        setFormData((prev) => ({ ...prev, heroImage: base64String }));
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Error processing hero image:', error);
      toast.error('Ошибка при обработке изображения баннера');
    }
  };

  const handleBannerImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedFile = await compressImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData((prev) => ({ ...prev, bannerImage: base64String }));
        setPreviewBannerImage(base64String);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Error processing banner image:', error);
      toast.error('Ошибка при обработке изображения баннера');
    }
  };

  const handleLanguageChange = (value: string) => {
    setCurrentLang(value);
    setFormData((prev) => ({ ...prev, lang: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const result = await upsertCollectionPage(parseInt(id), formData);

      if (result.success) {
        toast.success("Страница коллекции успешно обновлена");
        router.push("/admin/collections");
      } else {
        toast.error(result.error || "Не удалось обновить страницу коллекции");
      }
    } catch (error) {
      console.error("Ошибка при обновлении страницы коллекции:", error);
      toast.error("Не удалось обновить страницу коллекции");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Загрузка...</div>;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Редактирование детальной страницы коллекции</h1>
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
              <CardTitle>Редактирование детальной страницы</CardTitle>
              <CardDescription>
                Измените информацию для детальной страницы коллекции
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Заголовок</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subTitle">Подзаголовок</Label>
                  <Input
                    id="subTitle"
                    name="subTitle"
                    value={formData.subTitle}
                    onChange={handleInputChange}
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
                  <Label htmlFor="heroImage">Баннер коллекции</Label>
                  <Input
                    id="heroImage"
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

                <div className="space-y-2">
                  <Label htmlFor="bannerImage">Баннер для секции &ldquo;Вдохновение&rdquo;</Label>
                  <Input
                    id="bannerImage"
                    type="file"
                    accept="image/*"
                    onChange={handleBannerImageChange}
                  />
                  {previewBannerImage && (
                    <div className="mt-2 relative h-40 w-full overflow-hidden rounded-md">
                      <Image
                        src={previewBannerImage}
                        alt="Banner Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                <Button type="submit" disabled={saving}>
                  {saving ? "Сохранение..." : "Сохранить"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="en">
          <Card>
            <CardHeader>
              <CardTitle>Edit Collection Page</CardTitle>
              <CardDescription>
                Modify information for the collection detail page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subTitle">Subtitle</Label>
                  <Input
                    id="subTitle"
                    name="subTitle"
                    value={formData.subTitle}
                    onChange={handleInputChange}
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
                  <Label htmlFor="heroImage">Collection Banner</Label>
                  <Input
                    id="heroImage"
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

                <div className="space-y-2">
                  <Label htmlFor="bannerImage">Inspiration Section Banner</Label>
                  <Input
                    id="bannerImage"
                    type="file"
                    accept="image/*"
                    onChange={handleBannerImageChange}
                  />
                  {previewBannerImage && (
                    <div className="mt-2 relative h-40 w-full overflow-hidden rounded-md">
                      <Image
                        src={previewBannerImage}
                        alt="Banner Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
