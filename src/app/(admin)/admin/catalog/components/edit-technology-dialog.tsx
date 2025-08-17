"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateTechnology } from "@/actions/catalog-admin";
import { ProductTechnology } from "@/types/catalog";
import Image from "next/image";
import { compressImage } from "@/lib/utils";

interface EditTechnologyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  technology: ProductTechnology | null;
}

export function EditTechnologyDialog({ open, onOpenChange, onSuccess, technology }: EditTechnologyDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    icon: ""
  });
  const [saving, setSaving] = useState(false);
  const [previewIcon, setPreviewIcon] = useState<string | null>(null);

  // Заполнение формы при открытии диалога
  useEffect(() => {
    if (technology) {
      setFormData({
        name: technology.name,
        title: technology.title,
        description: technology.description || "",
        icon: technology.icon
      });
      setPreviewIcon(technology.icon);
    }
  }, [technology]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedFile = await compressImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData((prev) => ({ ...prev, iconBase64: base64String }));
        setPreviewIcon(base64String);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Error processing icon:', error);
      toast.error('Ошибка при обработке иконки');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!technology) return;
    if (!formData.name || !formData.title || !formData.icon) {
      toast.error("Заполните обязательные поля: название, заголовок и иконка");
      return;
    }

    setSaving(true);

    try {
      const result = await updateTechnology(technology.id, formData);
      if (result.success) {
        toast.success("Технология успешно обновлена");
        onSuccess();
      } else {
        toast.error(result.error || "Ошибка при обновлении технологии");
      }
    } catch (error) {
      console.error("Error updating technology:", error);
      toast.error("Не удалось обновить технологию");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Редактирование технологии</DialogTitle>
          <DialogDescription>
            Измените информацию о технологии
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Название
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Заголовок
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Описание
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="icon" className="text-right">
                Иконка
              </Label>
              <Input
                id="icon"
                name="iconFile"
                type="file"
                accept="image/*"
                onChange={handleIconUpload}
                className="col-span-3"
              />
            </div>
            {previewIcon && (
              <div className="flex justify-center">
                <div className="relative h-24 w-24">
                  <Image
                    src={previewIcon}
                    alt="Предпросмотр иконки"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Сохранение..." : "Сохранить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
