"use client"

import myAxios from "@/utils/myAxios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export default function Secret() {
  const [cookies, setCookie, removeCookie] = useCookies();
  const router = useRouter()

  const [randomWordData, setRandomWordData] = useState(null)

  useEffect(() => {
    // Doesn't have our application's JWT
    if (typeof cookies['backend-auth'] == 'undefined') {
      alert("Have you logged in? You're not logged in aren't you? 🤭")
      removeData()
      router.replace("/")
      return
    }
    fetchRandomWords()
  }, [])

  async function fetchRandomWords() {
    try {
      const res = await myAxios.get("/secret", {
        headers: {
          Authorization: `bearer ${cookies['backend-auth']}`
        }
      })
      setRandomWordData(res.data)
    } catch (e) {
      alert("Error authenticating, logging you out")
      removeData()
      router.replace("/")
    }
  }

  async function removeData() {
    removeCookie('backend-auth')
    removeCookie('first-time')
    router.replace("/")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {
        randomWordData ?
          <div className="text-center">
            <p>This is your random word:</p>
            <p className="font-bold">{randomWordData}</p>

            <p>Your first time login?</p>
            <p className="font-bold">{cookies['first-time']}</p>
          </div>
          :
          <p>
            Please wait while fetching the secret.
          </p>
      }

      <button onClick={removeData} type="button" className="bg-white rounded-md p-2 text-black font-semibold text-sm">
        Log out (Remove all data)
      </button>
    </main>
  )
}
