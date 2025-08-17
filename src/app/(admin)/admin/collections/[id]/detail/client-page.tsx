"use client";

import { Suspense } from "react";
import { CollectionDetailLoader } from "@/app/(admin)/admin/collections/[id]/detail/components/CollectionDetailLoader";

interface ClientPageProps {
  params: { id: string };
}

export default function ClientPage({ params }: ClientPageProps) {
  const { id } = params;

  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<div className="text-center py-4">Загрузка...</div>}>
        <CollectionDetailLoader id={id} />
      </Suspense>
    </div>
  );
}
