import { NextResponse, type NextRequest } from "next/server";
import axiosInstance from '@/lib/axios'

export async function apiRequests(request: NextRequest) {


    return NextResponse.next()
}