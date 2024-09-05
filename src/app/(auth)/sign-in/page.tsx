"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <div className="h-screen bg-black">
          <p className="text-white"> Signed in as {session.user.email} </p>
          <br />
          <button
            className="bg-orange-400 px-3 py-1 rounded"
            onClick={() => signOut()}
          >
            Sign out
          </button>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="h-screen bg-black">
        <p className="text-white"> Not signed in </p>
        <br />
        <button
          className="bg-orange-400 px-3 py-1 rounded"
          onClick={() => signIn()}
        >
          Sign in
        </button>
      </div>
    </>
  );
}
