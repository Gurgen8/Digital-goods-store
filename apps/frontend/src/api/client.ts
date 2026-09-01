import type { ApiError } from "@repo/shared"

const metaEnv = (import.meta as unknown as { env?: Record<string, unknown> }).env

export const API_URL =
  metaEnv?.VITE_API_URL?.toString().replace(/\/$/, "")

export class HttpError extends Error {
  status: number
  code?: string

  constructor(status: number, message: string, code?: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

export const requestJson = async <T>(
  path: string,
  init?: RequestInit
): Promise<T> => {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  })

  if (res.ok) return (await res.json()) as T

  let payload: ApiError | undefined
  try {
    payload = (await res.json()) as ApiError
  } catch {
    payload = undefined
  }

  throw new HttpError(
    res.status,
    payload?.message ?? "Something went wrong",
    payload?.code
  )
}
