"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCollectionById } from "@/actions/query";
import { updateCollection } from "@/actions/inserts";
import { toast } from "sonner";
import Image from "next/image";
import { compressImage } from "@/lib/utils";

interface ClientPageProps {
  params: { id: string };
}

export default function ClientPage({ params }: ClientPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentLang, setCurrentLang] = useState("ru");
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    imageBase64: "",
    heroImage: "",
    bannerImage: "",
    lang: "ru",
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewHeroImage, setPreviewHeroImage] = useState<string | null>(null);
  const [previewBannerImage, setPreviewBannerImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const { data } = await getCollectionById(parseInt(params.id), currentLang);
        if (data) {
          setFormData({
            name: data.name || "",
            slug: data.slug || "",
            description: data.description || "",
            imageBase64: data.imageBase64 || "",
            heroImage: data.heroImage || "",
            bannerImage: data.bannerImage || "",
            lang: currentLang,
          });
          setPreviewImage(data.imageBase64 || null);
          setPreviewHeroImage(data.heroImage || null);
          setPreviewBannerImage(data.bannerImage || null);
        }
      } catch (error) {
        console.error("Ошибка при загрузке коллекции:", error);
        toast.error("Не удалось загрузить данные коллекции");
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [params.id, currentLang]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'hero' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedFile = await compressImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        switch (type) {
          case 'main':
            setFormData((prev) => ({ ...prev, imageBase64: base64String }));
            setPreviewImage(base64String);
            break;
          case 'hero':
            setFormData((prev) => ({ ...prev, heroImage: base64String }));
            setPreviewHeroImage(base64String);
            break;
          case 'banner':
            setFormData((prev) => ({ ...prev, bannerImage: base64String }));
            setPreviewBannerImage(base64String);
            break;
        }
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Ошибка при обработке изображения');
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
      const result = await updateCollection(parseInt(params.id), formData);
      if (result.success) {
        toast.success("Коллекция успешно обновлена");
        router.push("/admin/collections");
      } else {
        toast.error(result.error || "Не удалось обновить коллекцию");
      }
    } catch (error) {
      console.error("Ошибка при обновлении коллекции:", error);
      toast.error("Не удалось обновить коллекцию");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Загрузка...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Редактирование коллекции</h1>
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
              <CardTitle>Редактирование коллекции</CardTitle>
              <CardDescription>
                Измените информацию о коллекции
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
                <Button type="submit" disabled={saving}>
                  {saving ? "Сохранение..." : "Сохранить изменения"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="en">
          <Card>
            <CardHeader>
              <CardTitle>Edit Collection</CardTitle>
              <CardDescription>
                Modify the collection information
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
                  <Label htmlFor="mainImage">Изображение для карточки коллекции</Label>
                  <Input
                    id="mainImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'main')}
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
                  <Label htmlFor="heroImage">Баннер детальной страницы</Label>
                  <Input
                    id="heroImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'hero')}
                  />
                  {previewHeroImage && (
                    <div className="mt-2 relative h-40 w-full overflow-hidden rounded-md">
                      <Image
                        src={previewHeroImage}
                        alt="Hero Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bannerImage">Banner &quot;Inspiration&quot;</Label>
                  <Input
                    id="bannerImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'banner')}
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
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
