"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { createCategory } from "@/actions/catalog-admin";
import { ProductCategory } from "@/types/catalog";

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  categories: ProductCategory[];
}

export function AddCategoryDialog({ open, onOpenChange, onSuccess, categories }: AddCategoryDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parentId: null as number | null,
    order: 0,
    lang: "ru"
  });
  const [saving, setSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "order" ? parseInt(value) || 0 : value
    }));
  };

  const handleSlugGeneration = () => {
    if (formData.name) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-zа-я0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[а-я]/g, (match) => {
          const russianToLatin: Record<string, string> = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
            'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
            'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
            'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
            'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
          };
          return russianToLatin[match] || match;
        });
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleParentChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      parentId: value === "none" ? null : parseInt(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const result = await createCategory(formData);
      if (result.success) {
        toast.success("Категория успешно создана");
        onSuccess();
        resetForm();
      } else {
        toast.error(result.error || "Ошибка при создании категории");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Не удалось создать категорию");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      parentId: null,
      order: 0,
      lang: "ru"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Добавление категории</DialogTitle>
          <DialogDescription>
            Заполните информацию о новой категории
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
                onBlur={handleSlugGeneration}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="slug" className="text-right">
                Slug
              </Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="col-span-3"
                required
                pattern="^[a-z0-9-]+$"
                title="Только латинские буквы, цифры и дефис"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="parentId" className="text-right">
                Родительская категория
              </Label>
              <Select
                value={formData.parentId?.toString() || "none"}
                onValueChange={handleParentChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Выберите родительскую категорию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Нет (корневая категория)</SelectItem>
                  {categories.filter(cat => !cat.parentId).map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Label htmlFor="lang" className="text-right">
                Язык
              </Label>
              <Select
                value={formData.lang}
                onValueChange={(value) => setFormData(prev => ({ ...prev, lang: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Выберите язык" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ru">Русский</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
