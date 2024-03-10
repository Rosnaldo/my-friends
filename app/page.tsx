import React from "react";
import GoogleButton from "./components/google-button";
import { Card } from "@/components/ui/card";

function Page() {
  return (
    <div className="w-full h-full bg-black flex flex-col items-center justify-center">
      <Card className="md:w-1/3 w-full">
        <h1>Login</h1>
        <GoogleButton text="Google" redirectTo="/main" />
      </Card>
    </div>
  );
}

export default Page;