"use server"

import { signIn } from "@/auth"

export default async function loginGoogle() {
  await signIn('google', {
    redirectTo: process.env.NEXT_PUBLIC_URL + '/google-signin',
  });
}