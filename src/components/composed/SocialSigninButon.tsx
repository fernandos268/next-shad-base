import { useMemo } from "react"
import { Button } from "../ui/button"
import Link from 'next/link'

interface IProps {
  href: string
  type: 'google' | 'facebook'
  btnProps?: Record<string, unknown>
}

const SocialSigninButon = (props: IProps) => {

  const { href, type, btnProps } = props

  const Content = useMemo(() => {
    switch (type) {
      case 'google':
        return (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            {'Sign in with Google'}
          </>
        )
      case "facebook":
        return (
          <>
            <svg fill="currentColor" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="-337 273 123.5 256"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M-260.9,327.8c0-10.3,9.2-14,19.5-14c10.3,0,21.3,3.2,21.3,3.2l6.6-39.2c0,0-14-4.8-47.4-4.8c-20.5,0-32.4,7.8-41.1,19.3 c-8.2,10.9-8.5,28.4-8.5,39.7v25.7H-337V396h26.5v133h49.6V396h39.3l2.9-38.3h-42.2V327.8z"></path> </g></svg>
            {'Sign in with Facebook'}
          </>
        )
      default: <></>
    }
  }, [type])

  return (
    <Button variant="outline" type="button" size='lg' asChild {...btnProps}>
      <Link href={href}>
        {Content}
      </Link>
    </Button>
  )
}

export default SocialSigninButon