"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createCollection } from "@/actions/catalog";
import { convertFileToBase64 } from "@/actions/inserts";
import Image from "next/image";
import { compressImage } from "@/lib/utils";

interface AddCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddCollectionDialog({ open, onOpenChange, onSuccess }: AddCollectionDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    subTitle: "",
    imageBase64: "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const result = await createCollection(formData);
      if (result.success) {
        toast.success("Коллекция успешно создана");
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error(result.error || "Ошибка при создании коллекции");
      }
    } catch (error) {
      console.error("Error creating collection:", error);
      toast.error("Не удалось создать коллекцию");
    } finally {
      setSaving(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-zа-яё0-9]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setUploading(true);

    try {
      const compressedFile = await compressImage(file);
      const formData = new FormData();
      formData.append('file', compressedFile);

      const result = await convertFileToBase64(formData);

      if (result.data) {
        setFormData(prev => ({ ...prev, imageBase64: result.data }));
        setImagePreview(result.data);
        toast.success('Изображение загружено');
      } else {
        toast.error('Ошибка при загрузке изображения');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Не удалось загрузить изображение');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создание новой коллекции</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Название коллекции</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleNameChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="subTitle">Подзаголовок</Label>
              <Input
                id="subTitle"
                value={formData.subTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, subTitle: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUpload">Изображение</Label>
              <Input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading && <p className="text-sm text-gray-500">Загрузка изображения...</p>}
              {imagePreview && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Предпросмотр:</p>
                  <Image
                    src={imagePreview}
                    alt="Предпросмотр"
                    width={300}
                    height={200}
                    className="max-w-full h-auto max-h-40 object-contain border rounded"
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={saving || uploading}>
              {saving ? "Сохранение..." : "Создать"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
