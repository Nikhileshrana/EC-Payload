import { OrderStatus as StatusOptions } from '@/payload-types'
import { cn } from '@/utilities/cn'

const statusLabels: Record<NonNullable<StatusOptions>, string> = {
  paid: 'Paid',
  processing: 'Processing',
  completed: 'Completed',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
}

type Props = {
  status: StatusOptions
  className?: string
}

export const OrderStatus: React.FC<Props> = ({ status, className }) => {
  if (!status) return null

  return (
    <div
      className={cn(
        'text-xs tracking-widest font-mono uppercase py-0 px-2 rounded w-fit',
        className,
        {
          'bg-success/15 text-success': status === 'paid' || status === 'completed',
          'bg-primary/10': status === 'processing',
        },
      )}
    >
      {statusLabels[status] ?? status}
    </div>
  )
}
