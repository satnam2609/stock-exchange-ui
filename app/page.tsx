"use client";

import AssestField from "@/components/card/AssestField";
import OrderCard from "@/components/card/OrderCard";
import { useEffect, useState } from "react";

import { socket } from "@/app/socket";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import CandlestickLoader from "@/components/loader/Loader";

type Trade = {
  time: string;
  price: number;
  shares: number;
  order_type: string;
};

type OrderBookData = {
  [price: number]: number;
};

 

export default function Home() {
  const [askOrders, setAskOrders] = useState<OrderBookData>({});
  const [bidOrders, setBidOrders] = useState<OrderBookData>({});
  const [data, setData] = useState<Trade[]>([]);
  const { data: session, status } = useSession();
  const [report, setReport] = useState("");

  useEffect(() => {
    fetch("/api/trades", {
      cache: "no-cache",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.message.length > 0) {
          setData(res.message);
        }
      });
  }, []);

  useEffect(() => {
    function onMessage(msg: string) {
      const { price, shares, time, order_type, channel } = JSON.parse(msg);

      if (channel === "EXECUTE_FEED" && price) {
        setData((prev) => [
          ...prev,
          { price: parseFloat(price), shares, time, order_type },
        ]);
      }
    }

    function onMarket(msg: string) {
      const { asks, bids } = JSON.parse(msg);
      let object: any = {};
      for (let i = 0; i < asks.length; i++) {
        object[asks[i].price] = asks[i].level;
      }

      setAskOrders(object);

      object = {};
      for (let i = 0; i < bids.length; i++) {
        object[bids[i].price] = bids[i].level;
      }

      setBidOrders(object);
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
      socket.on("market_feed", onMarket);
      socket.on("reports", onReports);
    }
    return () => {
      socket.off("message", onMessage);
      socket.off("market_feed", onMarket);
      socket.off("reports", onReports);
    };
  }, [session]);

  if (report !== "") {
    toast.success(report);
    setReport("");
  }

  if (status === "loading") return <div className="w-full h-full m-auto">
    <CandlestickLoader/>
  </div>;
  if (!session) return <p>No active session</p>;

  return (
    <div className="w-full flex items-center justify-between gap-2">
      <div className="w-full flex flex-col items-start">
        <AssestField data={data} askOrders={askOrders} bidOrders={bidOrders} />
      </div>
    </div>
  );
}
