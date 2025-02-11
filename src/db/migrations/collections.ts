// import { db } from "../index"
// import { collectionsTable } from "../schema"

// const initialCollections = [
//   {
//     id: 1,
//     image: "/img/item-era.png",
//     title: "ERA",
//     desc: "Коллекция ERA воплощает гармонию современного дизайна...",
//     link: "/",
//     flexDirection: "xl:flex-row"
//   },
//   {
//     id: 2,
//     image: "/img/item-era.png",
//     title: "ERA",
//     desc: "Коллекция ERA воплощает гармонию современного дизайна...",
//     link: "/",
//     flexDirection: "xl:flex-row"
//   },
//   // ... остальные коллекции ...
// ]

// async function seed() {
//   try {
//     await db.insert(collectionsTable).values({
//       id: 1,
//       data: initialCollections
//     })
//     console.log('✅ Коллекции успешно добавлены')
//   } catch (error) {
//     console.error('Ошибка при добавлении коллекций:', error)
//   }
// }

// seed() 