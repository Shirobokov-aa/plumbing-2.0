"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getHeroSection } from "@/actions/query";
import { HeroSectionData, updateHeroSection } from "@/actions/inserts";
import { toast } from "sonner";
import Image from "next/image";
import { compressImage } from "@/lib/utils";

export default function HeroSectionPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<HeroSectionData>({
    title: "",
    description: "",
    buttonText: "",
    imageBase64: "",
    lang: "ru",
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await getHeroSection(formData.lang);
        if (data) {
          setFormData({
            title: data.title,
            description: data.description || "",
            buttonText: data.buttonText || "",
            imageBase64: data.imageBase64,
            lang: data.lang,
          });
          setPreviewImage(data.imageBase64);
        }
      } catch (error) {
        console.error("Failed to fetch hero section:", error);
        toast.error("Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [formData.lang]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLanguageChange = (value: string) => {
    setFormData((prev) => ({ ...prev, lang: value }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.imageBase64) {
      toast.error("Изображение обязательно для загрузки");
      return;
    }

    setSaving(true);
    try {
      const result = await updateHeroSection(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Данные успешно сохранены");
      }
    } catch (error) {
      console.error("Failed to save hero section:", error);
      toast.error("Не удалось сохранить данные");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Редактирование Hero Section</h1>
      </div>

      {loading ? (
        <div className="text-center py-4">Загрузка...</div>
      ) : (
        <Tabs defaultValue="ru" onValueChange={handleLanguageChange}>
          <TabsList>
            <TabsTrigger value="ru">Русский</TabsTrigger>
            <TabsTrigger value="en">English</TabsTrigger>
          </TabsList>

          <TabsContent value="ru" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Основная информация</CardTitle>
                  <CardDescription>
                    Заполните информацию для главного баннера сайта
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 hidden">
                    <Label htmlFor="title">Заголовок</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Введите заголовок"
                    />
                  </div>

                  <div className="space-y-2 hidden">
                    <Label htmlFor="description">Описание</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Введите описание"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2 hidden">
                    <Label htmlFor="buttonText">Текст кнопки</Label>
                    <Input
                      id="buttonText"
                      name="buttonText"
                      value={formData.buttonText}
                      onChange={handleInputChange}
                      placeholder="Введите текст кнопки"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Изображение</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
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
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={saving}>
                    {saving ? "Сохранение..." : "Сохранить"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>

          <TabsContent value="en" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Main Information</CardTitle>
                  <CardDescription>
                    Fill in the information for the main banner of the site
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter description"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="buttonText">Button Text</Label>
                    <Input
                      id="buttonText"
                      name="buttonText"
                      value={formData.buttonText}
                      onChange={handleInputChange}
                      placeholder="Enter button text"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Image</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
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
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
