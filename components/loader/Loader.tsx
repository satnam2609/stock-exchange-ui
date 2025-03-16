"use client";

import { motion } from "framer-motion";


export default function CandlestickLoader() {
  const sticks = [
    { delay: 0, color: "bg-green-500" },
    { delay: 0.2, color: "bg-red-500" },
    { delay: 0.4, color: "bg-green-500" },
    { delay: 0.6, color: "bg-red-500" },
    { delay: 0.8, color: "bg-green-500" }
  ];

  return (
    <div className="flex items-center justify-center space-x-2 h-16">
      {sticks.map((stick, index) => (
        <div key={index} className="flex flex-col items-center">
          {/* Upper Wick */}
          <motion.div
            className={`w-0.5 h-4 ${stick.color}`}
            initial={{ height: "5px" }}
            animate={{ height: ["5px", "15px", "10px", "12px", "5px"] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: stick.delay
            }}
          />
          {/* Candle Body */}
          <motion.div
            className={`w-2 ${stick.color}`}
            initial={{ height: "10px" }}
            animate={{ height: ["10px", "40px", "20px", "30px", "10px"] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: stick.delay
            }}
          />
          {/* Lower Wick */}
          <motion.div
            className={`w-0.5 h-4 ${stick.color}`}
            initial={{ height: "5px" }}
            animate={{ height: ["5px", "15px", "10px", "12px", "5px"] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: stick.delay
            }}
          />
        </div>
      ))}
    </div>
  );
};

 