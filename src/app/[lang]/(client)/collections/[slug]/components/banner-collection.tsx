import Image from "next/image";
import { CollectionSection } from "@/types/types";

interface BannerCollectionProps {
  image?: string | null;
  content?: {
    sections: CollectionSection[];
  } | null;
}

export default function BannerCollection({ image, content }: BannerCollectionProps) {
  // Не отображаем секцию, если нет ни изображения, ни контента
  if (!image && (!content || !content.sections || content.sections.length === 0)) {
    return null;
  }

  return (
    <>
      {image && (
        <>
          <div className="max-w-[1440px] px-12 pt-16 mx-auto mb-8">
            <h2 className="text-4xl mb-5 uppercase">Вдохновение</h2>
          </div>
          <section className="relative w-full lg:h-[700px] h-[400px] overflow-hidden mb-16">
            <Image
              src={image}
              alt="Collection Banner"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </section>
        </>
      )}
            {content && content.sections && content.sections.length > 0 && (
        <section className="max-w-[1440px] px-12 mx-auto mb-16">
          <div className="mt-8">
            {content.sections.map((section, index) => (
              <div key={index} className="mb-8">
                {section.title && <h3 className="text-2xl font-medium mb-4">{section.title}</h3>}
                {section.description && <p className="text-gray-600">{section.description}</p>}
                {section.image && (
                  <div className="mt-4 relative h-[400px] w-full overflow-hidden rounded-lg">
                    <Image
                      src={section.image}
                      alt={section.title || "Section Image"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
