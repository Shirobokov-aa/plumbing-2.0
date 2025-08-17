import { Product } from "@/types/types";

export const productData: Product[] = [
  // Ванная - Смесители для раковины
  {
    id: 1,
    name: "Смеситель для раковины A100",
    images: ["/image/placeholder.svg"],
    colors: [
      { code: "#000000", name: "Черный" },
      { code: "#C0C0C0", name: "Хром" }
    ],
    price: 5900,
    category: "bathroom",
    subcategory: "sink-mixers",
    description: "Современный смеситель для раковины с керамическим картриджем. Гладкая поверхность и стильный дизайн. Подходит для раковин различных типов. Материал: латунь. Гарантия: 5 лет."
  },
  {
    id: 2,
    name: "Смеситель для раковины A200",
    images: ["/image/placeholder.svg"],
    colors: [
      { code: "#C0C0C0", name: "Хром" },
      { code: "#B87333", name: "Медь" }
    ],
    price: 7500,
    category: "bathroom",
    subcategory: "sink-mixers",
    description: "Премиальный смеситель для раковины с технологией экономии воды. Элегантный дизайн и улучшенные характеристики. Бесшумная работа, керамический картридж. Материал: латунь высшего качества. Гарантия: 7 лет."
  },

  // Ванная - Смесители для ванны и душа
  {
    id: 3,
    name: "Смеситель для ванны B100",
    images: ["/image/placeholder.svg"],
    colors: [{ code: "#C0C0C0", name: "Хром" }],
    price: 9800,
    category: "bathroom",
    subcategory: "bath-shower-mixers",
    description: "Надежный смеситель для ванны с переключателем на душ. Эргономичный дизайн, плавное регулирование температуры и напора воды. Материал: латунь. Покрытие: хром. Гарантия: 5 лет."
  },

  // Ванная - Душевые системы
  {
    id: 4,
    name: "Душевая система C100",
    images: ["/image/placeholder.svg"],
    colors: [{ code: "#000000", name: "Черный" }],
    price: 15000,
    category: "bathroom",
    subcategory: "shower-systems",
    description: "Комплексная душевая система с верхним душем, ручной лейкой и термостатом. Защита от ожогов, регулировка напора. Материал: нержавеющая сталь, латунь. Цвет: черный матовый. Гарантия: 10 лет."
  },

  // Ванная - Унитазы
  {
    id: 8,
    name: "Унитаз подвесной T100",
    images: ["/image/placeholder.svg"],
    colors: [{ code: "#FFFFFF", name: "Белый" }],
    price: 18500,
    category: "bathroom",
    subcategory: "toilets",
    description: "Современный подвесной унитаз с технологией бесшумного смыва. Безободковая конструкция для легкой очистки. Материал: санфаянс высшего качества. Мягкое закрывание крышки. Гарантия: 10 лет."
  },
  {
    id: 9,
    name: "Унитаз напольный T200",
    images: ["/image/placeholder.svg"],
    colors: [
      { code: "#FFFFFF", name: "Белый" },
      { code: "#000000", name: "Черный" }
    ],
    price: 22000,
    category: "bathroom",
    subcategory: "toilets",
    description: "Элегантный напольный унитаз с двухрежимной системой смыва для экономии воды. Антибактериальное покрытие, легкая очистка. Материал: санфаянс премиум-класса. Гарантия: 15 лет."
  },

  // Кухня - Смесители для кухни
  {
    id: 5,
    name: "Смеситель для кухни K100",
    images: ["/image/placeholder.svg"],
    colors: [{ code: "#C0C0C0", name: "Хром" }],
    price: 6500,
    category: "kitchen",
    subcategory: "kitchen-mixers",
    description: "Практичный смеситель для кухни с поворотным изливом. Удобная рукоятка, керамический картридж. Материал: латунь. Покрытие: хром. Гарантия: 5 лет."
  },
  {
    id: 6,
    name: "Смеситель для кухни K200",
    images: ["/image/placeholder.svg"],
    colors: [
      { code: "#000000", name: "Черный" },
      { code: "#B87333", name: "Медь" }
    ],
    price: 8900,
    category: "kitchen",
    subcategory: "kitchen-mixers",
    description: "Премиальный смеситель для кухни с выдвижной лейкой и двумя режимами струи. Высококачественный керамический картридж, бесшумная работа. Материал: латунь. Гарантия: 7 лет."
  },

  // Кухня - Аксессуары - Дозаторы
  {
    id: 7,
    name: "Дозатор для мыла D100",
    images: ["/image/placeholder.svg"],
    colors: [{ code: "#C0C0C0", name: "Хром" }],
    price: 2300,
    category: "kitchen",
    subcategory: "dispensers",
    description: "Стильный дозатор для жидкого мыла. Объем: 300 мл. Удобная конструкция, прочный материал. Легко заполнять и использовать. Материал: нержавеющая сталь. Гарантия: 3 года."
  },
  {
    id: 10,
    name: "Дозатор встраиваемый D200",
    images: ["/image/placeholder.svg"],
    colors: [
      { code: "#C0C0C0", name: "Хром" },
      { code: "#000000", name: "Черный" }
    ],
    price: 3500,
    category: "kitchen",
    subcategory: "dispensers",
    description: "Встраиваемый дозатор для моющего средства. Объем: 500 мл. Элегантный дизайн, простая установка. Материал: латунь, пластик. Бутылка легко заполняется сверху. Гарантия: 5 лет."
  }
];
