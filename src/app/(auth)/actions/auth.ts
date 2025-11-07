'use server'

import { type UserInput as SignInInput } from "@/app/(auth)/sign-in/formSchema"
import { type UserInput as SignUpInput } from "@/app/(auth)/sign-up/formSchema"
import { ISignUpActionState } from '@/app/(auth)/sign-up/types'
import { authenticationClient } from '@/lib/auth0'
import { GenerateFullName } from '@/lib/utils'
import pick from 'lodash/pick'
import { revalidatePath } from 'next/cache'
import { cookies } from "next/headers"
import { redirect } from 'next/navigation'
import { sessionDuration } from '@/lib/static'

// export const checkUserExists = async (email: string): Promise<boolean> => {
//   // const supabaseClient = await createClient()

//   // const result = await supabaseClient
//   //   .from('profiles')
//   //   .select('id')
//   //   .eq('email', email)
//   //   .maybeSingle();

//   // const { data, error } = result

//   // if (error) {
//   //   console.error('Error checking user:', error.message);
//   //   throw new Error('Database error');
//   // }

//   // return !!data

//   return true
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
    const user = await authenticationClient.database.signUp({
      connection: 'Username-Password-Authentication',
      email: user_data.email,
      password: user_data.password,
      nickname: profile_data.preferred_name,
      name: GenerateFullName(pick(profile_data, ['first_name', 'last_name', 'suffix'])),
      given_name: profile_data.first_name,
      family_name: profile_data.last_name,
      user_metadata: profile_data,
    })
    
    console.log("%c Line:55 🥚 user11111111", "color:#7f2b82", user);

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


    // Save tokens in a secure cookie (simplified example)
    const { access_token, id_token } = tokenResponse.data

    const cookieStore = await cookies()
    cookieStore.set("access_token", access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: sessionDuration,
    });

    cookieStore.set("id_token", id_token as string, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: sessionDuration,
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

  revalidatePath('/profile', 'layout')
  redirect('/profile')
}

export const signInAction = async (data: SignInInput) => {
  const user_data = pick(data, ['email', 'password'])

  try {
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

    console.log("%c Line:136 🍢 tokenResponse", "color:#b03734", tokenResponse);

    // Save tokens in a secure cookie (simplified example)
    const { access_token, id_token } = tokenResponse.data

    const cookieStore = await cookies()
    cookieStore.set("access_token", access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      // maxAge: sessionDuration,
      maxAge: 60 * 1
    });

    cookieStore.set("id_token", id_token as string, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      // maxAge: sessionDuration,
      maxAge: 60 * 1
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

  revalidatePath('/profile', 'page')
  redirect('/profile')
}

export const signOut = async () => {
  return true
}


export const googleSignInAction = async () => {

}
