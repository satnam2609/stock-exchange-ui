import { Divider } from "antd";
import moment from "moment";
import { ConfigProvider, Menu, MenuProps } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

type RawData = {
  price: number;
  shares: number;
  time: string;
  order_type: string;
};

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    label: "Market trades",
    key: "market",
  },
  {
    label: "My trades",
    key: "my",
  },
];

const MyMarketAnchor = ({
  myMarket,
  setMyMarket,
}: {
  myMarket: string;
  setMyMarket: Dispatch<SetStateAction<string>>;
}) => {
  const onClick: MenuProps["onClick"] = (e) => {
    setMyMarket(e.key);
  };
  return (
    <ConfigProvider
      theme={{
        token: {
          colorText: "#ffffff",
          colorPrimary: "#fff",
          fontSize: 15,
          lineWidthBold: 1,
        },
        components: {
          Menu: {
            horizontalItemHoverColor: "transparent",
          },
        },
      }}
    >
      <Menu
        style={{
          background: "transparent",
        }}
        onClick={onClick}
        selectedKeys={[myMarket]}
        mode="horizontal"
        items={items}
      />
    </ConfigProvider>
  );
};

export default function ExecutedOrders({ data }: { data: RawData[] }) {
  const [myMarket, setMyMarket] = useState("market");
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [is401, setIs401] = useState(false);

  async function getOrders() {
    const res = await fetch("/api/stock/orders",{
      method:"POST",
      headers:{
        "Content-type":"application/json"
      },
      body:JSON.stringify({
        side:"",
        statuses:[],
        dateRange:""
      })
    });
    if (res.ok) {
      const response = await res.json();
      return response.message;
    } else {
      if (res.status === 401) {
        setIs401(true);
        return [];
      }
    }
  }

  useEffect(() => {
    if (myMarket === "my") {
      setLoading(true);
      getOrders()
        .then((data) => {
          if (data instanceof Array){
            setMyOrders(data)
          }
        })
        .then(() => setLoading(false));
    }
  }, [myMarket]);

 
   
  return (
    <div className="w-full border-[1px] rounded-xl border-[#313030]  py-1">
      <MyMarketAnchor myMarket={myMarket} setMyMarket={setMyMarket} />

      <Divider
        style={{
          borderColor: "#313030",
          marginTop: 0,
          marginBottom: 0,
        }}
      />

      {myMarket === "market" ? (
        <table key={"myMarket"} className="w-full align-middle text-center">
          <tr className="w-full text-[#313030]   font-medium text-sm px-5">
            <th>Price</th>
            <th>Amount(QUM)</th>
            <th>Time</th>
          </tr>
          {data
            .slice(data.length - 13, -1)
            .map(({ price, shares, order_type, time }) => {
              return (
                <tr className="w-full font-medium  text-sm px-5">
                  <td
                    className={`${
                      order_type === "BID" ? "text-[#3ddda0]" : "text-[#bd2626]"
                    }`}
                  >
                    {price}
                  </td>
                  <td>{shares}</td>
                  <td>{moment(time).format("HH:mm:ss")}</td>
                </tr>
              );
            })}
        </table>
      ) : (
        <div>
          {loading ? (
            <div className="w-full">
              <LoadingOutlined />
            </div>
          ) : (
            <>
              {myOrders.length > 0 ? (
                <table className="w-full align-middle text-center">
                  <tr className="w-full text-[#313030]   font-medium text-sm px-5">
                    <th>Price</th>
                    <th>Amount(QUM)</th>
                    <th>Status</th>
                  </tr>
                  {myOrders.map(
                    ({ price, shares, orderType, orderStatus }) => {
                      return (
                        <tr className="w-full font-medium  text-sm px-5">
                          <td
                            className={`${
                              orderType === "BID"
                                ? "text-[#3ddda0]"
                                : "text-[#bd2626]"
                            }`}
                          >
                            {price}
                          </td>
                          <td>{shares}</td>
                          <td
                            className={`${
                              orderStatus === "WAIT"
                                ? "text-[#f0d32f]"
                                : "text-[#32d0ec]"
                            }`}
                          >
                            {orderStatus}
                          </td>
                        </tr>
                      );
                    }
                  )}
                </table>
              ) : (
                <div className="text-center px-5 py-5">
                  <p className="text-sm text-[#4b4949]">No trades found</p>
                  {is401 ? <div>Login to start trading</div> : ""}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
