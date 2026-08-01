'use client'

import { useRouter } from 'next/navigation'
import { deleteAlbumAction } from '@/app/admin/actions'
import { ConfirmAction } from './confirm-action'

export function DeleteAlbum({
  id,
  photoCount,
  redirectTo,
}: {
  id: string
  photoCount: number
  redirectTo?: string
}) {
  const router = useRouter()
  return (
    <ConfirmAction
      label="Delete album"
      confirmLabel={photoCount > 0 ? `Delete with ${photoCount} photos` : 'Delete album'}
      question="Delete permanently?"
      run={() => deleteAlbumAction(id)}
      onDone={() => {
        if (redirectTo) router.push(redirectTo)
        else router.refresh()
      }}
    />
  )
}
