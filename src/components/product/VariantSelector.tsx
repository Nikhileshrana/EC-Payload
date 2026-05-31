'use client'

import type { Product } from '@/payload-types'

import { createUrl } from '@/utilities/createUrl'
import { cn } from '@/utilities/cn'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

type Props = {
  product: Product
  variantTypeName?: string
}

export function VariantSelector({ product, variantTypeName }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const variants = product.variants?.docs
  const variantTypes = product.variantTypes
  const hasVariants = Boolean(product.enableVariants && variants?.length && variantTypes?.length)

  if (!hasVariants) {
    return null
  }

  const typesToRender = variantTypeName
    ? variantTypes?.filter((type) => type && typeof type === 'object' && type.name === variantTypeName)
    : variantTypes?.filter((type) => type && typeof type === 'object' && type.name !== 'size')

  return typesToRender?.map((type) => {
    if (!type || typeof type !== 'object') {
      return null
    }

    const options = type.options?.docs
    const isSize = type.name === 'size'

    if (!options || !Array.isArray(options) || !options.length) {
      return null
    }

    const selectedOptionId = searchParams.get(type.name)
    const selectedOption = options.find(
      (option) => option && typeof option === 'object' && String(option.id) === selectedOptionId,
    )
    const selectedLabel =
      selectedOption && typeof selectedOption === 'object' ? selectedOption.label : null

    return (
      <div className="flex flex-col gap-3" key={type.id}>
        <p className="text-sm text-foreground">
          {type.label}
          {selectedLabel ? `: ${selectedLabel}` : null}
        </p>

        <div className={cn(isSize ? 'grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6' : 'flex flex-wrap gap-2')}>
          {options.map((option) => {
            if (!option || typeof option !== 'object') {
              return null
            }

            const optionID = option.id
            const optionKeyLowerCase = type.name
            const optionSearchParams = new URLSearchParams(searchParams.toString())

            optionSearchParams.delete('variant')
            optionSearchParams.delete('image')
            optionSearchParams.set(optionKeyLowerCase, String(optionID))

            const currentOptions = Array.from(optionSearchParams.values())
            let isAvailableForSale = true

            if (variants) {
              const matchingVariant = variants
                .filter((variant) => typeof variant === 'object')
                .find((variant) => {
                  if (!variant.options || !Array.isArray(variant.options)) return false

                  return variant.options.every((variantOption) => {
                    if (typeof variantOption !== 'object') {
                      return currentOptions.includes(String(variantOption))
                    }

                    return currentOptions.includes(String(variantOption.id))
                  })
                })

              if (matchingVariant) {
                optionSearchParams.set('variant', String(matchingVariant.id))
                isAvailableForSale = Boolean(matchingVariant.inventory && matchingVariant.inventory > 0)
              }
            }

            const optionUrl = createUrl(pathname, optionSearchParams)
            const isActive =
              Boolean(isAvailableForSale) && searchParams.get(optionKeyLowerCase) === String(optionID)

            return (
              <button
                key={option.id}
                type="button"
                aria-disabled={!isAvailableForSale}
                aria-pressed={isActive}
                disabled={!isAvailableForSale}
                title={`${option.label}${!isAvailableForSale ? ' (Out of Stock)' : ''}`}
                className={cn(
                  'min-h-10 border px-2 py-2 text-xs font-medium uppercase tracking-wide transition',
                  isSize ? 'text-center' : 'px-4',
                  isActive
                    ? 'border-foreground bg-white text-foreground'
                    : 'border-neutral-200 bg-white text-foreground hover:border-neutral-400',
                  !isAvailableForSale && 'cursor-not-allowed opacity-40',
                )}
                onClick={() => {
                  router.replace(`${optionUrl}`, {
                    scroll: false,
                  })
                }}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>
    )
  })
}
