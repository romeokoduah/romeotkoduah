import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { currentAdminId } from '@/lib/auth'
import { LoginForm } from '@/components/admin/login-form'
import { PANEL } from '@/components/admin/ui'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false },
}

export default async function LoginPage() {
  // Deliberately outside the dashboard guard — otherwise signing in would
  // require already being signed in.
  const id = await currentAdminId().catch(() => null)
  if (id) redirect('/admin')

  return (
    <div className="bg-soft py-s50">
      <div className="mx-auto w-full max-w-[420px] px-s30">
        <p className="mb-2 font-body text-[11px] font-bold uppercase tracking-[0.18em] text-ink/50">
          romeotkoduah.org
        </p>
        <h1 className="mb-6 font-head text-[34px] font-medium uppercase leading-none tracking-[0.02em]">
          Dashboard
        </h1>

        <div className={`${PANEL} p-5`}>
          <LoginForm />
        </div>

        <p className="mt-4 font-body text-xs text-ink/45">
          This page is not indexed. Sessions last twelve hours.
        </p>
      </div>
    </div>
  )
}
