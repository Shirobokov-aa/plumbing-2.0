"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCollections } from '@/actions/collections';
import { Collection } from '@/types/types';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useAutoScroll } from '@/hooks/use-auto-scroll';

interface ClientCollectionsGridProps {
  lang: string;
}

export default function ClientCollectionsGrid({ lang }: ClientCollectionsGridProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Автоскролл к коллекциям после загрузки
  useAutoScroll({
    targetId: 'collections-grid',
    enabled: true,
    delay: 1200,
    offset: 100
  });

  const fetchCollections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Добавляем небольшую задержку перед запросом для гарантии готовности базы данных
      await new Promise(resolve => setTimeout(resolve, 1000));

      const collectionsResult = await getCollections(lang);

      if (!collectionsResult.success) {
        setError(collectionsResult.error || 'Произошла ошибка при загрузке коллекций');
        setCollections([]);
      } else {
        const data = collectionsResult.data || [];
        setCollections(data);
        setError(null);
      }
    } catch (err) {
      console.error('[ClientCollectionsGrid] Ошибка при загрузке коллекций:', err);
      setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка при загрузке коллекций');
      setCollections([]);
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    // Начинаем загрузку с небольшой задержкой после рендеринга компонента
    const timer = setTimeout(() => {
      fetchCollections();
    }, 500);

    return () => clearTimeout(timer);
  }, [lang, retryCount, fetchCollections]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (loading) {
    return (
      <section className="max-w-[1440px] px-12 pt-16 mx-auto">
        <div className="flex flex-col items-center justify-center p-10">
          <div className="mb-4 flex items-center">
            <RefreshCw className="mr-2 h-8 w-8 animate-spin text-gray-500" />
            <span className="text-lg text-gray-600">Загрузка коллекций...</span>
          </div>
          <p className="text-gray-500">Пожалуйста, подождите</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-[1440px] px-12 pt-16 mx-auto">
        <div className="text-center p-10 bg-red-50 rounded-lg border border-red-200">
          <h2 className="text-2xl font-medium mb-4 text-red-700">Не удалось загрузить коллекции</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Button
            onClick={handleRetry}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Попробовать снова
          </Button>
        </div>
      </section>
    );
  }

  if (collections.length === 0) {
    return (
      <section className="max-w-[1440px] px-12 pt-16 mx-auto">
        <div className="text-center p-10 bg-gray-100 rounded-lg">
          <h2 className="text-2xl font-medium mb-4">Нет доступных коллекций</h2>
          <p className="text-gray-600 mb-6">В данный момент коллекции не добавлены. Пожалуйста, проверьте позже.</p>
          <Button onClick={handleRetry} variant="outline">Обновить</Button>
        </div>
      </section>
    );
  }

  return (
    <section id="collections-grid" className="max-w-[1440px] px-12 pt-16 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collections.map((collection) => (
          <Link
            href={`/${lang}/collections/${collection.slug}`}
            key={collection.id}
            className="group cursor-pointer p-4 rounded hover:bg-gray-50 transition duration-300"
          >
            {collection.imageBase64 ? (
              <div className="mb-4 overflow-hidden relative rounded">
                <Image
                  src={collection.imageBase64}
                  alt={collection.name}
                  width={0}
                  height={0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="aspect-[4/3] bg-gray-200 flex items-center justify-center mb-4 rounded">
                <span className="text-gray-600 text-lg">{collection.name}</span>
              </div>
            )}
            <h2 className="text-xl font-medium mb-2">{collection.name}</h2>
            <p className="text-gray-600">{collection.description || ''}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
