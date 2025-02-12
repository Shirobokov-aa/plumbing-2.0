import { updateAllCollectionLinks } from "@/app/actions/collections"
import { Button } from "@/components/ui/button"

export default function UpdateLinksPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Обновление ссылок коллекций</h1>
      <form action={updateAllCollectionLinks}>
        <Button type="submit">Обновить все ссылки</Button>
      </form>
    </div>
  )
}
