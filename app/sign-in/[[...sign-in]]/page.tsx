import {SignIn} from '@clerk/nextjs'
import {redirect} from "next/navigation";
import {auth} from "@clerk/nextjs/server";

export default async function SignInPage() {
    const { userId } = await auth()

    if (!userId) return (
        <div className="flex h-screen items-center justify-center bg-black/50">
            <SignIn />
        </div>
    )

    redirect("/album")
}