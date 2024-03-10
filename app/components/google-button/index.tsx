"use client";

import Image from "next/image";
import loginGoogle from "./google-login";
import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  redirectTo: string;
}

const GoogleButton = ({ text, className }: Props) => {
  return (
    <button onClick={async () => {
      await loginGoogle();
    }} className={cn("p-2 border-1 border w-full rounded shadow", className)}>
      <div className="flex w-full gap-2 justify-center items-center">
        <div className="relative w-[20px] h-[20px]">
          <Image
            style={{ objectFit: "contain" }}
            src="/google-logo.png"
            alt="Google Logo"
            fill
            unoptimized
          />
        </div>
        <p>{text}</p>
      </div>
    </button>
  );
}

export default GoogleButton;
