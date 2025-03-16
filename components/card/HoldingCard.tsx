import { Divider } from "antd";
import { useEffect, useState } from "react";

type HoldData = {
  investedPrice: number;
  holding: number;
};

export default function HoldingCard({
  data,
  currentValue,
}: {
  data: HoldData;
  currentValue: string;
}) {
  const [roi, setRoi] = useState<number>(0);
  const [percentage, setPercentage] = useState("");
  useEffect(() => {
    if (data.holding > 0) {
      setRoi(parseFloat(currentValue) - data.investedPrice);
      setPercentage(((roi * 100) / data.investedPrice).toFixed(2));
    }
  }, [currentValue]);
  return (
    <div className="border-[1px] w-full h-full rounded-md border-[#313030]">
      <div className="py-2 w-full">
        <div className="px-3 w-full flex justify-between items-center gap-8">
          <p className="px-3 py-1 text-start text-[#b1afaf] text-lg font-medium">
            Portfolio
          </p>
          <p className="font-bold text-[#bbe486] text-xl">Quantum(QTC)</p>
        </div>
        <Divider
          style={{
            borderColor: "#313030",
            marginTop: 0,
            marginBottom: 0,
          }}
        />
      </div>
      <div className="px-4 py-7 flex justify-between items-center w-full gap-3">
        <div className="flex flex-col items-center ">
          <p className="font-bold text-4xl">${currentValue}</p>
          <p className="text-lg text-[#ffffffa1]">Current value</p>
        </div>

        <Divider
          type="vertical"
          style={{
            borderColor: "#313030",
            height: 100,
          }}
        />

        <div className="flex items-center justify-between gap-3 w-full">
          <div className="flex flex-col items-start ">
            <p>Invested value</p>
            <p>Total returns</p>
            <p>Total Holdings</p>
          </div>

          <div className="flex flex-col items-center text-xl">
            <p className="font-bold">${data.investedPrice}</p>
            <p
              className={`${
                roi > 0 ? "text-[#3ddda0]" : "text-[#d64242]"
              } font-bold`}
            >
              {roi > 0 ? "+" : "-"}${roi > 0 ? roi.toFixed(2) : -roi.toFixed(2)}{" "}
              ({percentage}%)
            </p>
            <p>{data.holding} QTC</p>
          </div>
        </div>
      </div>
    </div>
  );
}
