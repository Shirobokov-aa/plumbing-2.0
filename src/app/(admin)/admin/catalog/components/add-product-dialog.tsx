"use client";

import { useState, useEffect } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { createProduct } from "@/actions/catalog-admin";
import { ProductCategory, ProductColor, ProductTechnology, Collection, ProductImage } from "@/types/catalog";
import Image from "next/image";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { compressImage } from "@/lib/utils";

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  categories: ProductCategory[];
  colors: ProductColor[];
  technologies: ProductTechnology[];
  collections: Collection[];
}

export function AddProductDialog({ open, onOpenChange, onSuccess, categories, colors, technologies, collections }: AddProductDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    article: "",
    description: "",
    price: 0,
    categoryId: 0,
    subcategoryId: null as number | null,
    images: [] as ProductImage[],
    featured: false,
    isActive: true,
    lang: "ru",
    collectionId: null as number | null,
    crossCollectionId: null as number | null,
    colors: [] as number[],
    characteristics: [] as { name: string; value: string; order: number }[],
    technologies: [] as number[],
    documents: [] as { name: string; type: string; fileUrl: string; fileSize: number }[]
  });
  const [saving, setSaving] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<ProductCategory[]>([]);
  const [newCharacteristic, setNewCharacteristic] = useState({ name: "", value: "", order: 0 });
  const [newDocument, setNewDocument] = useState({ name: "", type: "pdf", fileUrl: "", fileSize: 0 });
  const [selectedColorForImage, setSelectedColorForImage] = useState<number | null>(null);

  // Находим родительские категории и подкатегории
  const parentCategories = categories.filter(cat => !cat.parentId);

  // Сбросить форму при открытии диалога
  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleCategoryChange = (value: string) => {
    const categoryId = parseInt(value);
    setFormData(prev => ({
      ...prev,
      categoryId,
      subcategoryId: null
    }));

    // Фильтруем подкатегории для выбранной категории
    const subs = categories.filter(cat => cat.parentId === categoryId);
    setSubcategories(subs);

    console.log(`Выбрана категория: ID=${categoryId}, найдено подкатегорий: ${subs.length}`);
  };

  const handleSubcategoryChange = (value: string) => {
    const subcategoryId = value === "none" ? null : parseInt(value);
    setFormData(prev => ({
      ...prev,
      subcategoryId
    }));

    console.log(`Выбрана подкатегория: ${subcategoryId}`);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!selectedColorForImage) {
      toast.error("Пожалуйста, выберите цвет для изображений");
      return;
    }

    const newImages: ProductImage[] = [];
    const newPreviewImages: string[] = [];

    for (const file of Array.from(files)) {
      try {
        const compressedFile = await compressImage(file);
        const reader = new FileReader();

        await new Promise<void>((resolve) => {
          reader.onloadend = () => {
            const base64String = reader.result as string;
            newImages.push({ url: base64String, colorId: selectedColorForImage });
            newPreviewImages.push(base64String);

            resolve();
          };
          reader.readAsDataURL(compressedFile);
        });
      } catch (error) {
        console.error('Error processing image:', error);
        toast.error(`Ошибка при обработке изображения ${file.name}`);
      }
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
    setPreviewImages(prev => [...prev, ...newPreviewImages]);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleColorSelect = (colorId: string) => {
    // Обновляем formData
    setFormData(prev => {
      const colorIdNum = parseInt(colorId);
      const index = prev.colors.indexOf(colorIdNum);
      if (index === -1) {
        return { ...prev, colors: [...prev.colors, colorIdNum] };
      }
      return { ...prev, colors: prev.colors.filter((id) => id !== colorIdNum) };
    });
  };

  const handleTechnologySelect = (techId: string) => {
    // Обновляем formData
    setFormData(prev => {
      const techIdNum = parseInt(techId);
      const index = prev.technologies.indexOf(techIdNum);
      if (index === -1) {
        return { ...prev, technologies: [...prev.technologies, techIdNum] };
      }
      return { ...prev, technologies: prev.technologies.filter((id) => id !== techIdNum) };
    });
  };

  const handleAddCharacteristic = () => {
    if (newCharacteristic.name && newCharacteristic.value) {
      setFormData(prev => ({
        ...prev,
        characteristics: [...prev.characteristics, { ...newCharacteristic }]
      }));
      setNewCharacteristic({ name: "", value: "", order: formData.characteristics.length });
    }
  };

  const handleRemoveCharacteristic = (index: number) => {
    setFormData(prev => ({
      ...prev,
      characteristics: prev.characteristics.filter((_, i) => i !== index)
    }));
  };

  const handleAddDocument = () => {
    if (newDocument.name && newDocument.fileUrl) {
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, { ...newDocument }]
      }));
      setNewDocument({ name: "", type: "pdf", fileUrl: "", fileSize: 0 });
    } else {
      toast.error("Заполните имя и URL документа");
    }
  };

  const handleRemoveDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleDocumentFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setNewDocument(prev => ({
        ...prev,
        fileUrl: base64String,
        fileSize: file.size,
        type: file.type.split('/')[1] || 'pdf'
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.categoryId === 0) {
      toast.error("Выберите категорию товара");
      return;
    }

    setSaving(true);

    try {
      // Подготавливаем данные для отправки
      const dataToSend = {
        ...formData,
        images: formData.images.map(img => img.url)
      };

      const result = await createProduct(dataToSend);
      if (result.success && result.data?.id) {
        // Сохраняем информацию о цветах для нового товара
        try {
          const colorMapping = formData.images.map((img, index) => ({
            index,
            colorId: img.colorId
          }));
          localStorage.setItem(`product_${result.data.id}_colors`, JSON.stringify(colorMapping));
        } catch (e) {
          console.warn('Не удалось сохранить информацию о цветах:', e);
        }

        toast.success("Товар успешно создан");
        onSuccess();
        resetForm();
      } else {
        toast.error(result.error || "Ошибка при создании товара");
      }
    } catch (error) {
      console.error(error);
      toast.error("Ошибка при создании товара");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      article: "",
      description: "",
      price: 0,
      categoryId: 0,
      subcategoryId: null,
      images: [],
      featured: false,
      isActive: true,
      lang: "ru",
      collectionId: null,
      crossCollectionId: null,
      colors: [],
      characteristics: [],
      technologies: [],
      documents: []
    });
    setPreviewImages([]);
    setSubcategories([]);
    setSelectedColorForImage(null);
  };

  // Получаем название родительской категории по ID
  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Добавление товара</DialogTitle>
          <DialogDescription>
            Заполните информацию о новом товаре
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Информационное сообщение о важности категорий */}
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                <strong>Важно!</strong> Обязательно выберите категорию и подкатегорию товара для правильной фильтрации в каталоге.
              </AlertDescription>
            </Alert>

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
              <Label htmlFor="article" className="text-right">
                Артикул
              </Label>
              <Input
                id="article"
                name="article"
                value={formData.article}
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
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Цена (руб.)
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                className="col-span-3"
                required
                min={0}
              />
            </div>

            {/* Выбор категории - делаем более заметным */}
            <div className="grid grid-cols-4 items-center gap-4 bg-gray-50 p-3 rounded-md border">
              <Label htmlFor="categoryId" className="text-right font-bold">
                Категория *
              </Label>
              <Select
                value={formData.categoryId ? formData.categoryId.toString() : ""}
                onValueChange={handleCategoryChange}
                required
              >
                <SelectTrigger className="col-span-3 border-2 border-gray-400">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {parentCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name} ({category.slug})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Выбор подкатегории - если доступно */}
            {formData.categoryId > 0 && (
              <div className={`grid grid-cols-4 items-center gap-4 ${subcategories.length > 0 ? 'bg-gray-50 p-3 rounded-md border' : ''}`}>
                <Label htmlFor="subcategoryId" className="text-right font-bold">
                  Подкатегория {subcategories.length > 0 ? '*' : ''}
                </Label>
                {subcategories.length > 0 ? (
                  <Select
                    value={formData.subcategoryId?.toString() || "none"}
                    onValueChange={handleSubcategoryChange}
                  >
                    <SelectTrigger className="col-span-3 border-2 border-gray-400">
                      <SelectValue placeholder="Выберите подкатегорию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Нет подкатегории</SelectItem>
                      {subcategories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name} ({category.slug})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="col-span-3 text-gray-500">
                    У категории &quot;{getCategoryName(formData.categoryId)}&quot; нет подкатегорий
                  </div>
                )}
              </div>
            )}

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

            {/* Добавляем выбор цвета перед загрузкой изображений */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageColor" className="text-right">
                Цвет для изображений
              </Label>
              <Select
                value={selectedColorForImage?.toString() || ""}
                onValueChange={(value) => setSelectedColorForImage(value ? parseInt(value) : null)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Выберите цвет для загружаемых изображений" />
                </SelectTrigger>
                <SelectContent>
                  {colors.map((color) => (
                    <SelectItem key={color.id} value={color.id.toString()}>
                      {color.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="images" className="text-right">
                Изображения
              </Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="col-span-3"
                multiple
                disabled={!selectedColorForImage}
              />
            </div>

            {previewImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={img.url}
                      alt={`Preview ${index}`}
                      width={100}
                      height={100}
                      className="h-24 w-full object-cover rounded-md"
                    />
                    <div className="absolute top-1 left-1 bg-white px-2 py-1 rounded text-sm">
                      {colors.find(c => c.id === img.colorId)?.name || 'Без цвета'}
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => removeImage(index)}
                    >
                      &times;
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-4">Коллекции</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="collectionId" className="text-right">
                    Коллекция товара
                  </Label>
                  <Select
                    value={formData.collectionId?.toString() || ""}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      collectionId: value ? parseInt(value) : null
                    }))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Выберите коллекцию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Нет коллекции</SelectItem>
                      {collections.map((collection) => (
                        <SelectItem key={collection.id} value={collection.id.toString()}>
                          {collection.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="crossCollectionId" className="text-right">
                    Отображать товары из
                  </Label>
                  <Select
                    value={formData.crossCollectionId?.toString() || ""}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      crossCollectionId: value ? parseInt(value) : null
                    }))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Выберите коллекцию для отображения" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Не отображать</SelectItem>
                      {collections.map((collection) => (
                        <SelectItem key={collection.id} value={collection.id.toString()}>
                          {collection.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-2">Доступные цвета</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {colors.map((color) => (
                  <div
                    key={color.id}
                    className={`border p-2 rounded-md cursor-pointer flex items-center ${
                      formData.colors.includes(color.id) ? 'bg-gray-100 border-gray-400' : ''
                    }`}
                    onClick={() => handleColorSelect(color.id.toString())}
                  >
                    <div
                      className="w-6 h-6 rounded-full mr-2"
                      style={{ backgroundColor: color.code }}
                    />
                    <span className="text-sm">{color.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-2">Характеристики</h3>
              <div className="space-y-2">
                {formData.characteristics.map((char, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1">{char.name}: {char.value}</div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCharacteristic(index)}
                    >
                      Удалить
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Название"
                  value={newCharacteristic.name}
                  onChange={(e) => setNewCharacteristic(prev => ({ ...prev, name: e.target.value }))}
                  className="flex-1"
                />
                <Input
                  placeholder="Значение"
                  value={newCharacteristic.value}
                  onChange={(e) => setNewCharacteristic(prev => ({ ...prev, value: e.target.value }))}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddCharacteristic}
                >
                  Добавить
                </Button>
              </div>
            </div>
            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-2">Технологии</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {technologies.map((tech) => (
                  <div
                    key={tech.id}
                    className={`border p-2 rounded-md cursor-pointer ${
                      formData.technologies.includes(tech.id) ? 'bg-gray-100 border-gray-400' : ''
                    }`}
                    onClick={() => handleTechnologySelect(tech.id.toString())}
                  >
                    <div className="font-medium">{tech.name}</div>
                    <div className="text-xs text-gray-500">{tech.title}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4 border-t pt-4">
              <div className="col-start-2 col-span-3 flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleCheckboxChange('featured', checked as boolean)}
                />
                <Label htmlFor="featured">Рекомендуемый товар</Label>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-start-2 col-span-3 flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleCheckboxChange('isActive', checked as boolean)}
                />
                <Label htmlFor="isActive">Активен</Label>
              </div>
            </div>
            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-2">Документация</h3>
              <div className="space-y-2">
                {formData.documents.map((doc, index) => (
                  <div key={index} className="flex items-center gap-2 border p-2 rounded">
                    <div className="flex-1">
                      <div className="font-medium">{doc.name}</div>
                      <div className="text-xs text-gray-500">
                        {doc.type} • {(doc.fileSize / 1024).toFixed(1)} KB
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveDocument(index)}
                    >
                      Удалить
                    </Button>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-2 mt-2">
                <Input
                  placeholder="Название документа"
                  value={newDocument.name}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, name: e.target.value }))}
                  className="col-span-4"
                />
                <Select
                  value={newDocument.type}
                  onValueChange={(value) => setNewDocument(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger className="col-span-1">
                    <SelectValue placeholder="Тип файла" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="dwg">DWG</SelectItem>
                    <SelectItem value="doc">DOC</SelectItem>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                  </SelectContent>
                </Select>
                <div className="col-span-3 flex gap-2">
                  <Input
                    type="file"
                    onChange={handleDocumentFileUpload}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddDocument}
                  >
                    Добавить
                  </Button>
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
