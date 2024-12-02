
"use client"
import { Button } from "@react-email/components"
import { useSession, signIn, signOut } from "next-auth/react"
function page() {

    const { data: session } = useSession()
    if (session) {

        return (
            <div>
                sign in page
                <Button onClick={() => signIn()} >Sign in </Button>
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
