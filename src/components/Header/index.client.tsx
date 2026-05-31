'use client'
import { Cart } from '@/components/Cart'
import { OpenCartButton } from '@/components/Cart/OpenCart'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/cn'
import { SearchIcon, XIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Suspense, useEffect, useRef, useState } from 'react'
import type { Header } from 'src/payload-types'
import { MobileMenu } from './MobileMenu'

type Props = {
  header: Header
}

export function HeaderClient({ header }: Props) {
  const menu = header.navItems || []
  const pathname = usePathname()
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchOpen) {
      inputRef.current?.focus()
    }
  }, [searchOpen])

  useEffect(() => {
    setSearchOpen(false)
    setQuery('')
  }, [pathname])

  useEffect(() => {
    if (!searchOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSearchOpen(false)
        setQuery('')
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [searchOpen])

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmed = query.trim()
    if (!trimmed) return

    router.push(`/shop?q=${encodeURIComponent(trimmed)}`)
    setSearchOpen(false)
    setQuery('')
  }

  return (
    <div className="relative z-20 border-b">
      <nav className="flex items-end justify-between container pt-2">
        <Link className="flex shrink-0 items-center py-4" href="/">
          <Logo className="h-8 w-auto object-contain" />
        </Link>

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

        <div className="flex shrink-0 items-end gap-4">
          <div className="order-1 md:order-2">
            <Suspense fallback={<OpenCartButton />}>
              <Cart />
            </Suspense>
          </div>
          <Button
            type="button"
            variant="nav"
            size="clear"
            aria-expanded={searchOpen}
            aria-label={searchOpen ? 'Close search' : 'Open search'}
            className={cn(
              'navLink relative order-2 items-end hover:cursor-pointer focus-visible:ring-0 focus-visible:ring-offset-0 md:order-1',
              {
                active: searchOpen || pathname.startsWith('/shop'),
              },
            )}
            onClick={() => setSearchOpen((open) => !open)}
          >
            <SearchIcon className="size-4" />
          </Button>
          <div className="order-3 md:hidden">
            <Suspense fallback={null}>
              <MobileMenu menu={menu} />
            </Suspense>
          </div>
        </div>
      </nav>

      <div
        className={cn(
          'overflow-hidden transition-[max-height,opacity] duration-300 ease-out',
          searchOpen ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <form
          onSubmit={handleSearchSubmit}
          className="container flex items-center gap-4 border-t border-border/20 py-2.5"
        >
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            name="search"
            type="text"
            enterKeyHint="search"
            autoComplete="off"
            placeholder="Search products..."
            className="h-9 w-full appearance-none border-0 border-b border-border/50 bg-transparent px-0 text-sm tracking-wide text-foreground shadow-none outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-foreground/35 focus:shadow-none focus:outline-none focus:!ring-0 focus:!ring-offset-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 focus-visible:shadow-none focus-visible:outline-none"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close search"
            className="size-8 shrink-0 text-muted-foreground hover:bg-transparent hover:text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            onClick={() => {
              setSearchOpen(false)
              setQuery('')
            }}
          >
            <XIcon className="size-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
