"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { initialSensorData, type SensorData } from "@/types/types";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const fetchInterval = Number(process.env.NEXT_PUBLIC_FETCH_INTERVAL);
const fetchIntervalSeconds = fetchInterval / 1000;

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
    timer = setInterval(fetchData, fetchInterval);
    return () => clearInterval(timer);
  }, []);

  if (error) {
    return <div className="text-red-500">データ取得エラー: {error}</div>;
  }

  return (
    <div className="p-4 flex flex-col justify-center items-center space-y-2 bg-neutral-800 rounded-lg shadow">
      <div className="flex flex-row flex-wrap items-center mb-2 max-w-64 w-full justify-between mx-auto">
        <DatetimeDisplay datetime={data.datetime} />
        <TempHumidityDisplay
          temperature={data.temperature}
          humidity={data.humidity}
        />
      </div>
      <PhotoDisplay photoUrl={photoUrl} />
    </div>
  );
}

const DatetimeDisplay = ({ datetime }: { datetime: string }) => (
  <div>
    <span className="text-xs text-neutral-300">更新日時</span>
    <br />
    {datetime}
  </div>
);

const TempHumidityDisplay = ({
  temperature,
  humidity,
}: {
  temperature: string;
  humidity: string;
}) => {
  // 10-30: #3b82f6-#c41e1e
  const tempNum = Math.min(Math.max(Number(temperature), 10), 30);
  const ratio = (tempNum - 10) / 20;
  const r = Math.round(59 + ratio * (200 - 59));
  const g = Math.round(130 - ratio * (130 - 30));
  const b = Math.round(246 - ratio * (246 - 30));
  const tempColor = `rgb(${r},${g},${b})`;

  // 40-70: #38bdf8-#3b82f6
  const humNum = Math.min(Math.max(Number(humidity), 40), 70);
  const humRatio = (humNum - 40) / 30;
  const hr = Math.round(56 + humRatio * (59 - 56));
  const hg = Math.round(189 + humRatio * (130 - 189));
  const hb = Math.round(248 + humRatio * (246 - 248));
  const humColor = `rgb(${hr},${hg},${hb})`;

  return (
    <div>
      <span className="text-xl font-bold" style={{ color: tempColor }}>
        {temperature}
      </span>
      <span className="inline-block w-6 text-center text-neutral-300">℃</span>
      <br />
      <span className="text-xl font-bold" style={{ color: humColor }}>
        {humidity}
      </span>
      <span className="inline-block w-6 text-center text-neutral-300">%</span>
    </div>
  );
};

const PhotoDisplay = ({ photoUrl }: { photoUrl: string }) => {
  if (!photoUrl) return null;
  return (
    <div className="relative w-full aspect-video">
      <Image
        src={photoUrl}
        alt="camera"
        fill
        sizes="(max-width: 640px) 100vw, 640px"
        className="rounded-lg border border-neutral-700 object-cover bg-black"
        priority
      />
      {`※ 画像は ${fetchIntervalSeconds} 秒間隔で更新されます`}
    </div>
  );
};
