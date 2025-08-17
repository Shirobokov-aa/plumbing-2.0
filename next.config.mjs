/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    // Добавляем опции для улучшения обработки изображений
    unoptimized: process.env.NODE_ENV !== "production",
  },
  // Отключаем строгий режим для решения проблем гидратации
  reactStrictMode: false,
  // Включаем экспериментальную функцию для улучшения SSR
  experimental: {
    optimizeCss: true,
    // Увеличиваем максимальный размер тела запроса для Server Actions
    serverActions: {
      bodySizeLimit: "30mb",
    },
  },
  // Настройка для ограничения срока действия кэша в Docker
  staticPageGenerationTimeout: 120,
  // Отключаем кэширование для разработки и Docker
  onDemandEntries: {
    // Опция определяющая, сколько времени страница должна оставаться в памяти
    maxInactiveAge: 10,
    // Количество страниц, которые должны оставаться в памяти
    pagesBufferLength: 1,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        crypto: false,
      };
    }
    return config;
  },
};

export default nextConfig;
