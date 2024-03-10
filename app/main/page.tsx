"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { getUsers } from "./get-users";
import { PinMapIcon } from "@/components/icons/pin-map";
import { BedIcon } from "@/components/icons/bed";
import { ShowerIcon } from "@/components/icons/shower";
import { SquareIcon } from "@/components/icons/square";
import UserTicketStatus from "./components/ticket-status.ts";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

function Page() {
  const [users, setUsers] = useState<any>([]);
  useEffect(() => {
      getUsers().then((data) => {
        setUsers(data?.users);
      });
    }, []);

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="h-[50vh] w-full overflow-hidden">
        <div className="relative aspect-square">
          <Image
            alt=""
            src="https://imgbr.imovelwebcdn.com/avisos/resize/2/29/74/42/36/01/1200x1200/3634422144.jpg"
            fill
            priority
            style={{
              objectFit: "cover",
              objectPosition: "top",
            }}
          />
        </div>
      </div>
      <div className="absolute translate-y-[45vh] w-full rounded-t-3xl bg-white pt-[3vh] px-5">
        <h1 className="font-extrabold text-3xl lg:text-5xl text-primary">Skuhuvim House</h1>
        <div className="flex gap-2 items-center my-2">
          <PinMapIcon className="h-4 w-4 text-secondary" />
          <h2 className="text-secondary align-middle m-0">Caldas Novas</h2>
        </div>
        <div className="flex justify-between my-4">
          <div className="flex items-center gap-2">
            <BedIcon className="w-8 h-8 text-amber-600" />
            <p className="text-secondary">3 Beds</p>
          </div>
          <div className="flex items-center gap-2">
            <ShowerIcon className="w-8 h-8 text-amber-600" />
            <p className="text-secondary">3 Bathroom</p>
          </div>
          <div className="flex items-center gap-2">
            <SquareIcon className="w-8 h-8 text-amber-600" />
            <p className="text-secondary">250 m</p>
          </div>
        </div>
        <div className="flex flex-col mt-4">
          <h3 className="text-primary scroll-m-20 text-2xl font-semibold tracking-tight">Description</h3>
          <p className="text-secondary">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id. Sed rhoncus, tortor sed eleifend tristique, tortor mauris.
          </p>
        </div>
        <div className="flex flex-col mt-4">
          <h3 className="text-primary scroll-m-20 text-2xl font-semibold tracking-tight">Location</h3>
          <div className="h-72 w-full overflow-hidden rounded-3xl">
            <div className="relative w-[500px] h-[500px]">
              <Image
                alt=""
                src="https://t3.ftcdn.net/jpg/03/96/88/32/360_F_396883284_1APy4O6kZumSUDLE33VgJ3ADdMYt39Bv.jpg"
                fill
                priority
                style={{
                  objectFit: "cover",
                  objectPosition: "top",
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-4 gap-2">
          {users.map((user: any) => (
            <Card key={user.name} className="px-2 py-3">
              <div className="flex gap-2 items-center">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.avatar} />
                </Avatar>
                <div className="flex flex-col">
                  {user.name}
                  <UserTicketStatus status={user?.status} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Page;