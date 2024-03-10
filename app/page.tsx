import React from "react";
import GoogleButton from "./components/google-button";

function Page() {
  return (
    <div className="w-full h-screen flex flex-col justify-center p-8">
      <h1 className="font-extrabold text-3xl lg:text-5xl text-primary">Login</h1>
      <GoogleButton className="mt-4" text="Login with Google" redirectTo="/main" />
    </div>
  );
}

export default Page;