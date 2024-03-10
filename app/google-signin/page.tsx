"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";
import { userExists } from "./user-exists";
import { toast } from "react-toastify";

export default function Home() {
  const session = useSession()
  const { push } = useRouter();

  useLayoutEffect(() => {
    userExists({ email: session?.data?.user?.email })
    .then((resp) => {
      if (resp?.exists) {
        push("/main");
      }
      // if (!resp?.exists) {
      //   toast("You are not registered yet", { type: "warning" });
      //   push("/register");
      // }
    })
    .catch(() => {
      toast("Something went wrong", { type: "warning" });
      push("/");
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [push]);

  return null;
}
