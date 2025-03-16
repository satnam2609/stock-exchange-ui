"use client";

import { signIn, useSession } from "next-auth/react";
import { DownOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useState } from "react";
import UserMenu from "../menu/UserMenu";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const { data: session, status } = useSession();
  const pathName = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex justify-between items-center gap-10">
        <div className="flex items-center">
          <Image
            src={"/logo.svg"}
            alt="project logo"
            height={45}
            width={45}
            className="rounded-full"
          />
          <p className="font-bold text-white text-xl">Compound</p>
        </div>

        <div className="flex justify-between items-center gap-5">
          <Link
            href={"/"}
            className={`${
              pathName === "/" ? "text-[#3ddda0]" : "text-[#8b8787]"
            } font-medium text-xl`}
          >
            Explore
          </Link>
          <Link
            href={"/dashboard"}
            className={`${
              pathName === "/dashboard" ? "text-[#3ddda0]" : "text-[#8b8787]"
            } font-medium text-xl`}
          >
            Dashboard
          </Link>
        </div>
      </div>

      {status === "authenticated" ? (
        <div className="flex flex-row justify-between items-center gap-1">
          <Image
            src={session?.user?.image as string}
            alt="user image"
            width={40}
            height={40}
            className="rounded-full"
          />
          <button onClick={() => setOpen(!open)}>
            <DownOutlined
              className={`text-sm  ${
                open ? "rotate-180" : ""
              } transition-transform`}
            />
          </button>
          <UserMenu
            open={open}
            name={session?.user?.name as string}
            email={session?.user?.email as string}
          />
        </div>
      ) : (
        <div>
          <button onClick={() => signIn()}>
            <p className="text-2xl font-bold text-white hover:text-[#42c96a] transition-colors">
              Login
            </p>
          </button>
        </div>
      )}
    </div>
  );
}
