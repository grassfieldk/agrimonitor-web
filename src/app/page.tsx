"use client";

import { useEffect, useState } from "react";
import type { SensorData } from "@/types/types";

const fetchInterval = Number(process.env.NEXT_PUBLIC_FETCH_INTERVAL);

export default function Home() {
  const [data, setData] = useState<SensorData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fetchData = () => {
      fetch("/api/sensor")
        .then((res) => res.json())
        .then((json) => {
          if (json.error) {
            setError(json.error);
          } else {
            setData(json);
          }
        })
        .catch((err) => setError(String(err)));
    };
    fetchData();
    timer = setInterval(fetchData, fetchInterval * 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {error ? (
        <div className="text-red-500">データ取得エラー: {error}</div>
      ) : data ? (
        <div className="bg-neutral-800 rounded-lg shadow p-8 flex flex-col items-center gap-4">
          <p>取得日時: {data.datetime}</p>
          <p className="text-2xl">
            {data.temperature}℃ / {data.humidity}%
          </p>
        </div>
      ) : (
        <div>読み込み中...</div>
      )}
    </div>
  );
}
