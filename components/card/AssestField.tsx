"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { socket } from "@/app/socket";
import { CaretDownFilled, CaretUpFilled } from "@ant-design/icons";

import moment from "moment";
import CandleStickChart from "../chart/CandleStick";
import { CandlestickData, UTCTimestamp } from "lightweight-charts";
import Prices from "../extra/Prices";
import OrderBook from "./OrderBook";
import OrderCard from "./OrderCard";
import LowHigh from "../extra/LowHigh";
import ExecutedOrders from "./ExecutedOrders";
import { error } from "console";

type RawData = {
  price: number;
  shares: number;
  time: string;
  order_type: string;
};

type CandleStickData = {
  time: number;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
};

export default function AssestField({
  data,
  askOrders,
  bidOrders,
}: {
  data: RawData[];
  askOrders: {
    [price: string]: number;
  };
  bidOrders: {
    [price: string]: number;
  };
}) {
  const [current, setCurrent] = useState<CandleStickData>({
    open: 0,
    close: 0,
    high: 0,
    low: 0,
    time: 0,
    volume: 0,
  });

  const [candleStickData, setCandleStickData] = useState<CandleStickData[]>([]);

  const [percentage, setPercentage] = useState(0);
  const genCandleStickData = (data: RawData[], intervalTime = 2) => {
    const grouped: Record<
      number,
      { open: number; high: number; low: number; close: number; volume: number }
    > = {};

    data.forEach(({ price, time, shares }) => {
      const date = new Date(time);
      const minutes = date.getMinutes();
      const roundedMinutes = Math.floor(minutes / intervalTime) * intervalTime;

      date.setMinutes(roundedMinutes, 0);

      const timestamp = Math.floor(date.getTime() / 1000);

      if (!grouped[timestamp]) {
        grouped[timestamp] = {
          open: price,
          high: price,
          low: price,
          close: price,
          volume: shares,
        };
      } else {
        grouped[timestamp].high = Math.max(grouped[timestamp].high, price);
        grouped[timestamp].low = Math.min(grouped[timestamp].low, price);
        grouped[timestamp].close = price;
        grouped[timestamp].volume += shares;
      }
    });

    return Object.entries(grouped).map(
      ([time, { open, high, low, close, volume }]) => ({
        time: Number(time),
        open,
        high,
        low,
        close,
        volume,
      })
    );
  };

  useEffect(() => {
    if (data.length === 0) return;

    // Generate candlestick data
    const newCandles = genCandleStickData(data);
    setCandleStickData(newCandles);

    setCurrent(candleStickData[candleStickData.length - 1]);
    setPercentage(current?.close - 100.0);
  }, [data]);

  return (
    <div className="w-full">
      <div className="w-full pb-5 grid grid-cols-4 justify-between">
        <div className="col-span-1 flex items-center justify-start gap-2">
          <Image
            src={"/quanta.jpg"}
            alt="Quanta logo"
            width={65}
            height={65}
            className="rounded-xl"
          />
          <div>
            <div>
              <div>
                <p className="text-[#bfd8cb] text-2xl font-bold">Quantum</p>
              </div>
              <div className="flex justify-start items-center gap-4">
                <p className="text-[#ffffff] text-xl font-medium">
                  ${current?.close}
                </p>

                {percentage > 0 ? (
                  <div className="flex items-center ">
                    <CaretUpFilled className="text-[#36d317]" />
                    <p className="text-[#3ddda0]">{percentage.toFixed(2)}%</p>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <CaretDownFilled className="text-[#bd2626]" />
                    <p className="text-[#bd2626]">{percentage.toFixed(2)}%</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Prices
          open={current?.open}
          close={current?.close}
          high={current?.high}
          low={current?.low}
          volume={current?.volume}
        />
      </div>

      <div className="grid grid-cols-5">
        <div className="col-span-1">
          <OrderBook askOrders={askOrders} bidOrders={bidOrders} />
        </div>

        <div className="col-span-3 h-full flex flex-col items-center gap-2">
          <CandleStickChart data={candleStickData} />
        </div>

        <div className="flex flex-col items-center gap-2">
          <OrderCard />

          <ExecutedOrders data={data} />
        </div>
      </div>
    </div>
  );
}
