
"use client"
import { useSession, signIn, signOut } from "next-auth/react"
function page() {

    const { data: session } = useSession()
    if (session) {

        return (
            <div>
                sign in page
                <button onClick={() => signOut()}>Sign Out</button>
            </div>
        )
    } else {
        <>
            not signin
            <button onClick={() => signIn()} className=" bg-yellow-300">sign in</button>
        </>
    }
}

export default page
