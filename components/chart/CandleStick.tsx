"use client";

import {
  BarSeries,
  CandlestickSeries,
  createChart,
  HistogramSeries,
  IChartApi,
  ISeriesApi,
  LineSeries,
  UTCTimestamp,
} from "lightweight-charts";
import { useEffect, useRef } from "react";

type CandleStickData = {
  time: number;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
};

export default function CandleStickChart({
  data,
}: {
  data: CandleStickData[];
}) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const maSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const barSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, {
      width: 900,
      height: 665,
      layout: {
        background: { color: "#0a0a0a" },
        textColor: "#fff",
      },
      grid: {
        horzLines: { visible: false },
        vertLines: { visible: false },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
    });

    seriesRef.current = chartRef.current.addSeries(CandlestickSeries, {
      priceScaleId: "right", // Ensure it's using the right price scale
      upColor:"#5eca94",
      wickUpColor:"#5eca94",
      borderUpColor:"#5eca94",
      downColor:"#FF3558",
      wickDownColor:"#FF3558",
      borderDownColor:"#FF3558"
    });

    maSeriesRef.current = chartRef.current.addSeries(LineSeries, {
      color: "orange",
      lineWidth: 2,
    });

    barSeriesRef.current = chartRef.current.addSeries(HistogramSeries, {
      color: "rgba(0, 150, 0, 0.8)",
      priceScaleId: "vol", // Assign to separate price scale
      priceFormat: { type: "volume" },
      title:"Volume",
      baseLineWidth:2
    });

    chartRef.current.priceScale("vol").applyOptions({
      scaleMargins: {
        top: 0.8, // Allocates 80% to candlestick chart
        bottom: 0, // Keeps volume bars at the bottom
      },
      borderVisible: true, // Ensure the scale is visible
      autoScale: true, // Allow it to resize dynamically
      entireTextOnly: false, // Allow partial numbers
    });

    chartRef.current.priceScale("right").applyOptions({
      scaleMargins: {
        top: 0.4,
        bottom: 0.4,
      },
      autoScale: true, // Ensures the price axis dynamically adjusts
      borderVisible: true, // Show a border between price & volume
      entireTextOnly: false, // Allows partial numbers
      alignLabels: true, // Ensures price labels are shown
    });

    chartRef.current.applyOptions({
      rightPriceScale: {
        visible: true, // Ensures the price axis is shown
        autoScale: true, // Dynamically scales with the data
      },
    });

    chartRef.current.timeScale().applyOptions({
      rightOffset: 10, // Adds space for better scaling
    });

    return () => chartRef.current?.remove();
  }, []);

  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      // Sort the data to ensure it's strictly ascending
      const sortedData = [...data].sort((a, b) => a.time - b.time);

      const seenTimes = new Set<number>();
      const chartData = sortedData.map((d) => {
        let adjustedTime = Math.floor(d.time / 1000); // Convert to UTC timestamp

        // If time already exists, increment by 1 second
        while (seenTimes.has(adjustedTime)) {
          adjustedTime += 1;
        }
        seenTimes.add(adjustedTime);

        return {
          time: adjustedTime as UTCTimestamp,
          open: d.open,
          close: d.close,
          high: d.high,
          low: d.low,
          volume: d.volume,
        };
      });

      seriesRef.current.setData(chartData);
      
      // Calculate Simple Moving Average (SMA)
    const period = 10;
    const movingAverageData = [];

    for (let i = period - 1; i < chartData.length; i++) {
      const sum = chartData
        .slice(i - period + 1, i + 1)
        .reduce((acc, val) => acc + val.close, 0);
      const avg = sum / period;

      movingAverageData.push({ time: chartData[i].time, value: avg });
    }

    

    if (movingAverageData.length > 0) {
      maSeriesRef.current?.setData(movingAverageData);
    } else {
      console.log("Still no valid moving average data.");
    }
      

      // Process volume data
      if (barSeriesRef.current && chartData.length > 0) {
        const volumeData = chartData.map((d) => ({
          time: d.time, // Use already adjusted timestamps
          value: d.volume, // Volume must be a valid number
          color: d.close >= d.open ? "#5eca94" : "#FF3558",
        }));

         
        barSeriesRef.current.setData(volumeData);
      }
    }
  }, [data]);

  return <div ref={chartContainerRef} />;
}
