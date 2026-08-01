'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { loginAction } from '@/app/admin/actions'
import type { LoginState } from '@/app/admin/result'
import { BTN, ErrorNote, Field, INPUT } from './ui'

function Submit() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className={`${BTN} w-full py-3`}>
      {pending ? 'Checking…' : 'Sign in'}
    </button>
  )
}

export function LoginForm() {
  const [state, formAction] = useActionState<LoginState, FormData>(loginAction, {})

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="Email" htmlFor="email">
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          autoFocus
          className={INPUT}
        />
      </Field>

      <Field label="Password" htmlFor="password">
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={INPUT}
        />
      </Field>

      {state.error && <ErrorNote>{state.error}</ErrorNote>}

      <Submit />
    </form>
  )
}
