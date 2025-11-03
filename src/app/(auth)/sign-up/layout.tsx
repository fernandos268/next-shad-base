import ThemeSelectorBtn from '@/components/composed/ThemeSelector'

export default function Layout({
  children
}: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col overflow-hidden'>
      <header className='min-w-screen h-[80px] flex'>
        <div className='flex flex-row justify-end w-screen h-full items-center pr-[16px] gap-6'>
          <ThemeSelectorBtn />
        </div>
      </header>
      <main className="flex flex-col gap-[16px] items-center mb-8 sm:items-center w-full">
        {children}
      </main>
    </div>
  )
}
