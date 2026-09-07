import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

export async function createServerSupabase() {
  const store = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return store.getAll() },
        setAll(list) {
          try { list.forEach(({ name, value, options }) => store.set(name, value, options)) } catch {}
        },
      },
    }
  )
}

export async function getRequestUser(request) {
  const auth = request.headers.get('authorization')
  if (auth?.startsWith('Bearer ')) {
    const token = auth.slice(7)
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    })
    const { data, error } = await sb.auth.getUser(token)
    return { user: data?.user, error }
  }
  try {
    const sb = await createServerSupabase()
    const { data, error } = await sb.auth.getUser()
    return { user: data?.user, error }
  } catch (e) {
    return { user: null, error: e }
  }
}
