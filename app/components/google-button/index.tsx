"use client";

import Image from "next/image";
import loginGoogle from "./google-login";

type Props = {
  text: string;
  redirectTo: string;
}

export default function GoogleButton({ text }: Props) {
  return (
    <button onClick={async () => {
      await loginGoogle();
    }} className="p-2 border-1 border-black w-full rounded">
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
