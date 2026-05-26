import { cache } from 'react'
import 'server-only'
import { decrypt } from './session'
import { cookies } from 'next/headers'
import { redirect } from 'next/dist/client/components/redirect'

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  if (!session?.userId) {
    redirect('/login')
  }

  return { isAuth: true, userId: session.userId }
})