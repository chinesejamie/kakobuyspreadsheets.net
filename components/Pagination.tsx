'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import Link from 'next/link'

export default function Pagination({
  totalPages,
  currentPage,
}: {
  totalPages: number
  currentPage: number
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const changePage = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const maxVisiblePages = 5
  const halfVisible = Math.floor(maxVisiblePages / 2)
  let start = Math.max(1, currentPage - halfVisible)
  let end = Math.min(totalPages, start + maxVisiblePages - 1)
  if (end - start < maxVisiblePages - 1) {
    start = Math.max(1, end - maxVisiblePages + 1)
  }

  return (
    <div className="mt-10 flex flex-wrap justify-center gap-2">
      {isPending && (
        <span className="text-gray-500 text-sm">Loading...</span>
      )}
      {currentPage > 1 && (
        <button onClick={() => changePage(currentPage - 1)} className="px-4 py-2 bg-gray-200 rounded-full">
          Previous
        </button>
      )}
      {Array.from({ length: end - start + 1 }, (_, i) => start + i).map((p) => (
        <button
          key={p}
          onClick={() => changePage(p)}
          className={`px-4 py-2 text-sm rounded-full ${
            p === currentPage ? 'bg-primary-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {p}
        </button>
      ))}
      {currentPage < totalPages && (
        <button onClick={() => changePage(currentPage + 1)} className="px-4 py-2 bg-gray-200 rounded-full">
          Next
        </button>
      )}
    </div>
  )
}
