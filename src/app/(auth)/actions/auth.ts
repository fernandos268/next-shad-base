'use server'

import { type UserInput as SignInInput } from "@/app/(auth)/sign-in/formSchema"
import { type UserInput as SignUpInput } from "@/app/(auth)/sign-up/formSchema"
import { authenticationClient } from '@/lib/auth0'
import { GenerateFullName } from '@/lib/utils'
import pick from 'lodash/pick'
import { revalidatePath } from 'next/cache'
import { cookies } from "next/headers"
import { redirect } from 'next/navigation'
import { sessionDuration, defaultPostAuthRedirectUrl } from '@/lib/static'
import { AuthApiError } from "auth0"


export const signUpAction = async (data: SignUpInput) => {

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

    const { access_token } = tokenResponse.data

    const cookieStore = await cookies()
    cookieStore.set("access_token", access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: sessionDuration,
    });

  } catch (error) {
    console.log("%c ERROR: signUpAction", "color:#3f7cff", error);
    let error_message = 'Signup failed.'
    if (error instanceof AuthApiError) {
      error_message = error.error_description
    }

    return {
      success: false,
      errors: {
        auth_error: error_message
      }
    }
  }

  revalidatePath(defaultPostAuthRedirectUrl, 'layout')
  redirect(defaultPostAuthRedirectUrl)
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

    const { access_token } = tokenResponse.data

    const cookieStore = await cookies()
    cookieStore.set("access_token", access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: sessionDuration,
      // maxAge: 60 * 1
    });

  } catch (error) {
    console.log("%c Line:151 🍋 ERROR: signInAction", "color:#3f7cff", error);
    let error_message = 'Signin failed, please try again later.'
    if (error instanceof AuthApiError) {
      error_message = error.error_description
    }

    return {
      success: false,
      errors: {
        auth_error: error_message
      }
    }
  }

  revalidatePath(defaultPostAuthRedirectUrl, 'page')
  redirect(defaultPostAuthRedirectUrl)
}

export const signOut = async () => {
  return true
}


export const authenticateWithGoogleAction = async (action: 'sign-in' | 'sign-up') => {
  // redirect('/api/auth/login?connection=google-oauth2')
  let url = '/auth/login?connection=google-oauth2'
  if (action === 'sign-up') {
    url += '&screen_hint=signup'
  }
  redirect(url)
  // const result = await authenticationClient.oauth.clientCredentialsGrant
}
