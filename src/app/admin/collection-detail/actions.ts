'use server'

import { db } from "@/db"
import { collectionDetails } from "@/db/schema"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"

export async function deleteCollectionDetail(id: number) {
  try {
    await db.delete(collectionDetails).where(eq(collectionDetails.id, id))
    revalidatePath('/admin/collection-detail')
    return { success: true }
  } catch (error) {
    console.error('Error deleting collection detail:', error)
    return { success: false }
  }
}
