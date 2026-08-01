import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { currentAdminId } from '@/lib/auth'
import { countPendingComments } from '@/lib/blog'
import { AdminShell } from '@/components/admin/shell'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false, nocache: true },
}

/**
 * The guard for everything under `/admin` except the login page, which sits
 * outside this route group on purpose. Server actions do not inherit this
 * check — each one re-establishes it for itself.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const adminId = await currentAdminId().catch(() => null)
  if (!adminId) redirect('/admin/login')

  // A badge is not worth a 500: an unreachable database still lets the rest
  // of the dashboard render and say so.
  const pending = await countPendingComments().catch(() => 0)

  return <AdminShell pending={pending}>{children}</AdminShell>
}
