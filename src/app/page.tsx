"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { initialSensorData, type SensorData } from "@/types/types";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const fetchInterval = Number(process.env.NEXT_PUBLIC_FETCH_INTERVAL);

export default function Home() {
  const [data, setData] = useState<SensorData>(initialSensorData);
  const [error, setError] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>("");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fetchData = async () => {
      try {
        const sensorRes = await fetch("/api/sensor");
        const sensorJson = await sensorRes.json();
        setData(sensorJson);

        setPhotoUrl(`${backendUrl}/public/recent.jpg?${Date.now()}`);
      } catch (err) {
        setError(String(err));
        setData(initialSensorData);
      }
    };
    fetchData();
    timer = setInterval(fetchData, fetchInterval * 1000);
    return () => clearInterval(timer);
  }, []);

  if (error) {
    return <div className="text-red-500">データ取得エラー: {error}</div>;
  }

  return (
    <div className="bg-neutral-800 rounded-lg shadow p-8">
      <div className=" flex flex-col items-center gap-4">
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
    </div>
  );
}
