import type { Product } from '@/payload-types'

export function getProductPrice(product: Product): number | undefined {
  let price = product.priceInINR ?? undefined

  if (product.enableVariants && product.variants?.docs?.length) {
    const prices = product.variants.docs
      .map((variant) => (typeof variant === 'object' ? variant.priceInINR : undefined))
      .filter((value): value is number => typeof value === 'number')

    if (prices.length) {
      price = Math.min(...prices)
    }
  }

  return typeof price === 'number' ? price : undefined
}

export function getProductSizes(product: Product): string[] {
  if (!product.enableVariants || !product.variants?.docs?.length) {
    return []
  }

  const sizes: string[] = []
  const seen = new Set<string>()

  for (const variant of product.variants.docs) {
    if (typeof variant !== 'object') continue

    for (const option of variant.options ?? []) {
      if (typeof option !== 'object') continue

      const variantType = option.variantType
      const typeName = typeof variantType === 'object' ? variantType.name : null

      if (typeName === 'size' && !seen.has(option.label)) {
        seen.add(option.label)
        sizes.push(option.label)
      }
    }
  }

  if (sizes.length) {
    return sizes
  }

  for (const variant of product.variants.docs) {
    if (typeof variant !== 'object') continue

    for (const option of variant.options ?? []) {
      if (typeof option === 'object' && !seen.has(option.label)) {
        seen.add(option.label)
        sizes.push(option.label)
      }
    }
  }

  return sizes
}
