// "use client";

// import { useState, useEffect } from "react";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { AlertCircle } from "lucide-react";

// interface CollectionFieldProps {
//   collectionTag: string;
//   collectionName: string;
//   onChange: (tag: string, name: string) => void;
//   className?: string;
// }

// export function CollectionField({ collectionTag, collectionName, onChange, className = "" }: CollectionFieldProps) {
//   const [tag, setTag] = useState(collectionTag);
//   const [name, setName] = useState(collectionName);

//   // Обновляем внутреннее состояние при изменении пропсов
//   useEffect(() => {
//     setTag(collectionTag);
//     setName(collectionName);
//   }, [collectionTag, collectionName]);

//   // Обработчики изменения
//   const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newTag = e.target.value;
//     setTag(newTag);
//     onChange(newTag, name);
//   };

//   const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newName = e.target.value;
//     setName(newName);
//     onChange(tag, newName);
//   };

//   return (
//     <div className={`space-y-4 ${className}`}>
//       <Alert className="bg-blue-50 border-blue-200">
//         <AlertCircle className="h-4 w-4 text-blue-600" />
//         <AlertDescription className="text-blue-700">
//           Коллекция позволяет связать товары из разных категорий для взаимного отображения на страницах деталей.
//         </AlertDescription>
//       </Alert>

//       <div className="grid grid-cols-4 items-center gap-4">
//         <Label htmlFor="collectionTag" className="text-right">
//           Тег коллекции
//         </Label>
//         <Input
//           id="collectionTag"
//           name="collectionTag"
//           value={tag}
//           onChange={handleTagChange}
//           className="col-span-3"
//           placeholder="Например: summer-2023, premium, modern"
//         />
//         <p className="col-span-4 col-start-2 text-xs text-gray-500">
//           * Тег используется для группировки товаров. Товары с одинаковым тегом будут связаны как коллекция.
//         </p>
//       </div>

//       <div className="grid grid-cols-4 items-center gap-4">
//         <Label htmlFor="collectionName" className="text-right">
//           Название коллекции
//         </Label>
//         <Input
//           id="collectionName"
//           name="collectionName"
//           value={name}
//           onChange={handleNameChange}
//           className="col-span-3"
//           placeholder="Например: Летняя коллекция 2023, Премиум, Модерн"
//         />
//         <p className="col-span-4 col-start-2 text-xs text-gray-500">
//           * Название будет отображаться на странице товара при показе других товаров из коллекции.
//         </p>
//       </div>
//     </div>
//   );
// }
