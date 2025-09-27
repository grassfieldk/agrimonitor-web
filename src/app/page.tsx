"use client";

import { useEffect, useState } from "react";
import type { SensorData } from "@/types/types";

export default function Home() {
  const [data, setData] = useState<SensorData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
  }, []);

  return (
    <div className="container m-auto py-8">
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
