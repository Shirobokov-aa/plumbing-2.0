interface TitleCollectionProps {
  title: string;
  subTitle?: string | null;
  description?: string | null;
}

export default function TitleCollection({ title, subTitle, description }: TitleCollectionProps) {
  return (
    <section className="max-w-[1440px] lg:px-12 px-4 pt-16 mx-auto">
      <div className="flex flex-col items-start">
        <h2 className="text-4xl mb-2">{title}</h2>
        {subTitle && <p className="text-xl text-gray-600 mb-10">{subTitle}</p>}
        {description && <p className="text-lg text-gray-600 ">{description}</p>}
      </div>
    </section>
  );
}
