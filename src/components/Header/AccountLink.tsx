'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/cn'
import { useAuth } from '@/providers/Auth'
import { User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function AccountLink() {
  const { user } = useAuth()
  const pathname = usePathname()
  const href = user ? '/account' : '/login'
  const isActive =
    pathname.startsWith('/account') ||
    pathname === '/login' ||
    pathname === '/create-account' ||
    pathname.startsWith('/orders')

  return (
    <Button
      asChild
      variant="nav"
      size="clear"
      className={cn(
        'navLink relative items-end hover:cursor-pointer focus-visible:ring-0 focus-visible:ring-offset-0',
        { active: isActive },
      )}
    >
      <Link href={href} aria-label={user ? 'My account' : 'Log in'}>
        <User className="size-4" />
      </Link>
    </Button>
  )
}
