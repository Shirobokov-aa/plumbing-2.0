"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ClientPageProps {
  params: { id: string };
}

export default function ClientPage({ params }: ClientPageProps) {
  const router = useRouter();
  const { id } = params;
  const [productId, setProductId] = useState<string | null>(null);

  // Устанавливаем идентификатор продукта из параметров
  useEffect(() => {
    if (id) {
      setProductId(id);
    }
  }, [id]);

  useEffect(() => {
    if (!productId) return;

    // Перенаправляем на страницу редактирования в новой структуре
    router.push(`/admin/catalog/${productId}`);
  }, [productId, router]);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Перенаправление...</h1>
      </div>
    </div>
  );
}
