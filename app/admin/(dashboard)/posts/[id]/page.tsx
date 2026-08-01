import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostById } from '@/lib/blog'
import { listRecentPhotos } from '@/lib/gallery'
import type { Photo } from '@/lib/blog-types'
import { PostEditor } from '@/components/admin/post-editor'
import { ErrorNote } from '@/components/admin/ui'

export const dynamic = 'force-dynamic'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function PostEditorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  if (!UUID.test(id)) notFound()

  let post: Awaited<ReturnType<typeof getPostById>> = null
  let photos: Photo[] = []
  let error: string | null = null

  try {
    ;[post, photos] = await Promise.all([getPostById(id), listRecentPhotos(60)])
  } catch {
    error = 'The post could not be loaded — the database is not answering.'
  }

  if (error) return <ErrorNote>{error}</ErrorNote>
  if (!post) notFound()

  return (
    <>
      <Link
        href="/admin/posts"
        className="mb-4 inline-block font-body text-xs font-bold uppercase tracking-[0.14em] text-ink/50 underline underline-offset-4 transition-colors hover:text-ink"
      >
        ← All posts
      </Link>
      <PostEditor post={post} photos={photos} />
    </>
  )
}
