"use client";

import HoldingCard from "@/components/card/HoldingCard";
import { socket } from "@/app/socket";
import { toast } from "react-toastify";
import PendingOrders from "@/components/table/PendingOrders";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import BalanceCard from "@/components/card/BalanceCard";
import CandlestickLoader from "@/components/loader/Loader";

 

export default function Holdings() {
  const [currentPrice, setCurrentPrice] = useState("0");
  const [report, setReport] = useState("");
  const { data: session } = useSession();
  const [holdings, setHoldings] = useState({
    investedPrice: 0,
    holding: 0,
  });

  const [pendingOrders, setPendingOrders] = useState([]);
  async function fetchHoldings() {
    const response = await fetch("http://localhost:3000/api/stock/holdings", {
      cache: "no-cache",
    });

    const res = await response.json();
    console.log(res);
    return res.message;
  }

  async function fetchPendingOrders() {
    const response = await fetch("http://localhost:3000/api/stock/orders", {
      cache: "no-cache",
    });

    const res = await response.json();

    return res.message;
  }

 

  useEffect(() => {
    function onMessage(msg: string) {
      const { price, channel } = JSON.parse(msg);
      console.log("Dashboard joined")
      if (channel === "EXECUTE_FEED" && price) {
        setCurrentPrice((price as number).toFixed(2));
      }
    }

    function onReports(msg: string) {
      const res = JSON.parse(msg);
      if (res.Ok) {
        let response = res.Ok;
        if (response.Executed) {
          setReport("Your order has been executed");
          let arr = response.Executed;
          console.log(arr);
          // id,trade,price,shares,status,side
          fetch("/api/stock/report/execute", {
            method: "PUT",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              id: arr[0],
              status: arr[4],
              tradePrice: arr[1],
              shares: arr[3],
            }),
          })
            .then((res) => res.json())
            .then((res) => console.log(res))
            .catch((err) => console.error(err));
        } else if (response.Cancelled) {
          setReport("Your order has been cancelled");
        }
      }
    }
    if (session?.user.id) {
      socket.emit("join", session?.user.id as string);
      socket.on("message", onMessage);

      socket.on("reports", onReports);
    }
    return () => {
      socket.off("message", onMessage);

      socket.off("reports", onReports);
    };
  }, [session]);

  

 
  useEffect(() => {
    fetchHoldings()
      .then((res) => {
        console.log(res);
        if (res?.holding) {
          setHoldings(res);
        }
      })
      .catch((err) => console.error(err));

    fetchPendingOrders().then((res) => {
      if (res?.length > 0) {
        const arr = res.map((ord: any, index: number) => {
          return {
            ...ord,
            key: index,
          };
        });
        setPendingOrders(arr);
      }
    });
  }, [report]);

  if (report !== "") {
    toast.success(report);
    setReport("");
  }

  return (
    <div className="grid grid-cols-5 grid-rows-2 w-[80%] py-10 h-full gap-10">
      
        <div className="col-span-3 ">
          <HoldingCard data={holdings} currentValue={currentPrice} />
        </div>

        <div className="col-span-2 row-span-2">
        <BalanceCard/>
      </div>

        <div className="col-span-3">
          <PendingOrders data={pendingOrders} />
        </div>
    
      
    </div>
  );
}
