"use client";

import { Divider } from "antd";
import { useState } from "react";


export default function BalanceCard(){
    const [amount,setAmount]=useState<string>();

    return <div className="flex w-full h-[55vh] flex-col justify-between items-center rounded-xl border-[1px] border-[#313030] gap-18">
        <div className="py-3 w-full text-start">
        <p className="font-bold text-xl px-3 py-2">Add Money</p>
        <Divider
          style={{
            borderColor: "#313030",
            marginTop: 0,
            marginBottom: 0,
          }}
        />
        </div>
        
        <div className="flex w-full py-3 px-5 h-full flex-col items-center justify-between">
           <div className="flex flex-col items-center">
           <label htmlFor="" className="text-[#dfdfdf] text-lg font-medium">Enter Amount</label>
           <input type="number" placeholder="$0" className="bg-transparent text-center text-xl outline-none" value={amount} onChange={(e)=>setAmount(e.target.value)}/>
           <div className="flex items-center gap-5 mt-5">
            <button   className="border-[1px] border-[#2ba576] bg-[#2ea77921] rounded-xl px-3 py-1">+$100</button>
            <button className="border-[1px] border-[#2ba576] bg-[#2ea77921] rounded-xl px-3 py-1">+$500</button>
            <button className="border-[1px] border-[#2ba576] bg-[#2ea77921] rounded-xl px-3 py-1">+$1000</button>
            <button className="border-[1px] border-[#2ba576] bg-[#2ea77921] rounded-xl px-3 py-1">+$5000</button>
           </div>
           </div>

           <button className="bg-[#2ba576] w-full py-3 rounded-xl text-[#dfdfdf] font-bold">Add Money</button>
        </div>
    </div>
}