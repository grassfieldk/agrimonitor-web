"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { SensorData } from "@/types/types";

const fetchInterval = Number(process.env.NEXT_PUBLIC_FETCH_INTERVAL);

export default function Home() {
  const [data, setData] = useState<SensorData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>("");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fetchData = async () => {
      try {
        const sensorRes = await fetch("/api/sensor");
        const sensorJson = await sensorRes.json();
        setData(sensorJson);

        setPhotoUrl(`/api/photo?${Date.now()}`);
      } catch (err) {
        setError(String(err));
        setData(null);
      }
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
          {photoUrl && (
            <div className="relative w-64 h-48">
              <Image
                src={photoUrl}
                alt="camera"
                fill
                className="rounded-lg border border-neutral-700 object-contain"
                priority
              />
            </div>
          )}
        </div>
      ) : (
        <div>読み込み中...</div>
      )}
    </div>
  );
}
