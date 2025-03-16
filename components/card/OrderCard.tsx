"use client";

import { LoadingOutlined } from "@ant-design/icons";
import { ConfigProvider, Divider, Menu, MenuProps, message } from "antd";

import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";

type Order = {
  price: number;
  shares: number;
  order_type: string;
};

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    label: "Buy",
    key: "BID",
  },
  {
    label: "Sell",
    key: "ASK",
  },
];

export default function OrderCard() {
  let initialOrder = {
    price: 0.0,
    shares: 0,
    order_type: "BID",
  };
  const [order, setOrder] = useState<Order>(initialOrder);
  const [loading, setLoading] = useState(false);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setOrder({
      ...order,
      [e.target.name]: e.target.value,
    });

    console.log(order);
  };

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setOrder((prevOrder) => ({
      ...prevOrder,
      order_type: e.key,
    }));
  };

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch(
      `http://localhost:3000/api/stock/${
        order.order_type === "BID" ? "buy" : "sell"
      }`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          price: order.price,
          shares: order.shares,
        }),
      }
    );
    const res = await response.json();
    console.log(res);
    if (response.ok) {
      toast.info("Your Order is been processed!");
    } else {
      if (response.status === 400) {
        toast.error("Insufficient balance!");
      }
    }
    setLoading(false);
    setOrder(initialOrder);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center rounded-xl border-[1px] border-[#313030]">
      <div className="w-full px-5 py-2">
        <p className="text-start text-xl font-bold text-[#ffffff]">
          Quantum (QUM)
        </p>
        <p className="text-sm">Avg.price $101.50</p>
      </div>
      <Divider
        style={{
          borderColor: "#313030",
          marginTop: 0,
          marginBottom: 0,
        }}
      />
      <div className=" w-full px-5 py-3">
        <ConfigProvider
          theme={{
            components: {
              Menu: {
                horizontalItemHoverColor:
                  order.order_type === "BID" ? "#FF3558" : "#2de6a8",
                horizontalItemSelectedColor:
                  order.order_type === "BID" ? "#2de6a8" : "#FF3558",
                itemColor: "#fff",
                itemHoverColor: "#fff",
              },
            },
            token: {
              colorBgBase: "#0a0a0a",
              fontSize: 20,
              colorSplit: "#313030",
            },
          }}
        >
          <Menu
            onClick={onClick}
            selectedKeys={[order.order_type]}
            mode="horizontal"
            items={items}
          />
        </ConfigProvider>
      </div>
      <div className="w-full px-4 py-3">
        <form onSubmit={handleSubmit} className="w-full flex flex-col  gap-3">
          <div className="flex flex-col items-center gap-3">
            <div className="w-full flex justify-between items-center gap-3">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                value={order.price}
                name="price"
                onChange={(e) => handleChange(e)}
                min={"90"}
                step={"0.01"}
                max={"200"}
                className="border-[#313030] px-1 w-1/4 border-[1px] rounded-sm  bg-transparent py-1"
              />
            </div>
            <div className="w-full flex justify-between items-center gap-3">
              <label htmlFor="Quantity">Quantity</label>
              <input
                type="number"
                min={1}
                name="shares"
                value={order.shares}
                onChange={(e) => handleChange(e)}
                className="border-[#313030] px-1 w-1/4 border-[1px] rounded-sm  bg-transparent py-1"
              />
            </div>
          </div>

          <button
            className={`w-full text-black font-medium ${"bg-[#c5c9c7]"} rounded-lg py-3`}
          >
            {loading ? <LoadingOutlined /> : <p>Submit</p>}
          </button>
        </form>
      </div>
    </div>
  );
}
