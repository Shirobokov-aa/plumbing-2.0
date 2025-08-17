"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getBrandHeroSection, getBrandContent } from "@/actions/query";
import { updateBrandHeroSection, updateBrandContent } from "@/actions/inserts";
import { toast } from "sonner";
import Image from "next/image";
import { BrandHeroSectionFormData, BrandContentFormData } from "@/types/types";

export default function BrandPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentLang, setCurrentLang] = useState("ru");
  const [heroFormData, setHeroFormData] = useState<BrandHeroSectionFormData>({
    imageBase64: "",
    lang: "ru",
  });
  const [contentFormData, setContentFormData] = useState<BrandContentFormData>({
    title: "",
    subtitle: "",
    description: "",
    lang: "ru",
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchData = async (lang: string) => {
    setLoading(true);
    try {
      const [heroResponse, contentResponse] = await Promise.all([
        getBrandHeroSection(lang),
        getBrandContent(lang),
      ]);

      if (heroResponse.data) {
        setHeroFormData({
          imageBase64: heroResponse.data.imageBase64,
          lang: lang,
        });
        setPreviewImage(heroResponse.data.imageBase64);
      }

      if (contentResponse.data) {
        setContentFormData({
          title: contentResponse.data.title,
          subtitle: contentResponse.data.subtitle,
          description: contentResponse.data.description,
          lang: lang,
        });
      }
    } catch (error) {
      console.error("Failed to fetch brand data:", error);
      toast.error("Не удалось загрузить данные");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentLang);
  }, [currentLang]);

  const handleContentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContentFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setHeroFormData((prev) => ({ ...prev, imageBase64: base64String }));
      setPreviewImage(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const result = await updateBrandHeroSection({
        ...heroFormData,
        lang: currentLang,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Данные баннера сохранены");
      }
    } catch (error) {
      console.error("Failed to save hero data:", error);
      toast.error("Не удалось сохранить данные баннера");
    } finally {
      setSaving(false);
    }
  };

  const handleContentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const result = await updateBrandContent({
        ...contentFormData,
        lang: currentLang,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Основной контент сохранен");
      }
    } catch (error) {
      console.error("Failed to save content data:", error);
      toast.error("Не удалось сохранить основной контент");
    } finally {
      setSaving(false);
    }
  };

  const renderHeroForm = (isEnglish = false) => (
    <Card>
      <CardHeader>
        <CardTitle>{isEnglish ? "Banner Settings" : "Настройки баннера"}</CardTitle>
        <CardDescription>
          {isEnglish ? "Manage banner content for English version" : "Управление контентом баннера для русской версии"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">{isEnglish ? "Loading..." : "Загрузка..."}</div>
        ) : (
          <form onSubmit={handleHeroSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image">{isEnglish ? "Banner Image" : "Изображение баннера"}</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            {previewImage && (
              <div className="relative h-[200px] w-full overflow-hidden rounded-md">
                <Image
                  src={previewImage}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <Button type="submit" disabled={saving}>
              {saving ? (isEnglish ? "Saving..." : "Сохранение...") : (isEnglish ? "Save" : "Сохранить")}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );

  const renderContentForm = (isEnglish = false) => (
    <Card>
      <CardHeader>
        <CardTitle>{isEnglish ? "Main Content" : "Основной контент"}</CardTitle>
        <CardDescription>
          {isEnglish ? "Manage main content for English version" : "Управление основным контентом для русской версии"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">{isEnglish ? "Loading..." : "Загрузка..."}</div>
        ) : (
          <form onSubmit={handleContentSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contentTitle">{isEnglish ? "Title" : "Заголовок"}</Label>
              <Input
                id="contentTitle"
                name="title"
                value={contentFormData.title}
                onChange={handleContentInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">{isEnglish ? "Subtitle" : "Подзаголовок"}</Label>
              <Input
                id="subtitle"
                name="subtitle"
                value={contentFormData.subtitle}
                onChange={handleContentInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contentDescription">{isEnglish ? "Description" : "Описание"}</Label>
              <Textarea
                id="contentDescription"
                name="description"
                value={contentFormData.description}
                onChange={handleContentInputChange}
                rows={8}
                required
              />
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? (isEnglish ? "Saving..." : "Сохранение...") : (isEnglish ? "Save" : "Сохранить")}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Управление страницей бренда</h1>
      </div>

      <Tabs defaultValue="ru" onValueChange={setCurrentLang}>
        <TabsList>
          <TabsTrigger value="ru">Русский</TabsTrigger>
          <TabsTrigger value="en">English</TabsTrigger>
        </TabsList>

        <TabsContent value="ru" className="space-y-4">
          {renderHeroForm()}
          {renderContentForm()}
        </TabsContent>

        <TabsContent value="en" className="space-y-4">
          {renderHeroForm(true)}
          {renderContentForm(true)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
