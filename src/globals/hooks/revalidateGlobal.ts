import type { GlobalAfterChangeHook, GlobalSlug } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

export const createRevalidateGlobalHook = (
  slug: GlobalSlug,
  paths: string[] = ['/'],
): GlobalAfterChangeHook => {
  return ({ doc, req: { context } }) => {
    if (context?.disableRevalidate) return doc

    revalidateTag(`global_${slug}`, 'max')

    // Header/footer/settings live in the root layout — invalidate all pages
    revalidatePath('/', 'layout')

    for (const path of paths) {
      if (path !== '/') {
        revalidatePath(path)
      }
    }

    return doc
  }
}
