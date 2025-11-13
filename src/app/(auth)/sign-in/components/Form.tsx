'use client'
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { signInAction, authenticateWithGoogleAction } from '@/app/(auth)/actions/auth'
import { PasswordInput } from "@/components/composed/PasswordInput"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldError
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import Link from 'next/link'
import { formSchema, type UserInput } from '@/app/(auth)/sign-in/formSchema'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
// import { ClassProp } from "class-variance-authority/types"
import { Spinner } from '@/components/ui/spinner'


const defaultFieldValues: UserInput = {
  email: '',
  password: '',
}

const Form = () => {

  const {
    control,
    handleSubmit,
    formState,
  } = useForm<UserInput>({
    resolver: zodResolver(formSchema),
    mode: 'all',
    defaultValues: defaultFieldValues
  });

  const onSubmit = async (data: UserInput) => {
    const result = await signInAction(data)
    if (!result.success) {
      const [error] = Object.values(result.errors)
      toast.error(error)
    } else {
      toast.success('Welcome back!')
    }
  }

  return (
    <>
      <Toaster position="top-center" />
      <form onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col gap-6")}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Welcome!</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Login with your Google account
            </p>
          </div>
          <Field>
            <Button variant="outline" type="button" size='lg' asChild>
              <Link href="/auth/login?connection=google-oauth2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Sign in with Google
              </Link>
            </Button>
          </Field>

          <FieldSeparator className="bg-transparent">Or continue with</FieldSeparator>

          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Field className="gap-2" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  required
                  {...field}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <Field className="gap-2" data-invalid={fieldState.invalid}>
                <div className='flex w-full justify-between'>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <PasswordInput
                  id="password"
                  required
                  {...field}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Field>
            <Button disabled={!formState.isValid || formState.isLoading || formState.isSubmitting} type="submit" size='lg'>
              {
                formState.isLoading || formState.isSubmitting ?
                  (
                    <>
                      <Spinner />
                      {'Signing in...'}
                    </>
                  )
                  : `Sign in`
              }
            </Button>
          </Field>
          <Field>
            <FieldDescription className="px-6 text-center">
              {`Don't have an account?`} <Link href="/sign-up">Sign up</Link>
            </FieldDescription>
          </Field>

        </FieldGroup>
      </form>
    </>
  )
}

export default Form