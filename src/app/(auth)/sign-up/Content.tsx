'use client'
import { SignupForm } from "@/app/(auth)/sign-up/components/Form"
import {
  Card
} from "@/components/ui/card"
import { GalleryVerticalEnd } from "lucide-react"
import { cn } from '@/lib/utils'
import { LogoFilepath, AuthBannerBGColor, AppName } from '@/lib/static'

const SignupPageContent = () => {

  return (
    <Card className="w-[90%] 2xl:w-[70%] overflow-hidden py-0">
      <div className="grid lg:grid-cols-2">
        <div className="flex flex-col gap-8 md:p-10">
          <div className="flex justify-center gap-2">
            <a href="#" className="flex items-center gap-2 font-medium">
              <div className="bg-primary text-primary-foreground flex size-7   items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <p className="text-2xl">{AppName}</p>
            </a>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-lg">
              <SignupForm />
            </div>
          </div>
        </div>
        <div className={cn("relative hidden lg:block flex", AuthBannerBGColor)}>
          <div className='flex w-full p-6 h-full justify-center items-center'>
            <img
              src={LogoFilepath}
              alt="Image"
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </Card>

  )
}

export default SignupPageContent