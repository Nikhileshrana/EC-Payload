import type { GlobalAfterChangeHook, GlobalSlug } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

export const createRevalidateGlobalHook = (
  slug: GlobalSlug,
  paths: string[] = ['/'],
): GlobalAfterChangeHook => {
  return ({ doc, req: { context } }) => {
    if (context?.disableRevalidate) return doc

    revalidateTag(`global_${slug}`, 'max')

    for (const path of paths) {
      revalidatePath(path)
    }

    return doc
  }
}
