import { currentAdminId } from '@/lib/auth'
import { getAdminById } from '@/app/admin/queries'
import { logoutAction } from '@/app/admin/actions'
import { PasswordForm } from '@/components/admin/password-form'
import { BTN_GHOST, PageHead, Panel } from '@/components/admin/ui'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const id = await currentAdminId().catch(() => null)
  const user = id ? await getAdminById(id).catch(() => null) : null

  return (
    <>
      <PageHead
        title="Settings"
        lede="One account, one password. There is nothing else to configure here."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          title="Change password"
          note="The current password is required, so a borrowed session cannot lock you out."
        >
          <PasswordForm />
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel title="Account">
            <dl className="flex flex-col gap-3">
              <div>
                <dt className="font-body text-[11px] font-bold uppercase tracking-[0.16em] text-ink/55">
                  Signed in as
                </dt>
                <dd className="mt-0.5 font-body text-sm">{user?.email ?? 'Unknown'}</dd>
              </div>
              <div>
                <dt className="font-body text-[11px] font-bold uppercase tracking-[0.16em] text-ink/55">
                  Session
                </dt>
                <dd className="mt-0.5 font-body text-sm text-ink/60">
                  A signed, HTTP-only cookie that expires twelve hours after sign-in. There is no
                  session table to clear.
                </dd>
              </div>
            </dl>
          </Panel>

          <Panel title="Sign out">
            <form action={logoutAction} className="flex flex-col items-start gap-3">
              <p className="font-body text-sm text-ink/60">
                Ends this session on this device. Any other device stays signed in until its own
                cookie expires — change the password to end those too.
              </p>
              <button type="submit" className={BTN_GHOST}>
                Sign out
              </button>
            </form>
          </Panel>
        </div>
      </div>
    </>
  )
}
