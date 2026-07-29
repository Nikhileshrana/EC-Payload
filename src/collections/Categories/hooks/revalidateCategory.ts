import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

import type { Category } from '@/payload-types'

export const revalidateCategory: CollectionAfterChangeHook<Category> = ({
  doc,
  req: { context, payload },
}) => {
  if (context?.disableRevalidate) {
    return doc
  }

  payload.logger.info('Revalidating shop categories')
  revalidateTag('categories', 'max')
  revalidatePath('/shop')
  revalidatePath('/')

  return doc
}

export const revalidateCategoryDelete: CollectionAfterDeleteHook<Category> = ({
  doc,
  req: { context },
}) => {
  if (context?.disableRevalidate) {
    return doc
  }

  revalidateTag('categories', 'max')
  revalidatePath('/shop')
  revalidatePath('/')

  return doc
}
