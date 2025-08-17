"use client";

import { useState } from "react";
import { Collection } from "@/types/types";
import { Product } from "@/types/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Pencil, Search } from "lucide-react";
import { EditCollectionDialog } from "./edit-collection-dialog";

interface CollectionsTableProps {
  collections: Collection[];
  onSelect: (id: number) => void;
  onRefresh?: () => void;
}

export function CollectionsTable({ collections, onSelect, onRefresh }: CollectionsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  // Фильтрация коллекций по поисковому запросу
  const filteredCollections = collections.filter((collection) =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (collection: Collection) => {
    setEditingCollection(collection);
  };

  const handleEditSuccess = () => {
    setEditingCollection(null);
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию или slug..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Описание</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCollections.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Коллекции не найдены
                </TableCell>
              </TableRow>
            ) : (
              filteredCollections.map((collection) => (
                <TableRow key={collection.id}>
                  <TableCell>{collection.id}</TableCell>
                  <TableCell className="font-medium">{collection.name}</TableCell>
                  <TableCell>{collection.slug}</TableCell>
                  <TableCell>{collection.description || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(collection)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelect(collection.id)}
                      >
                        Товары
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editingCollection && (
        <EditCollectionDialog
          collection={editingCollection}
          open={true}
          onOpenChange={(open) => !open && setEditingCollection(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}

interface CollectionProductsTableProps {
  products: Product[];
  collectionInfo: {
    id: number;
    name: string;
  } | null;
  onBack: () => void;
}

export function CollectionProductsTable({ products, collectionInfo, onBack }: CollectionProductsTableProps) {
  if (!collectionInfo) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
        <h2 className="text-lg font-medium">
          Товары коллекции: {collectionInfo.name}
        </h2>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Артикул</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead>Активен</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.article}</TableCell>
                <TableCell>{product.price.toLocaleString("ru-RU")} руб.</TableCell>
                <TableCell>{product.isActive ? "Да" : "Нет"}</TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Нет товаров в коллекции
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
