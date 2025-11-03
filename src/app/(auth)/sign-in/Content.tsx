'use client'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import SigninForm from './components/Form'
import { LogoFilepath, AuthBannerBGColor } from '@/lib/static'
import { cn } from "@/lib/utils"

const SigninPageContent = () => {

  return (
    <Card className="w-full max-w-md h-fit gap-4 py-0 overflow-hidden">
      <CardHeader className='p-0'>
        <CardTitle className='size-full flex justify-center items-center text-3xl'>
          <div className={cn('flex w-full', AuthBannerBGColor)}>
            <img
              src={LogoFilepath}
              alt="Image"
              className="object-contain"
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col pb-6'>
        <SigninForm />
      </CardContent>
    </Card>
  )
}

export default SigninPageContent