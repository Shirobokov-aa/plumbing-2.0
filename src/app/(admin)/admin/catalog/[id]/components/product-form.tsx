"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save } from "lucide-react";
import { updateProduct } from "@/actions/catalog-admin";
import {
  ProductCategory,
  ProductColor,
  ProductTechnology,
  Collection,
  ProductWithDetails,
  ProductImage,
} from "@/types/catalog";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { compressImage } from "@/lib/utils";

interface ColorLinks {
  [key: number]: string;
}

interface ProductFormProps {
  product: ProductWithDetails;
  categories: ProductCategory[];
  colors: ProductColor[];
  technologies: ProductTechnology[];
  collections: Collection[];
}

interface ProductFormData {
  name: string;
  article: string;
  description?: string | null;
  price: number;
  categoryId: number;
  subcategoryId?: number | null;
  images: ProductImage[];
  featured: boolean;
  isActive: boolean;
  lang: string;
  colors: number[];
  colorLinks: ColorLinks;
  characteristics: { name: string; value: string; order: number }[];
  technologies: number[];
  documents: { name: string; type: string; fileUrl: string; fileSize: number }[];
  collectionId?: number | null;
  crossCollectionId?: number | null;
}

export default function ProductForm({ product, categories, colors, technologies, collections }: ProductFormProps) {
  const router = useRouter();
  const [subcategories, setSubcategories] = useState<ProductCategory[]>([]);
  const [saving, setSaving] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [selectedColorForImage, setSelectedColorForImage] = useState<number | null>(null);
  const [imageColorMap, setImageColorMap] = useState<Map<string, number | null>>(new Map());

  const [formData, setFormData] = useState<ProductFormData>({
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
    colors: [],
    colorLinks: {},
    characteristics: [],
    technologies: [],
    documents: [],
    collectionId: null,
    crossCollectionId: null,
  });

  const [newCharacteristic, setNewCharacteristic] = useState({ name: "", value: "", order: 0 });
  const [newDocument, setNewDocument] = useState({ name: "", type: "pdf", fileUrl: "", fileSize: 0 });

  // Инициализация данных формы после получения props
  useEffect(() => {
    if (!product) return;

    // Проверяем критически важные поля
    if (!product.categoryId || isNaN(product.categoryId) || product.categoryId <= 0) {
      console.error("Некорректный ID категории в продукте:", product.categoryId);
      toast.error("Ошибка: продукт имеет некорректный ID категории");
      return;
    }

    // Создаем карту соответствия изображений и цветов
    const colorMap = new Map();
    product.images.forEach((img) => {
      if (typeof img === "string") {
        colorMap.set(img, null);
      } else {
        colorMap.set(img.url, img.colorId);
      }
    });
    setImageColorMap(colorMap);

    setImageColorMap(colorMap);

    // Инициализация ссылок на цвета
    const colorLinks: ColorLinks = {};
    if (product.productToColors) {
      product.productToColors.forEach((ptc) => {
        if (ptc.linkToProduct) {
          colorLinks[ptc.colorId] = ptc.linkToProduct;
        }
      });
    }

    setFormData({
      name: product.name,
      article: product.article,
      description: product.description || "",
      price: product.price,
      categoryId: product.categoryId,
      subcategoryId: product.subcategoryId || null,
      images: product.images.map((img) => ({
        url: typeof img === "string" ? img : img.url,
        colorId: typeof img === "string" ? null : img.colorId,
      })),
      featured: product.featured || false,
      isActive: product.isActive || false,
      lang: product.lang,
      colors: product.colors?.map((c) => c.id) || [],
      colorLinks,
      characteristics:
        product.characteristics?.map((c) => ({
          name: c.name,
          value: c.value,
          order: c.order,
        })) || [],
      technologies: product.technologies?.map((t) => t.id) || [],
      documents:
        product.documents?.map((d) => ({
          name: d.name,
          type: d.type,
          fileUrl: d.fileUrl,
          fileSize: d.fileSize,
        })) || [],
      collectionId: product.collection?.id || null,
      crossCollectionId: product.crossCollection?.id || null,
    });

    setPreviewImages(product.images.map((img) => (typeof img === "string" ? img : img.url)));

    if (product.categoryId) {
      const subs = categories?.filter((cat) => cat.parentId === product.categoryId) || [];
      setSubcategories(subs);
    }

    console.log("Инициализированы данные продукта:", {
      id: product.id,
      categoryId: product.categoryId,
      subcategoryId: product.subcategoryId,
      collectionId: product.collection?.id || null,
      crossCollectionId: product.crossCollection?.id || null,
    });
  }, [product, categories]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleCategoryChange = (value: string) => {
    if (!value) {
      toast.error("Выберите категорию товара");
      return;
    }

    const categoryId = parseInt(value);
    if (isNaN(categoryId) || categoryId <= 0) {
      toast.error("Выбрана некорректная категория");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      categoryId,
      subcategoryId: null,
    }));

    const subs = categories.filter((cat) => cat.parentId === categoryId);
    setSubcategories(subs);
  };

  const handleSubcategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      subcategoryId: value === "none" ? null : parseInt(value),
    }));
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
    const newColorMap = new Map(imageColorMap);

    for (const file of Array.from(files)) {
      try {
        const compressedFile = await compressImage(file);
        const reader = new FileReader();

        await new Promise<void>((resolve) => {
          reader.onloadend = () => {
            const base64String = reader.result as string;
            newImages.push({ url: base64String, colorId: selectedColorForImage });
            newPreviewImages.push(base64String);
            newColorMap.set(base64String, selectedColorForImage);
            resolve();
          };
          reader.readAsDataURL(compressedFile);
        });
      } catch (error) {
        console.error('Error processing image:', error);
        toast.error(`Ошибка при обработке изображения ${file.name}`);
      }
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
    setPreviewImages((prev) => [...prev, ...newPreviewImages]);
    setImageColorMap(newColorMap);
  };

  const removeImage = (index: number) => {
    const imageToRemove = formData.images[index];
    const newColorMap = new Map(imageColorMap);
    newColorMap.delete(imageToRemove.url);
    setImageColorMap(newColorMap);

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleColorSelect = (colorId: string) => {
    setFormData((prev) => {
      const colorIdNum = parseInt(colorId);
      const index = prev.colors.indexOf(colorIdNum);
      if (index === -1) {
        return { ...prev, colors: [...prev.colors, colorIdNum] };
      }
      return { ...prev, colors: prev.colors.filter((id) => id !== colorIdNum) };
    });
  };

  const handleTechnologySelect = (techId: string) => {
    setFormData((prev) => {
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
      setFormData((prev) => ({
        ...prev,
        characteristics: [...prev.characteristics, { ...newCharacteristic }],
      }));
      setNewCharacteristic({ name: "", value: "", order: formData.characteristics.length });
    }
  };

  const handleRemoveCharacteristic = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      characteristics: prev.characteristics.filter((_, i) => i !== index),
    }));
  };

  const handleAddDocument = () => {
    if (newDocument.name && newDocument.fileUrl) {
      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, { ...newDocument }],
      }));
      setNewDocument({ name: "", type: "pdf", fileUrl: "", fileSize: 0 });
    } else {
      toast.error("Заполните имя и URL документа");
    }
  };

  const handleRemoveDocument = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const handleDocumentFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setNewDocument((prev) => ({
        ...prev,
        fileUrl: base64String,
        fileSize: file.size,
        type: file.type.split("/")[1] || "pdf",
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      setSaving(true);

      // Проверка числовых полей на корректность
      if (isNaN(formData.categoryId) || formData.categoryId <= 0) {
        toast.error("Выберите категорию товара");
        setSaving(false);
        return;
      }

      if (isNaN(formData.price) || formData.price < 0) {
        toast.error("Укажите корректную цену товара");
        setSaving(false);
        return;
      }

      // Подготавливаем данные для отправки
      const dataToSend = {
        ...formData,
        images: formData.images.map((img) => img.url),
        colorLinks: formData.colorLinks,
      };

      console.log('Отправляемые данные:', {
        colors: dataToSend.colors,
        colorLinks: dataToSend.colorLinks
      });

      try {
        // Сохраняем только маппинг индексов изображений к цветам
        const colorMapping = formData.images.map((img, index) => ({
          index,
          colorId: img.colorId,
        }));
        localStorage.setItem(`product_${product.id}_colors`, JSON.stringify(colorMapping));
      } catch (e) {
        console.warn("Не удалось сохранить информацию о цветах:", e);
      }

      // Отправляем данные
      const { success, error } = await updateProduct(product.id, dataToSend);

      if (success) {
        toast.success("Продукт успешно обновлен");
        router.refresh();
      } else {
        toast.error(error || "Ошибка при обновлении продукта");
      }
    } catch (error) {
      console.error(error);
      toast.error("Ошибка при обновлении продукта");
    } finally {
      setSaving(false);
    }
  };

  const handleCollectionChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      collectionId: value && value !== "0" ? parseInt(value) : null,
    }));
  };

  const handleCrossCollectionChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      crossCollectionId: value && value !== "0" ? parseInt(value) : null,
    }));
  };

  const handleColorLinkChange = (colorId: number, link: string) => {
    setFormData((prev) => ({
      ...prev,
      colorLinks: {
        ...prev.colorLinks,
        [colorId]: link,
      },
    }));
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/admin/catalog")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к каталогу
          </Button>
          <h1 className="text-2xl font-bold">Редактирование товара: {product?.name}</h1>
        </div>
        <Button onClick={handleSubmit} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Сохранение..." : "Сохранить"}
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">Основная информация</TabsTrigger>
            <TabsTrigger value="images">Изображения</TabsTrigger>
            <TabsTrigger value="chars">Характеристики</TabsTrigger>
            <TabsTrigger value="colors">Цвета</TabsTrigger>
            <TabsTrigger value="techs">Технологии</TabsTrigger>
            <TabsTrigger value="docs">Документация</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
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
                      value={formData.description || ""}
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
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="categoryId" className="text-right">
                      Категория
                    </Label>
                    <Select
                      value={formData.categoryId ? formData.categoryId.toString() : ""}
                      onValueChange={handleCategoryChange}
                      required
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Выберите категорию (обязательно)" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories
                          .filter((cat) => !cat.parentId)
                          .map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.categoryId > 0 && subcategories.length > 0 && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="subcategoryId" className="text-right">
                        Подкатегория
                      </Label>
                      <Select
                        value={formData.subcategoryId?.toString() || "none"}
                        onValueChange={handleSubcategoryChange}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Выберите подкатегорию" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Нет подкатегории</SelectItem>
                          {subcategories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="collectionId" className="text-right">
                      Коллекция
                    </Label>
                    <Select value={formData.collectionId?.toString() || ""} onValueChange={handleCollectionChange}>
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
                      Кросс-коллекция
                    </Label>
                    <Select
                      value={formData.crossCollectionId?.toString() || ""}
                      onValueChange={handleCrossCollectionChange}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Выберите кросс-коллекцию" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Нет кросс-коллекции</SelectItem>
                        {collections.map((collection) => (
                          <SelectItem key={collection.id} value={collection.id.toString()}>
                            {collection.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lang" className="text-right">
                      Язык
                    </Label>
                    <Select
                      value={formData.lang}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, lang: value }))}
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
                  <Separator className="my-4" />
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="col-start-2 col-span-3 flex items-center space-x-2">
                      <Checkbox
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => handleCheckboxChange("featured", checked as boolean)}
                      />
                      <Label htmlFor="featured">Рекомендуемый товар</Label>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="col-start-2 col-span-3 flex items-center space-x-2">
                      <Checkbox
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => handleCheckboxChange("isActive", checked as boolean)}
                      />
                      <Label htmlFor="isActive">Активен</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
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
                      Добавить изображения
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
                  <Separator className="my-4" />
                  <h3 className="font-medium mb-2">Текущие изображения</h3>
                  {previewImages.length > 0 ? (
                    <div className="grid grid-cols-4 gap-4">
                      {formData.images.map((img, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={img.url}
                            alt={`Изображение ${index + 1}`}
                            width={100}
                            height={100}
                            className="h-40 w-full object-cover rounded-md"
                          />
                          <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-sm">
                            {colors.find((c) => c.id === img.colorId)?.name || "Без цвета"}
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 h-8 w-8 rounded-full p-0"
                            onClick={() => removeImage(index)}
                          >
                            &times;
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">У товара нет изображений</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chars" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="font-medium mb-2">Характеристики</h3>
                  {formData.characteristics.length > 0 ? (
                    <div className="space-y-2 mb-4">
                      {formData.characteristics.map((char, index) => (
                        <div key={index} className="flex items-center gap-2 border p-3 rounded-md">
                          <div className="flex-1">
                            <span className="font-medium">{char.name}:</span> {char.value}
                          </div>
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
                  ) : (
                    <div className="text-center py-4 text-gray-500 mb-4">У товара нет характеристик</div>
                  )}
                  <Separator className="my-4" />
                  <h3 className="font-medium mb-2">Добавить характеристику</h3>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Название"
                      value={newCharacteristic.name}
                      onChange={(e) => setNewCharacteristic((prev) => ({ ...prev, name: e.target.value }))}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Значение"
                      value={newCharacteristic.value}
                      onChange={(e) => setNewCharacteristic((prev) => ({ ...prev, value: e.target.value }))}
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" onClick={handleAddCharacteristic}>
                      Добавить
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="colors" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-4">Доступные цвета</h3>
                {colors.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {colors.map((color) => (
                      <div
                        key={color.id}
                        className={`border p-4 rounded-md ${formData.colors.includes(color.id) ? "bg-gray-50" : ""}`}
                      >
                        <div className="flex items-center gap-4 mb-3">
                          <Checkbox
                            checked={formData.colors.includes(color.id)}
                            onCheckedChange={() => handleColorSelect(color.id.toString())}
                          />
                          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: color.code }} />
                          <div>
                            <div className="font-medium">{color.name}</div>
                            <div className="text-xs text-gray-500">Суффикс: {color.suffix}</div>
                          </div>
                        </div>
                        {formData.colors.includes(color.id) && (
                          <div className="mt-2 pl-12">
                            <Label htmlFor={`color-link-${color.id}`} className="text-sm text-gray-600 mb-1 block">
                              Ссылка на товар этого цвета
                            </Label>
                            <Input
                              id={`color-link-${color.id}`}
                              placeholder="Введите URL товара этого цвета"
                              value={formData.colorLinks[color.id] || ""}
                              onChange={(e) => handleColorLinkChange(color.id, e.target.value)}
                              className="w-full"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">Цвета не найдены</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="techs" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-4">Технологии</h3>
                {technologies.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {technologies.map((tech) => (
                      <div
                        key={tech.id}
                        className={`border p-3 rounded-md cursor-pointer ${
                          formData.technologies.includes(tech.id) ? "bg-gray-100 border-gray-400" : ""
                        }`}
                        onClick={() => handleTechnologySelect(tech.id.toString())}
                      >
                        <div className="font-medium">{tech.name}</div>
                        <div className="text-sm text-gray-500">{tech.title}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">Технологии не найдены</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="docs" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-medium mb-4">Документация</h3>
                {formData.documents.length > 0 ? (
                  <div className="space-y-2 mb-6">
                    {formData.documents.map((doc, index) => (
                      <div key={index} className="flex items-center gap-2 border p-3 rounded-md">
                        <div className="flex-1">
                          <div className="font-medium">{doc.name}</div>
                          <div className="text-xs text-gray-500">
                            {doc.type} • {(doc.fileSize / (1024 * 1024)).toFixed(2)} MB
                          </div>
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveDocument(index)}>
                          Удалить
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500 mb-4">У товара нет документов</div>
                )}
                <Separator className="my-4" />
                <h3 className="font-medium mb-2">Добавить документ</h3>
                <div className="space-y-4">
                  <Input
                    placeholder="Название документа"
                    value={newDocument.name}
                    onChange={(e) => setNewDocument((prev) => ({ ...prev, name: e.target.value }))}
                  />
                  <div className="flex gap-4">
                    <Select
                      value={newDocument.type}
                      onValueChange={(value) => setNewDocument((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Тип файла" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="dwg">DWG</SelectItem>
                        <SelectItem value="doc">DOC</SelectItem>
                        <SelectItem value="jpeg">JPEG</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input type="file" onChange={handleDocumentFileUpload} className="flex-1" />
                    <Button type="button" variant="outline" onClick={handleAddDocument}>
                      Добавить
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
