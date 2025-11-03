'use client'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"


const EmailVerificationSent = () => {

  return (
    <Card className="w-full max-w-md h-fit gap-4 py-0 overflow-hidden">
      <CardHeader className='p-0'>
        <CardTitle className='size-full flex justify-center items-center text-3xl'>
          <div className='flex w-full bg-red-900 p-6'>
            <img
              src="/fitjourney-logo-1.svg"
              alt="Image"
              className="object-contain"
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col pb-6'>
        <h1>Email verification has been sent!</h1>
        <h4>Please check your email</h4>
      </CardContent>
    </Card>
  )
}

export default EmailVerificationSent