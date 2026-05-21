'use client'
import { CMSLink } from '@/components/Link'
import { Cart } from '@/components/Cart'
import { OpenCartButton } from '@/components/Cart/OpenCart'
import Link from 'next/link'
import { MobileMenu } from './MobileMenu'
import type { Header } from 'src/payload-types'
import { Logo } from '@/components/Logo/Logo'
import { usePathname } from 'next/navigation'
import { cn } from '@/utilities/cn'
import { Suspense } from 'react'

type Props = {
  header: Header
}

export function HeaderClient({ header }: Props) {
  const menu = header.navItems || []
  const pathname = usePathname()

  return (
    <div className="relative z-20 border-b">
      <nav className="flex items-end justify-between container pt-2">
        <div className="flex shrink-0 items-end gap-2">
          <div className="md:hidden">
            <Suspense fallback={null}>
              <MobileMenu menu={menu} />
            </Suspense>
          </div>
          <Link className="flex items-center py-4" href="/">
            <Logo className="h-8 w-auto object-contain" />
          </Link>
        </div>

        {menu.length ? (
          <ul className="hidden flex-1 items-end justify-center gap-4 md:flex">
            {menu.map((item) => (
              <li key={item.id}>
                <CMSLink
                  {...item.link}
                  size={'clear'}
                  className={cn('navLink relative items-end', {
                    active:
                      item.link.url && item.link.url !== '/'
                        ? pathname.includes(item.link.url)
                        : false,
                  })}
                  appearance="nav"
                />
              </li>
            ))}
          </ul>
        ) : null}

        <div className="flex shrink-0 items-end">
          <Suspense fallback={<OpenCartButton />}>
            <Cart />
          </Suspense>
        </div>
      </nav>
    </div>
  )
}
