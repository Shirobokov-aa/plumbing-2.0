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
import { toast } from "sonner";
import { createColor } from "@/actions/catalog-admin";

interface AddColorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddColorDialog({ open, onOpenChange, onSuccess }: AddColorDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    code: "#000000",
    suffix: ""
  });
  const [saving, setSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.code || !formData.suffix) {
      toast.error("Заполните все обязательные поля");
      return;
    }

    setSaving(true);

    try {
      const result = await createColor(formData);
      if (result.success) {
        toast.success("Цвет успешно создан");
        onSuccess();
        resetForm();
      } else {
        toast.error(result.error || "Ошибка при создании цвета");
      }
    } catch (error) {
      console.error("Error creating color:", error);
      toast.error("Не удалось создать цвет");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "#000000",
      suffix: ""
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Добавление цвета</DialogTitle>
          <DialogDescription>
            Заполните информацию о новом цвете продукта
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
                placeholder="Например: Хром, Черный, Золото..."
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Код цвета
              </Label>
              <div className="col-span-3 flex gap-2 items-center">
                <Input
                  id="code"
                  name="code"
                  type="color"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-12 h-10 p-1"
                  required
                />
                <Input
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="flex-1"
                  required
                  placeholder="#000000"
                />
                <div
                  className="w-10 h-10 rounded-md border"
                  style={{ backgroundColor: formData.code }}
                ></div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="suffix" className="text-right">
                Суффикс артикула
              </Label>
              <Input
                id="suffix"
                name="suffix"
                value={formData.suffix}
                onChange={handleInputChange}
                className="col-span-3"
                required
                placeholder="Например: CH, BL, GD..."
              />
              <p className="col-span-4 col-start-2 text-xs text-gray-500">
                * Суффикс добавляется к артикулу продукта для обозначения цвета, например: A100CH
              </p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Предпросмотр
              </Label>
              <div className="col-span-3 p-4 border rounded-md">
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-full"
                    style={{ backgroundColor: formData.code }}
                  ></div>
                  <div>
                    <p className="font-medium">{formData.name || 'Название цвета'}</p>
                    <p className="text-xs text-gray-500">
                      {formData.code} • Артикул: A100{formData.suffix}
                    </p>
                  </div>
                </div>
              </div>
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
