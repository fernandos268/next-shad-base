import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type NextRequest } from 'next/server'
import { NextURL } from "next/dist/server/web/next-url"
import { PrivatePageRotues } from '@/lib/static'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function GenerateFullName(nameFields: { first_name: string, last_name?: string, suffix?: string }) {
  const { first_name, last_name, suffix } = nameFields
  let fullName = first_name
  if (last_name) fullName += ` ${last_name}`
  if (suffix) fullName += ` ${suffix}`
  return fullName
}