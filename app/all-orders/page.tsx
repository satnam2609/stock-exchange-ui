"use client";

import { Divider } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

async function fetchOrders() {
  const response = await fetch("http://localhost:3000/api/stock/orders", {
    cache: "no-store",
  });

  const res = await response.json();

  return res.message;
}

export default function AllOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders()
      .then((res) => {
        if (res?.length > 0) {
          setOrders(res);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="w-full h-full grid grid-cols-2">
      <div>Orders Filter</div>

      <div className="flex flex-col items-center gap-3 w-full">
        {orders.map((order: any) => {
          return (
            <div className="w-full ">
              <p className="px-4">{moment(order.createdAt).format("DD MMM yyyy")}</p>
              <Divider
                dashed
                style={{
                  borderColor: "#313030",
                  marginTop: 0,
                  marginBottom: 0,
                }}
              />
              <div className="w-full flex items-center ">
                <p>${order.price.toFixed(2)}</p>
                <p>{order.shares}</p>
                <p>{order.orderType}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
