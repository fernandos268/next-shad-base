'use client'
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { signInAction } from '@/app/(auth)/actions/auth'
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
import SocialSigninButon from '@/components/composed/SocialSigninButon'

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
              Login with your social account
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Field>
              <SocialSigninButon href='/auth/login?connection=google-oauth2&returnTo=/profile' type='google' />
            </Field>
            <Field>
              <SocialSigninButon href='/auth/login?connection=facebook&returnTo=/profile' type='facebook' />
            </Field>
          </div>

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