import { Grid } from '@/components/Grid'
import React from 'react'

export default function Loading() {
  return (
    <Grid className="grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-3 2xl:grid-cols-4">
      {Array(12)
        .fill(0)
        .map((_, index) => (
          <div className="flex flex-col text-center" key={index}>
            <div className="aspect-[3/4] animate-pulse bg-neutral-100" />
            <div className="mx-auto mt-4 h-4 w-3/4 animate-pulse rounded bg-neutral-100" />
            <div className="mx-auto mt-2 h-3 w-1/2 animate-pulse rounded bg-neutral-100" />
            <div className="mx-auto mt-2 h-3 w-1/3 animate-pulse rounded bg-neutral-100" />
          </div>
        ))}
    </Grid>
  )
}
