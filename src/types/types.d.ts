interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  order: number
  createdAt?: Date | null
  updatedAt?: Date | null
}

interface MenuCategory {
  name: string
  subcategories: SubCategory[]
  images: string[]
}

interface ProductVariant {
  id?: number
  name: string
  value: string
  available: boolean
}

interface ProductImage {
  id: number
  src: string
  alt?: string
  order: number
}

interface Product {
  id: number
  categoryId: number | null
  name: string
  slug: string
  description?: string | null
  article?: string | null
  specifications: Record<string, string> | null
  order: number
  images: ProductImage[]
  variants: ProductVariant[]
  price: number
  createdAt?: Date | null
  updatedAt?: Date | null
}

interface AboutPageData {
  banner?: {
    name: string
    image: string
    title: string
    description: string
    link: {
      text: string
      url: string
    }
  } | null
  sections: {
    id: number
    title: string
    description: string
    order: number
  }[]
}

interface CollectionDetailInput {
  name: string
  bannerImage: string
  bannerTitle: string
  bannerDescription: string
  bannerLinkText: string
  bannerLinkUrl: string
  sections1: Array<{
    title: string
    description: string
    linkText: string
    linkUrl: string
    order: number
    images: Array<{ src: string; alt: string; order: number }>
  }>
  sections2: Array<{
    title: string
    description: string
    linkText: string
    linkUrl: string
    titleDesc: string
    descriptionDesc: string
    order: number
    images: Array<{ src: string; alt: string; order: number }>
  }>
  sections3: Array<{
    title: string
    description: string
    linkText: string
    linkUrl: string
    order: number
    images: Array<{ src: string; alt: string; order: number }>
  }>
  sections4: Array<{
    title: string
    description: string
    order: number
    images: Array<{ src: string; alt: string; order: number }>
  }>
}

interface ImageBlockData {
  src: string
  alt: string
  order: number
  desc?: string
  url?: string
}

interface SectionData {
  title?: string
  description?: string
  link?: {
    name?: string
    url?: string
  }
  images?: string[]
  images_block?: ImageBlockData[]
}

interface FormattedSection {
  [key: string]: {
    title?: string
    description?: string
    link?: {
      name?: string
      url?: string
    }
    images?: string[]
    images_block?: ImageBlockData[]
  }
}

interface CollectionImage {
  src: string
  alt: string
  order: number
}

interface BathroomCollection {
  id: number
  title: string
  description: string
  link: {
    text: string
    url: string
  }
  images: CollectionImage[]
  order: number
}

interface Section {
  title?: string
  description?: string
  link?: {
    name?: string
    url?: string
  }
  images_block?: ImageBlockData[]
  images?: string[]
}

interface SectionsMainPage {
  [key: string]: Section
}

interface BathroomSection {
  id: number
  title: string
  description: string
  linkText: string
  linkUrl: string
  order: number
  createdAt: Date | null
  updatedAt: Date | null
  images: {
    id: number
    src: string
    alt: string | null
    order: number | null
    sectionId: number | null
    collectionId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }[]
}

interface KitchenSection {
  id: number
  title: string
  description: string
  link: { text: string; url: string }
  images: { src: string; alt: string; order: number }[]
  order: number
}

interface AboutSection {
  title: string
  description: string
}

interface BathroomPage {
  banner: {
    id: number
    name: string | null
    image: string | null
    title: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
    linkText: string | null
    linkUrl: string | null
  } | null
  sections: BathroomSection[]
  collections: BathroomCollection[]
}

interface KitchenPage {
  banner: {
    name: string
    image: string
    title: string
    description: string
    link: { text: string; url: string }
  }
  sections: KitchenSection[]
  collections: KitchenCollection[]
}

interface AboutPage {
  banner: {
    name: string
    image: string
    title: string
    description: string
    link: { text: string; url: string }
  }
  sections: AboutSection[]
}

interface KitchenCollection {
  id: number
  title: string
  description: string
  link: { text: string; url: string }
  images: ImageBlockData[]
  order: number
}

interface CollectionItem {
  id: number
  image: string
  title: string
  desc: string
  link: string
  flexDirection: "xl:flex-row" | "xl:flex-row-reverse"
}

interface CollectionDetailData {
  id: number
  name: string
  bannerImage: string | null
  bannerTitle: string | null
  bannerDescription: string | null
  bannerLinkText: string | null
  bannerLinkUrl: string | null
  sections1: {
    title: string
    description: string
    linkText?: string
    linkUrl?: string
    order: number
    images: {
      src: string
      alt: string
      order: number
    }[]
  }[]
  sections2: {
    title: string
    description: string
    linkText?: string
    linkUrl?: string
    titleDesc: string
    descriptionDesc: string
    order: number
    images: {
      src: string
      alt: string
      order: number
    }[]
  }[]
  sections3: {
    title: string
    description: string
    linkText?: string
    linkUrl?: string
    order: number
    images: {
      src: string
      alt: string
      order: number
    }[]
  }[]
  sections4: {
    title: string
    description: string
    order: number
    images: {
      src: string
      alt: string
      order: number
    }[]
  }[]
  createdAt?: Date | null
  updatedAt?: Date | null
}

interface SectionsContextType {
  sections: SectionsMainPage | null
  isLoading: boolean
  collections: CollectionItem[]
  collectionDetails: CollectionDetailData[]
  bathroomPage: BathroomPage
  kitchenPage: KitchenPage
  aboutPage: AboutPage
  updateSection: (sectionKey: string, newData: Section) => void
  updateCollections: (newCollections: CollectionItem[]) => void
  updateCollectionDetail: (id: number, newData: CollectionDetailData) => void
  updateBathroomPage: (data: BathroomPage) => void
  updateKitchenPage: (newData: KitchenPage) => void
  updateAboutPage: (newData: AboutPage) => void
}

interface ProductSpecificationsProps {
  specifications: Record<string, string>
  onChange: (specs: Record<string, string>) => void
}

interface BathroomBanner {
  id: number
  name: string | null
  title: string | null
  description: string | null
  image: string | null
  linkText: string | null
  linkUrl: string | null
  createdAt: Date | null
  updatedAt: Date | null
  link?: { text: string; url: string }
}

interface CategoryFilterProps {
  categories: Category[]
}

interface LoadMoreProps {
  currentPage: number
  totalItems: number
  itemsPerPage: number
}

interface ProductCardProps {
  product: Product
}

interface ProductFiltersProps {
  activeFilters: string[]
  totalProducts: number
}

interface ProductGalleryProps {
  images: ProductImage[]
  productName: string
}

interface ProductGridProps {
  products: Product[]
}

interface ProductSpecificationsProps {
  specifications: Record<string, string>
}

interface ProductVariantsProps {
  variants: ProductVariant[]
  onSelect?: (variant: ProductVariant) => void
}

interface CollectionContentProps {
  id: number
}

interface CollectionDetail {
  id: number
  name: string
  banner: {
    image: string | null
    title: string | null
    description: string | null
    link: { text: string | null; url: string | null }
  }
  sections: Array<{
    title: string
    description: string
    linkText?: string
    linkUrl?: string
    images: Array<{ src: string; alt: string; order: number }>
  }>
  sections2?: Array<{
    title: string
    description: string
    linkText?: string
    linkUrl?: string
    titleDesc: string
    descriptionDesc: string
    images: Array<{ src: string; alt: string; order: number }>
  }>
  sections3?: Array<{
    title: string
    description: string
    linkText?: string
    linkUrl?: string
    images: Array<{ src: string; alt: string; order: number }>
  }>
  sections4?: Array<{
    title: string
    description: string
    images: Array<{ src: string; alt: string; order: number }>
  }>
}

interface SectionProps {
  key?: number
  title: string
  description: string
  linkText?: string
  linkUrl?: string
  images: Array<{ src: string; alt: string; order: number }>
  reverse?: boolean
  titleDesc?: string
  descriptionDesc?: string
}

interface Section1Props {
  key?: number
  title: string
  description: string
  linkText?: string
  linkUrl?: string
  images: Array<{ src: string; alt: string; order: number }>
  reverse?: boolean
}

interface Section2Props {
  key?: number
  title: string
  description: string
  linkText?: string
  linkUrl?: string
  titleDesc: string
  descriptionDesc: string
  images: Array<{ src: string; alt: string; order: number }>
  reverse?: boolean
}

interface Section3Props {
  key?: number
  title: string
  description: string
  linkText?: string
  linkUrl?: string
  images: Array<{ src: string; alt: string; order: number }>
  reverse?: boolean
}

interface Section4Props {
  key?: number
  title: string
  description: string
  images: Array<{ src: string; alt: string; order: number }>
  reverse?: boolean
}

interface PageProps {
  params: Promise<{ id: string }> | { id: string }
}

interface SectionsProviderProps {
  children: React.ReactNode
  initialData: {
    banner: BathroomBanner | null
    sections: BathroomSection[]
    collections: BathroomCollection[]
  }
}

interface AboutProps {
  name: string
  image: string
  title: string
  description: string
  link: { text: string; url: string }
}

interface AboutSectionProps {
  title: string;
  description: string;
}

interface BannerProps {
  name: string
  image: string
  title: string
  description: string
  link: { text: string; url: string }
}

interface BathSectionCollectionProps {
  title: string;
  description: string;
  link: { text: string; url: string };
  images: ImageBlockData[];
}

interface BathSectionProps {
  title: string;
  description: string;
  link: { text: string; url: string };
  images: ImageBlockData[];
}

interface Slide {
  id: number
  desktopImage: string
  mobileImage: string
  title: string
  linkUrl: string
  order: number | null
}

interface Image {
  id: number;
  src: string;
  alt: string;
  desc: string;
  url: string;
}

// Пропсы для компонента Collections
interface CollectionsProps {
  images: { src: string; alt: string; desc: string; url: string }[]; // Изменили тип данных
}

interface CollectionBannerProps {
  name: string
  image: string | null
  title: string
  description: string
  link: { text: string; url: string }
}

interface CollectionSection1Props {
  title: string
  description: string
  linkText?: string
  linkUrl?: string
  images: Array<{ src: string; alt: string; order: number }>
  reverse?: boolean
}

interface CollectionSection2Props {
  title: string
  description: string
  linkText?: string
  linkUrl?: string
  titleDesc: string
  descriptionDesc: string
  images: Array<{ src: string; alt: string; order: number }>
}

interface CollectionSection3Props {
  title: string
  description: string
  linkText?: string
  linkUrl?: string
  images: Array<{ src: string; alt: string; order: number }>
}

interface CollectionSection4Props {
  title: string
  description: string
  images: Array<{ src: string; alt: string; order: number }>
  reverse?: boolean
}

interface KitchenProps {
  name: string
  image: string
  title: string
  description: string
  link: { text: string; url: string }
}

interface KitchenSectionCollectionProps {
  title: string;
  description: string;
  link: { text: string; url: string };
  images: ImageBlockData[];
}

interface KitchenSectionProps {
  title: string;
  description: string;
  link: { text: string; url: string };
  images: ImageBlockData[];
}

interface HeaderProps {
  defaultTextColor?: string
  activeTextColor?: string
}

interface SubCategory {
  name: string;
  href: string;
}

interface Category {
  name: string;
  subcategories: SubCategory[];
  images: string[];
}

interface HoverMenuProps {
  category: MenuCategory
  isVisible: boolean
  onClose: () => void
}
