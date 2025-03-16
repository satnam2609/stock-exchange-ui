"use client";

import { useState, useEffect } from "react";
import { ConfigProvider, Space, Table, Tag } from "antd";
import type { TableProps } from "antd";

interface DataType {
  key: string;
  orderId: string;
  price: number;
  shares: number;
  orderType: string;
  orderStatus: string;
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Order id",
    dataIndex: "orderId",
    key: "id",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Quantity",
    dataIndex: "shares",
    key: "shares",
  },
  {
    title: "Status",
    dataIndex: "orderStatus",
    render: (_, { orderStatus }) => (
      <>
        {orderStatus === "WAIT" ? (
          <Tag color="yellow">{orderStatus.toUpperCase()}</Tag>
        ) : (
          <Tag>{orderStatus.toUpperCase()}/</Tag>
        )}
      </>
    ),
  },
  {
    title: "Side",
    dataIndex: "type",
    render: (_, { orderType }) => (
      <>
        {orderType === "BID" ? (
          <Tag color="green">{orderType}</Tag>
        ) : (
          <Tag color="volcano">{orderType}</Tag>
        )}
      </>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a
          onClick={() =>
            cancelOrder({ id: record.orderId })
              .then((res) => console.log(res))
              .catch((err) => console.error(err))
          }
        >
          Cancel
        </a>
      </Space>
    ),
  },
];

async function cancelOrder({ id }: { id: string }) {
  const response = await fetch("http://localhost:3000/api/stock/cancel", {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      id,
    }),
  });

  const res = await response.json();

  return res.message;
}
export default function PendingOrders({ data }: { data: any }) {
  return (
    <div className="w-full h-full">
      <ConfigProvider
        theme={{
          components: {
            Table: {
              bodySortBg: "#313030",
              borderColor: "#313030",
              footerBg: "#0a0a0a",
              headerBg: "#313030",
            },
          },
          token: {
            colorBgContainer: "#0a0a0a",
            colorPrimaryBorder: "#313030",
            colorText: "#fff",
            
          },
        }}
      >
        <Table<DataType>
          className="w-full"
          columns={columns}
          dataSource={data}
        />
      </ConfigProvider>
    </div>
  );
}
