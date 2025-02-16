import Image from "next/image"


interface BannerProps {
  name: string
  image: string
  title: string
  description: string
  link: { text: string; url: string }
}

export default function CatalogBanner({ image, title, }: BannerProps) {
  return (
    <section>
      <div className="w-full h-[800px] relative mt-10">
        <Image src={image || "/placeholder.svg"} alt={title} layout="fill" objectFit="cover" quality={100} priority />
        <div className="absolute inset-0 flex justify-center text-white text-center bg-black/50">
          <div className="pt-24">
            <h1 className="text-4xl font-bold"></h1>
            <p className="text-lg mt-2"></p>
          </div>
        </div>
      </div>
    </section>
  )
}
