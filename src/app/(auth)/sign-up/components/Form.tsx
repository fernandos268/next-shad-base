'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldLegend,
  FieldError
} from "@/components/ui/field"
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import DatePicker from '@/components/composed/DatePicker'
import { toast, Toaster } from "sonner"
import { signUpAction } from "@/app/(auth)/actions/auth"
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, type UserInput } from "@/app/(auth)/sign-up/formSchema"
import { Spinner } from '@/components/ui/spinner'
import { ClassProp } from "class-variance-authority/types"
import { PasswordInput } from "@/components/composed/PasswordInput"

const defaultFieldValues: UserInput = {
  first_name: '',
  last_name: '',
  suffix: '',
  preferred_name: '',
  birth_date: new Date(),
  phone_number: '',
  address: '',
  email: '',
  password: '',
  confirm_password: ''
}


interface IProps {
  className?: ClassProp
}

export function SignupForm(props: IProps) {
  const { className } = props

  const {
    control,
    handleSubmit,
    formState,
    setValue,
  } = useForm<UserInput>({
    resolver: zodResolver(formSchema),
    mode: 'all',
    defaultValues: defaultFieldValues
  });


  const onSubmit = async (data: UserInput) => {
    const result = await signUpAction(data)
    if (!result.success) {
      const [error] = Object.values(result.errors)
      toast.error(error)
    }
  }

  return (
    <>
      <Toaster richColors position="top-center" />
      <form onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)}>
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-muted-foreground text-sm text-balance">
            Sign up using your Google account
          </p>
        </div>
        <Field>
          <Button variant="outline" type="button" size='lg'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Sign in with Google
          </Button>
        </Field>
        <FieldGroup>
          <FieldSeparator>Or continue with Email & Password</FieldSeparator>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Fill in the form below to create your account
            </p>
          </div>

          <FieldGroup className="gap-2">
            <div className="flex w-full flex-col gap-1">
              <FieldLegend className="mb-1">Personal Information</FieldLegend>
              <FieldDescription>
                Provide your full name and preferred name to be called.
              </FieldDescription>
            </div>
            <FieldGroup className="flex flex-row">
              <Controller
                name="first_name"
                control={control}
                render={({ field, fieldState }) => (
                  <Field className="gap-2" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="first_name">First Name</FieldLabel>
                    <Input
                      id="first_name"
                      type="text"
                      required
                      {...field}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="last_name"
                control={control}
                render={({ field, fieldState }) => (
                  <Field className="gap-2" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="last_name">Last Name</FieldLabel>
                    <Input
                      id="last_name"
                      type="text"
                      {...field}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup className="flex flex-row">
              <Controller
                name="suffix"
                control={control}
                render={({ field, fieldState }) => (
                  <Field className="gap-2" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="suffix">Suffix</FieldLabel>
                    <Input
                      id="suffix"
                      type="text"
                      {...field}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="preferred_name"
                control={control}
                render={({ field, fieldState }) => (
                  <Field className="gap-2" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="preferred_name">Preffered Name</FieldLabel>
                    <Input
                      id="preferred_name"
                      type="text"
                      {...field}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
            <Controller
              name="birth_date"
              control={control}
              render={({ field, fieldState }) => (
                <Field className="gap-2" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="birth_date">Birth Date</FieldLabel>
                  <DatePicker
                    name="birth_date"
                    onChange={(value: Date) => {
                      setValue("birth_date", value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          <FieldGroup className="gap-1">
            <div className="flex w-full flex-col gap-1">
              <FieldLegend className="mb-1">Contact Information</FieldLegend>
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your data
                with anyone else.
              </FieldDescription>
            </div>
            <Controller
              name="phone_number"
              control={control}
              render={({ field, fieldState }) => (
                <Field className="gap-2" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="phone_number">Phone Number</FieldLabel>
                  <Input
                    id="phone_number"
                    type="text"
                    required
                    maxLength={10}
                    max={10}
                    {...field}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="address"
              control={control}
              render={({ field, fieldState }) => (
                <Field className="gap-2" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="address">Address</FieldLabel>
                  <Input
                    id="address"
                    type="text"
                    required
                    {...field}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          <FieldGroup className="gap-1">
            <FieldLegend>Signin Information</FieldLegend>

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
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <PasswordInput
                    id="password"
                    required
                    {...field}
                  />
                  <FieldDescription>
                    Must be at least 8 characters long.
                  </FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="confirm_password"
              control={control}
              render={({ field, fieldState }) => (
                <Field className="gap-2" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirm_password">Confirm Password</FieldLabel>
                  <PasswordInput
                    id="confirm_password"
                    required
                    {...field}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

          </FieldGroup>

          <Field>
            <Button disabled={!formState.isValid || formState.isLoading || formState.isSubmitting} type="submit" size='lg'>
              {
                formState.isLoading || formState.isSubmitting ?
                  (
                    <>
                      <Spinner />
                      {'Creating Account...'}
                    </>
                  )
                  : `Create Account`
              }
            </Button>
          </Field>
          <Field>
            <FieldDescription className="px-6 text-center">
              Already have an account? <Link href="/sign-in">Sign in</Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </>
  )
}
