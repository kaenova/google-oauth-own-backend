"use client"

import { useEffect, useState } from 'react'
import { useCookies } from "react-cookie";
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import myAxios from '@/utils/myAxios';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [LoadingSignin, setLoadingSignin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Doesn't have our application's JWT
    if (typeof cookies['backend-auth'] != 'undefined') {
      alert("Have you logged in? You're logged in aren't you? 🤭")
      router.replace("/secret")
      return
    }
  }, [])

  async function handleGoogleLoginSuccess(credsResponse) {
    /*
    The credsResponse object will look like this:
    {credential: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjgyMjgzOGMxYzhiZjllZG…Nzz9cGTaE2sNv0XWvvX1_zmq81sQmnLlAixLLkWq7vyu_heLQ', clientId: '435862813136-1l4chn9gm2eid69lafkv9vpn1kja3ok0.apps.googleusercontent.com', select_by: 'btn'}
    
    the data will be sent to backend to be verified
    */
    setLoadingSignin(true)
    try {
      let res = await myAxios.post("/auth/google", credsResponse)
      console.log(res.data)
      setCookie('backend-auth', res.data.jwt)
      setCookie('first-time', res.data.first_time_sign_in)
      router.push("/secret")
    } catch (e) {
      alert("Fail to sign in")
      setLoadingSignin(false)
    }

  }

  async function handleGoogleLoginFailed() {
    alert("Login with Google failed, please try again")
  }

  // Loading Signin
  if (LoadingSignin) {
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      Please wait, we're processing your google login
    </main>
  }

  // Signin form
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT}>
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        Login with Google OAuth
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginFailed}
        />
      </main>
    </GoogleOAuthProvider>
  )
}
