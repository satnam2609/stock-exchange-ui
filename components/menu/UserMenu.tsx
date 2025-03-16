"use client";

import {
    BankOutlined,
  ReadOutlined,
  RightOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Divider } from "antd";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function UserMenu({
  open,
  name,
  email,
}: Readonly<{
  open: boolean;
  name: string;
  email: string;
}>) {
  if (open) {
    const Button = ({
      icon,
      title,
      route,
    }: Readonly<{
      icon: React.ReactNode;
      title: string;
      route?: string;
    }>) => {
      return (
        <Link href={route as string} className="flex justify-between items-center just w-full px-3 gap-4 py-3 hover:bg-[#31303083] transition-colors">
          {icon}

          <div className="w-full">
            <div className="flex justify-between items-center">
              <p>{title}</p>
              <RightOutlined />
            </div>
          </div>
        </Link>
      );
    };
    return (
      <div className="absolute w-[18%] translate-y-36 bg-[#0a0a0a] -translate-x-64 z-10 border-[1px] border-[#313030] rounded-xl flex flex-col items-center justify-center">
        <div className="flex justify-between items-center w-full px-3 py-4">
          <div>
            <p className="text-2xl font-bold text-[#ffffff]">{name}</p>
            <p className="text-sm  text-[#a19e9e]">{email}</p>
          </div>

          <SettingOutlined className="text-xl text-white" />
        </div>

        <Divider
          style={{
            borderColor: "#313030",
            marginTop: 0,
            marginBottom: 0,
          }}
        />
        <div className="flex flex-col items-center w-full">
          {/* Buttons */}
          <Button
            icon={<ReadOutlined className="text-xl text-white" />}
            title="All Orders"
            route="/all-orders"
          />
          <Divider style={{
            borderColor:"#313030",
            width:"10px",
            marginTop:0,
            marginBottom:0
          }}/>
          <Button
            icon={<BankOutlined className="text-xl text-white" />}
            title="Bank Details"
            route="bank-details"
          />
          {/* Button 2 */}
        </div>
        <button onClick={()=>signOut()} className="w-full mt-1 flex justify-end px-4 bg-[#31303083] rounded-b-xl py-3">
          <div>
          <p className="text-sm font-bold text-white">
            Log out
          </p>
          <Divider dashed style={{
            borderColor:"#ffffff",
            margin:0
          }}/>
          </div>
        </button>
      </div>
    ); 
  }
}
