'use client'

import { useMemo, useState } from 'react'

type Mode = 'signup' | 'login'

export default function AuthCard() {
  const [mode, setMode] = useState<Mode>('login')

  const subtitle = useMemo(() => {
    return mode === 'signup' ? 'Create an account to continue' : 'Sign up or log in to continue'
  }, [mode])

  return (
    <section className="w-full max-w-xl">
      <div className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight">Welcome</h1>
        <p className="mt-2 text-base font-medium text-black/70">{subtitle}</p>
      </div>

      {/* Toggle pill */}
      <div className="mt-8 flex justify-center">
        <div className="relative flex w-[360px] items-center rounded-full bg-black/10 p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={[
              'z-10 flex-1 rounded-full px-6 py-2 text-sm font-medium transition',
              mode === 'signup' ? 'text-black' : 'text-black/70 hover:text-black',
            ].join(' ')}
          >
            Sign up
          </button>

          <button
            type="button"
            onClick={() => setMode('login')}
            className={[
              'z-10 flex-1 rounded-full px-6 py-2 text-sm font-medium transition',
              mode === 'login' ? 'text-black' : 'text-black/70 hover:text-black',
            ].join(' ')}
          >
            Login
          </button>

          {/* Sliding white capsule */}
          <span
            aria-hidden
            className={[
              'pointer-events-none absolute top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-full bg-white shadow-md transition-all duration-300',
              mode === 'signup' ? 'left-1' : 'left-[calc(50%+2px)]',
            ].join(' ')}
          />
        </div>
      </div>

      {/* Form */}
      <form className="mt-8 space-y-4">
        <div className="mx-auto w-full max-w-xl">
          <input
            type="text"
            inputMode="email"
            autoComplete="email"
            placeholder="Phone or Email"
            className="h-14 w-full rounded-full border border-black/20 bg-white px-6 text-base outline-none transition focus:border-black/40 text-black"
          />
        </div>

        <button
          type="submit"
          className="h-14 w-full rounded-full bg-black text-base font-medium text-white shadow-lg transition active:scale-[0.99]"
        >
          Continue
        </button>

        {/* Optional tiny helper (looks clean if you keep it subtle) */}
        <p className="pt-2 text-center text-xs text-black/45">
          By continuing, you agree to the Terms &amp; Privacy Policy.
        </p>
      </form>
    </section>
  )
}
