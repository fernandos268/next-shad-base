'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import pick from 'lodash/pick'
import { ISignUpActionState } from '@/app/(auth)/sign-up/types'
import { type UserInput as SignUpInput } from "@/app/(auth)/sign-up/formSchema"
import { type UserInput as SignInInput } from "@/app/(auth)/sign-in/formSchema"
import { omit } from 'lodash'
import axios from 'axios'
import { managementClient, authenticationClient } from '@/lib/auth0'
import { cookies } from "next/headers";
import { auth0Client } from '@/lib/auth0'
import { GenerateFullName } from '@/lib/utils'

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


// export const signUpAction = async (data: SignUpInput): Promise<ISignUpActionState | null> => {

//   const user_data = pick(data, ['email', 'password'])

//   const profile_data = {
//     ...pick(data, [
//       'first_name',
//       'last_name',
//       'suffix',
//       'birth_date',
//       'email',
//       'phone_number',
//       'preferred_name',
//       'address',
//     ]),
//   }


//   // Check if user already exists
//   // const exists = await checkUserExists(user_data.email)
//   // if (exists) {
//   //   return {
//   //     errors: {
//   //       email: 'User already exists',
//   //     },
//   //   }
//   // }

//   // Create user via Auth0 Authentication API (server-side)
//   try {
//     const auth0Domain = process.env.AUTH0_DOMAIN as string
//     const auth0ClientId = process.env.AUTH0_CLIENT_ID as string

//     const response = await axios.post(
//       `https://${auth0Domain}/dbconnections/signup`,
//       {
//         client_id: auth0ClientId,
//         email: user_data.email,
//         password: user_data.password,
//         connection: 'Username-Password-Authentication',
//         user_metadata: {
//           ...omit(profile_data, ['first_name', 'last_name']),
//           given_name: profile_data.first_name,
//           family_name: profile_data.last_name,
//         },
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     )

//     console.log('Auth0 signup result:', response.data)

//     // After successful signup, you may want to automatically sign them in
//     // or redirect to email verification page
//     return {
//       success: true,
//     }
//   } catch (error) {
//     console.error('Signup error:', error)

//     // Handle axios errors
//     if (axios.isAxiosError(error) && error.response) {
//       const result = error.response.data
//       return {
//         errors: {
//           _form: result.error || result.description || 'Signup failed.',
//         },
//       }
//     }

//     return {
//       errors: {
//         _form: error instanceof Error ? error.message : 'An unexpected error occurred',
//       },
//     }
//   }


//   // revalidatePath('/email-verification-sent', 'layout')
//   // redirect('/email-verification-sent')
// }


export const signUpAction = async (data: SignUpInput): Promise<ISignUpActionState | null> => {

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

  try {
    const user = await managementClient.users.create({
      ...user_data,
      connection: 'Username-Password-Authentication',
      verify_email: true,
      user_metadata: {
        ...profile_data,
        nickname: profile_data.preferred_name,
        name: GenerateFullName(pick(profile_data, ['first_name', 'last_name', 'suffix'])),
        given_name: profile_data.first_name,
        family_name: profile_data.last_name,
        phone_number: profile_data.phone_number,
      }
    });


    if (!user) {
      return {
        success: false,
        errors: {
          auth_error: 'Signup failed during user creation.'
        }
      }
    }

    // Authenticate the user via Auth0 Authentication API
    const tokenResponse = await authenticationClient.oauth.passwordGrant({
      username: user_data.email,
      password: user_data.password,
      scope: "openid profile email",
      audience: process.env.AUTH0_AUDIENCE!,
      realm: "Username-Password-Authentication"
    });

    if (!tokenResponse) {
      return {
        success: false,
        errors: {
          auth_error: 'Signup failed during session creation.'
        }
      }
    }


    console.log("%c Line:162 🥃 tokenResponse", "color:#465975", tokenResponse);

    // Save tokens in a secure cookie (simplified example)
    const { access_token, id_token } = tokenResponse.data

    const cookieStore = await cookies()
    cookieStore.set("access_token", access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });

    cookieStore.set("id_token", id_token as string, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });
  } catch (error) {
    console.log("%c Line:215 🍰 signUpAction > error", "color:#fca650", error);
    return {
      success: false,
      errors: {
        auth_error: 'Signup failed.'
      }
    }
  }

  revalidatePath('/admin', 'layout')
  redirect('/admin')
}


export const signOut = async () => {
  return true
}


export const googleSignInAction = async () => {

}
