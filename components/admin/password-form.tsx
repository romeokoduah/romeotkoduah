'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { changePasswordAction } from '@/app/admin/actions'
import type { MessageState } from '@/app/admin/result'
import { BTN, ErrorNote, Field, INPUT, OkNote } from './ui'

function Submit() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className={BTN}>
      {pending ? 'Changing…' : 'Change password'}
    </button>
  )
}

export function PasswordForm() {
  const [state, formAction] = useActionState<MessageState, FormData>(changePasswordAction, {})

  return (
    <form action={formAction} className="flex max-w-[420px] flex-col gap-4">
      <Field label="Current password" htmlFor="current">
        <input
          id="current"
          name="current"
          type="password"
          autoComplete="current-password"
          required
          className={INPUT}
        />
      </Field>

      <Field
        label="New password"
        htmlFor="next"
        hint="At least 12 characters. Length beats punctuation — a passphrase is fine."
      >
        <input
          id="next"
          name="next"
          type="password"
          autoComplete="new-password"
          minLength={12}
          required
          className={INPUT}
        />
      </Field>

      <Field label="Repeat the new password" htmlFor="confirm">
        <input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          minLength={12}
          required
          className={INPUT}
        />
      </Field>

      {state.error && <ErrorNote>{state.error}</ErrorNote>}
      {state.message && <OkNote>{state.message}</OkNote>}

      <div>
        <Submit />
      </div>
    </form>
  )
}
