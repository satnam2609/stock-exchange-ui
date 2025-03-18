"use client";

import { RightOutlined } from "@ant-design/icons";
import { Checkbox, Divider, TimePicker } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

async function fetchOrders() {
  const response = await fetch("http://localhost:3000/api/stock/orders", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      side: "BID",
      statuses: ["WAIT"],
      date: "",
    }),
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

  const OrderInfoTopic = ({ text, about }: { text: string; about: string }) => {
    return (
      <div className="flex flex-col items-start">
        <p className="text-lg font-bold">{text}</p>
        <p className="text-sm font-thin text-[#6b686b]">{about}</p>
      </div>
    );
  };

  const OrderInfo = ({ order }: { order: any }) => {
    return (
      <div key={order.createdAt} className="w-full ">
        <p className="px-4 text-[#6b686b] font-semibold">
          {moment(order.createdAt).format("DD MMM yyyy")}
        </p>
        <Divider
          dashed
          style={{
            borderColor: "#313030",
            marginTop: 5,
            marginBottom: 15,
          }}
        />
        <div className="w-full flex items-center justify-between">
          <OrderInfoTopic
            text="Quantum"
            about={
              (order.orderType === "BID" ? "Buy" : "Sell") +
              " . Limit . Regular"
            }
          />
          <OrderInfoTopic text={order.shares as string} about="Qty" />
          <OrderInfoTopic
            text={"$" + order.price.toFixed(2)}
            about={"Avg.Price"}
          />

          <div className="flex items-center gap-2">
            <p>{moment(order.updatedAt).format("hh:mm A")}</p>
            <p
              className={`${
                order.orderStatus === "EXECUTED"
                  ? "border-[#62d440]"
                  : order.orderStatus === "PARTIAL"
                  ? "border-[#20c9c9]"
                  : order.orderStatus === "WAIT"
                  ? "border-[#dbc81c]"
                  : order.orderStatus === "CANCEL"
                  ? "border-[#e23535]"
                  : "border-[#585656]"
              } border-[8px] rounded-full`}
            ></p>

            <RightOutlined className="text-[#6b686b]" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full grid grid-cols-2 gap-8">
      <div className="border-[1px] border-[#313030] flex flex-col items-center">
        <div className="flex py-5 px-4 items-center justify-between w-full">
          <p className="font-semibold">Filters</p>
          <button className="text-[#3ddda0] font-semibold">Clear all</button>
        </div>
        <Divider
          style={{
            borderColor: "#313030",
            marginTop: 0,
            marginBottom: 0,
          }}
        />

        <div className="flex px-4 py-3 items-center justify-between w-full">
          <div className="flex items-center justify-between gap-3">
            <p>From</p>
            <TimePicker />
          </div>
          <div className="flex items-center justify-between gap-3">
            <p>To</p>
            <TimePicker />
          </div>
        </div>

        <Divider
          style={{
            borderColor: "#313030",
            marginTop: 0,
            marginBottom: 0,
          }}
        />

        <div className="flex flex-col items-start gap-4 w-full px-4 py-4">
          <div className="flex items-center gap-3">
            <Checkbox />
            <p>Buy orders</p>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox />
            <p>Sell orders</p>
          </div>
        </div>

        <Divider
          style={{
            borderColor: "#313030",
            marginTop: 0,
            marginBottom: 0,
          }}
        />
        <div className="flex flex-col items-start gap-4 w-full px-4 py-4">
          <div className="flex items-center gap-3 w-full">
            <Checkbox />
            <div className="w-full flex items-center justify-between">
              <p>Orders in progress</p>
              <p className="border-[10px] border-[#dfc430] rounded-full"/>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full">
            <Checkbox />
            <div className="w-full flex items-center justify-between">
              <p>Successfull orders</p>
              <p className="border-[10px] border-[#74d434] rounded-full"/>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full">
            <Checkbox />
            <div className="w-full flex items-center justify-between">
              <p>Cancelled orders</p>
              <p className="border-[10px] border-[#eb3e3e] rounded-full"/>
            </div>
          </div>


          <div className="flex items-center gap-3 w-full">
            <Checkbox />
            <div className="w-full flex items-center justify-between">
              <p>Unsuccessfull orders</p>
              <p className="border-[10px] border-[#6e6e6d] rounded-full"/>
            </div>
          </div>

        </div>
      </div>

      <div key={"Orders"} className="flex flex-col items-center gap-3 w-full">
        {orders.map((order: any) => {
          return <OrderInfo order={order} />;
        })}
      </div>
    </div>
  );
}
