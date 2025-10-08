"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  initialSensorData,
  type SensorData,
  type TemperatureStatus,
  type Vegetable,
  type VegetableData,
} from "@/types/types";
import { checkTemperatureStatus } from "@/utils/utils";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const fetchInterval = Number(process.env.NEXT_PUBLIC_FETCH_INTERVAL);
const fetchIntervalSeconds = fetchInterval / 1000;

export default function Home() {
  const [data, setData] = useState<SensorData>(initialSensorData);
  const [vegetableData, setVegetableData] = useState<VegetableData>({
    vegetables: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [showGermination, setShowGermination] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fetchData = async () => {
      try {
        const sensorRes = await fetch("/api/sensor");
        const sensorJson = await sensorRes.json();
        setData(sensorJson);

        const vegetableRes = await fetch("/api/data");
        const vegetableJson = await vegetableRes.json();
        setVegetableData(vegetableJson);

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
    <>
      <div className="flex flex-col justify-center items-center p-4 pb-20 space-y-2 bg-neutral-800 rounded-lg shadow">
        <div className="flex flex-row flex-wrap justify-between items-center w-full max-w-64 mx-auto mb-2">
          <DatetimeDisplay datetime={data.datetime} />
          <TempHumidityDisplay
            temperature={data.temperature}
            humidity={data.humidity}
          />
        </div>
        <TemperatureIndicators
          vegetables={vegetableData.vegetables}
          currentTemperature={Number(data.temperature) || 0}
          showGermination={showGermination}
        />
        <PhotoDisplay photoUrl={photoUrl} />
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-700 p-4 shadow-lg">
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setShowGermination(!showGermination)}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              showGermination
                ? "bg-neutral-600 text-white shadow-md"
                : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
            }`}
          >
            発芽適温表示
          </button>
        </div>
      </div>
    </>
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
    <div className="w-full">
      <div className="relative w-full aspect-video">
        <Image
          src={photoUrl}
          alt="camera"
          fill
          sizes="(max-width: 640px) 100vw, 640px"
          className="object-cover bg-black border border-neutral-700 rounded-lg"
          priority
        />
      </div>
      <p className="mt-2 text-xs text-center text-neutral-400">{`※ 画像は ${fetchIntervalSeconds} 秒間隔で更新されます`}</p>
    </div>
  );
};

const StatusIcon = ({
  status,
  className = "w-3 h-3",
  title,
}: {
  status: TemperatureStatus;
  className?: string;
  title?: string;
}) => {
  const getStatusColor = (status: TemperatureStatus) => {
    switch (status) {
      case "optimal":
        return "bg-green-500";
      case "acceptable":
        return "bg-yellow-500";
      case "warning":
        return "bg-orange-500";
      case "danger":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div
      className={`rounded-full ${getStatusColor(status)} ${className}`}
      title={title}
    />
  );
};

const TemperatureIndicators = ({
  vegetables,
  currentTemperature,
  showGermination,
}: {
  vegetables: Vegetable[];
  currentTemperature: number;
  showGermination: boolean;
}) => {
  if (vegetables.length === 0 || currentTemperature === 0) {
    return null;
  }

  const getStatusText = (status: TemperatureStatus) => {
    switch (status) {
      case "optimal":
        return "最適";
      case "acceptable":
        return "良好";
      case "warning":
        return "注意";
      case "danger":
        return "危険";
      default:
        return "不明";
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="w-full grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
        {vegetables.map((vegetable) => {
          const growthStatus = checkTemperatureStatus(
            currentTemperature,
            vegetable,
            "growth",
          );
          const germinationStatus = checkTemperatureStatus(
            currentTemperature,
            vegetable,
            "germination",
          );

          return (
            <div
              key={vegetable.id}
              className="flex flex-col items-center p-2 text-center bg-neutral-600 rounded"
            >
              <div className="flex gap-1 mb-1">
                {showGermination && (
                  <StatusIcon
                    status={germinationStatus}
                    title={`${vegetable.name} (発芽): ${getStatusText(germinationStatus)}`}
                  />
                )}
                <StatusIcon
                  status={growthStatus}
                  title={`${vegetable.name} (生育): ${getStatusText(growthStatus)}`}
                />
              </div>
              <span className="w-full text-xs text-neutral-200 truncate">
                {vegetable.name}
              </span>
            </div>
          );
        })}
      </div>
      <div className="space-y-2 text-xs text-neutral-300">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-1">
            <StatusIcon status="optimal" />
            <span>最適</span>
          </div>
          <div className="flex items-center gap-1">
            <StatusIcon status="acceptable" />
            <span>良好</span>
          </div>
          <div className="flex items-center gap-1">
            <StatusIcon status="warning" />
            <span>注意</span>
          </div>
          <div className="flex items-center gap-1">
            <StatusIcon status="danger" />
            <span>危険</span>
          </div>
        </div>
      </div>
    </div>
  );
};
