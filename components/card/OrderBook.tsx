"use client";

import { Divider } from "antd";
import { useEffect, useState } from "react";

export default function OrderBook({
  askOrders,
  bidOrders,
}: {
  askOrders: {
    [price: string]: number;
  };
  bidOrders: {
    [price: string]: number;
  };
}) {
  const [askVol, setaskVol] = useState(0);
  const [bidVol, setBidVol] = useState(0);

  return (
    <div className="w-full border-[1px] border-[#313030] rounded-lg h-[70vh]">
      <p className="px-3 py-2 text-xl font-medium text-[#b9b5b5]">Order book</p>
      <Divider
        style={{
          borderColor: "#313030",
          width: "10px",
          marginTop: 0,
          marginBottom: 0,
        }}
      />
      <table className="align-middle text-center w-full">
        <tr className="w-full font-medium text-[#313030] ">
          <th>Price</th>
          <th>Volume</th>
        </tr>

        {Object.entries(askOrders)
          .sort((a: any, b: any) => {
            return b[0] - a[0];
          })
          .slice(0, 10)

          .map(([price, shares]) => {
            return (
              <tr className="w-full">
                <td className="text-[16px] text-[#bd2626]">{price}</td>
                <td className="text-[#bebcbc] text-[17px]">{shares}</td>
              </tr>
            );
          })}

        {Object.entries(bidOrders)
          .sort((a: any, b: any) => {
            return b[0] - a[0];
          })
          .slice(0, 10)
          .map(([price, shares]) => {
            return (
              <tr className="w-full" key={`${parseFloat(price).toFixed(2)}`}>
                <td className="text-[16px] font-bold text-[#3ddda0]">{price}</td>
                <td className="text-[#bebcbc] text-[17px]">{shares}</td>
              </tr>
            );
          })}
      </table>
    </div>
  );
}
