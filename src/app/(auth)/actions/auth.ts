'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import pick from 'lodash/pick'
import { ISignUpActionState } from '@/app/(auth)/sign-up/types'
import { type UserInput as SignUpInput } from "@/app/(auth)/sign-up/formSchema"
import { type UserInput as SignInInput } from "@/app/(auth)/sign-in/formSchema"

export const checkUserExists = async (email: string): Promise<boolean> => {
  // const supabaseClient = await createClient()

  // const result = await supabaseClient
  //   .from('profiles')
  //   .select('id')
  //   .eq('email', email)
  //   .maybeSingle();

  // const { data, error } = result

  // if (error) {
  //   console.error('Error checking user:', error.message);
  //   throw new Error('Database error');
  // }

  // return !!data

  return true
}

export const signInAction = async (data: SignInInput) => {
  const user_data = pick(data, ['email', 'password'])


  console.log("%c Line:32 🍒 signInAction", "color:#ea7e5c", signInAction);

  revalidatePath('/dashboard', 'layout')
  redirect('/dashboard')
}


export const signUpAction = async (data: SignUpInput): Promise<ISignUpActionState | null> => {

  // shape data
  const user_data = pick(data, ['email', 'password'])

  const profile_data = {
    ...pick(data, [
      'first_name',
      'last_name',
      'suffix',
      'birth_date',
      'email',
      'phone_number',
      'preferred_name',
      'address',
    ]),
  }

  // check if user already exists
  const existing = await checkUserExists(data.email)

  if (existing) {
    return {
      errors: {
        auth_error: 'Account already exists.'
      }
    }
  }


  revalidatePath('/email-verification-sent', 'layout')
  redirect('/email-verification-sent')
}


export const signOut = async () => {
  return true
}


export const googleSignInAction = async () => {

}