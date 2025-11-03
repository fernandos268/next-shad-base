'use client'
import { Button } from '@/components/ui/button'
import { signOut } from '@/app/(auth)/actions/auth'

const page = () => {

  const handleLogout = async () => {
    const result = await signOut()
    console.log("%c Line:9 🍺 handleLogout > result", "color:#465975", result);
  }

  return (
    <div className='flex flex-col gap-4'>
      DASHBOARD PAGE
      <Button onClick={handleLogout}>Logout</Button>
    </div>

  )
}

export default page