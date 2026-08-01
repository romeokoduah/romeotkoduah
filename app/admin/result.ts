/**
 * Every server action in the dashboard resolves to one of these. Nothing is
 * thrown across the boundary: a failure is a value the caller can render.
 */
export type ActionResult<T = object> = ({ ok: true } & T) | { ok: false; error: string }

export interface LoginState {
  error?: string
}

export interface MessageState {
  error?: string
  message?: string
}
