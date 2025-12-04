import ThemeSelectorBtn from '@/components/composed/ThemeSelector'

export default function Layout({
  children
}: { children: React.ReactNode }) {
  
  return (
    <div className='flex min-h-screen min-w-screen flex-col'>
      <header className='min-w-screen h-[80px] flex fixed shadow-md shadow-gray-400/50'>
        <div className='flex flex-row justify-end w-screen h-full items-center pr-[16px] gap-6'>
          <ThemeSelectorBtn />
        </div>
      </header>
      <main className='flex w-full h-screen'>
        <div className='flex size-full items-center justify-center'>
          {children}
        </div>
      </main>
    </div>
  )
}

