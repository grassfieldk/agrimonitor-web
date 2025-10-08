"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { GiSeedling, GiWheat } from "react-icons/gi";
import { ToggleButton } from "@/components/ToggleButton";
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

const FOOTER_HEIGHT = "bottom-16";

function getStatusColor(status: TemperatureStatus): string {
  switch (status) {
    case "optimal":
      return "text-green-500";
    case "acceptable":
      return "text-lime-300";
    case "warning":
      return "text-orange-500";
    case "danger":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
}

function getStatusBgColor(status: TemperatureStatus): string {
  switch (status) {
    case "optimal":
      return "bg-green-600";
    case "acceptable":
      return "bg-lime-600";
    case "warning":
      return "bg-orange-600";
    case "danger":
      return "bg-red-600";
    default:
      return "bg-gray-600";
  }
}

function getStatusText(status: TemperatureStatus): string {
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
}

export default function Home() {
  const [data, setData] = useState<SensorData>(initialSensorData);
  const [vegetableData, setVegetableData] = useState<VegetableData>({
    vegetables: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [showGermination, setShowGermination] = useState<boolean>(false);
  const [showGrowth, setShowGrowth] = useState<boolean>(true);
  const [selectedVege, setSelectedVege] = useState<Vegetable | null>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && selectedVege) {
        setSelectedVege(null);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedVege]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fetchData = async () => {
      try {
        const sensorRes = await fetch("/api/sensor");
        const sensorJson = await sensorRes.json();
        setData(sensorJson);

        const vegeRes = await fetch("/api/data");
        const vegeJson = await vegeRes.json();
        setVegetableData(vegeJson);

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
          <div>
            <span className="text-xs text-neutral-300">更新日時</span>
            <br />
            {data.datetime}
          </div>
          <TempHumidityDisplay
            temperature={data.temperature}
            humidity={data.humidity}
          />
        </div>
        <TemperatureIndicators
          vegetables={vegetableData.vegetables}
          currentTemperature={Number(data.temperature) || 0}
          showGermination={showGermination}
          showGrowth={showGrowth}
          onVegetableSelect={setSelectedVege}
        />
        <PhotoDisplay photoUrl={photoUrl} />
      </div>

      {selectedVege && (
        <div
          className={`fixed ${FOOTER_HEIGHT} left-0 right-0 bg-neutral-800 p-4`}
        >
          <div className="container max-w-screen-xl mx-auto">
            <IndicatorInfo
              vegetable={selectedVege}
              growthStatus={checkTemperatureStatus(
                Number(data.temperature) || 0,
                selectedVege,
                "growth",
              )}
              germinationStatus={checkTemperatureStatus(
                Number(data.temperature) || 0,
                selectedVege,
                "germination",
              )}
            />
            <button
              type="button"
              onClick={() => setSelectedVege(null)}
              className="mt-2 w-full px-4 py-2 text-sm bg-neutral-700 text-neutral-300 rounded-lg hover:bg-neutral-600"
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-700 p-4 shadow-lg">
        <div className="flex justify-center gap-4">
          <ToggleButton
            isOn={showGermination}
            onToggle={() => setShowGermination(!showGermination)}
          >
            発芽適温表示
          </ToggleButton>
          <ToggleButton
            isOn={showGrowth}
            onToggle={() => setShowGrowth(!showGrowth)}
          >
            生育適温表示
          </ToggleButton>
        </div>
      </div>
    </>
  );
}

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
      <span className="text-2xl font-bold" style={{ color: tempColor }}>
        {temperature}
      </span>
      <span className="inline-block w-6 text-center text-neutral-300">℃</span>
      <br />
      <span className="text-2xl font-bold" style={{ color: humColor }}>
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
  stage,
  className = "w-4 h-4",
  title,
}: {
  status: TemperatureStatus;
  stage: "germination" | "growth";
  className?: string;
  title?: string;
}) => {
  const IconComponent = stage === "germination" ? GiSeedling : GiWheat;

  return (
    <IconComponent
      className={`${getStatusColor(status)} ${className}`}
      title={title}
    />
  );
};

const IndicatorInfo = ({
  vegetable,
  growthStatus,
  germinationStatus,
}: {
  vegetable: Vegetable;
  growthStatus: TemperatureStatus;
  germinationStatus: TemperatureStatus;
}) => {
  function formatRange(range: { low: number | null; high: number | null }) {
    const low = range.low !== null ? `${range.low}℃` : "-℃";
    const high = range.high !== null ? `${range.high}℃` : "-℃";
    return `${low}~${high}`;
  }

  const growth = vegetable.temperature.growth;
  const germination = vegetable.temperature.germination;

  return (
    <div className="space-y-2">
      <div className="font-bold text-center text-base">{vegetable.name}</div>
      <div className="flex justify-center space-x-8">
        <div className="space-y-2 w-48">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GiSeedling className="text-green-400 w-4 h-4" />
              <span className="font-medium text-sm">発芽期</span>
            </div>
            <span
              className={`px-2 py-1 rounded text-xs text-white ${getStatusBgColor(germinationStatus)}`}
            >
              {getStatusText(germinationStatus)}
            </span>
          </div>
          <div className="text-xs text-gray-300 space-y-0.5">
            <div className="flex justify-between">
              <span>最適:</span>
              <span>{formatRange(germination.optimumRange)}</span>
            </div>
            <div className="flex justify-between">
              <span>限界:</span>
              <span>{formatRange(germination.limitRange)}</span>
            </div>
          </div>
        </div>
        <div className="space-y-2 w-48">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GiWheat className="text-green-500 w-4 h-4" />
              <span className="font-medium text-sm">生育期</span>
            </div>
            <span
              className={`px-2 py-1 rounded text-xs text-white ${getStatusBgColor(growthStatus)}`}
            >
              {getStatusText(growthStatus)}
            </span>
          </div>
          <div className="text-xs text-gray-300 space-y-0.5">
            <div className="flex justify-between">
              <span>最適:</span>
              <span>{formatRange(growth.optimumRange)}</span>
            </div>
            <div className="flex justify-between">
              <span>限界:</span>
              <span>{formatRange(growth.limitRange)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TemperatureIndicators = ({
  vegetables,
  currentTemperature,
  showGermination,
  showGrowth,
  onVegetableSelect,
}: {
  vegetables: Vegetable[];
  currentTemperature: number;
  showGermination: boolean;
  showGrowth: boolean;
  onVegetableSelect: (vegetable: Vegetable) => void;
}) => {
  if (vegetables.length === 0 || currentTemperature === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-3">
      <div className="w-full grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
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
            <button
              key={vegetable.id}
              type="button"
              className="flex flex-col items-center py-2 px-1 text-center bg-neutral-600 rounded cursor-pointer hover:bg-neutral-500 w-full"
              onClick={() => onVegetableSelect(vegetable)}
            >
              <div className="flex gap-1 mb-1">
                {showGermination && (
                  <StatusIcon status={germinationStatus} stage="germination" />
                )}
                {showGrowth && (
                  <StatusIcon status={growthStatus} stage="growth" />
                )}
              </div>
              <span className="w-full text-xs text-neutral-200 truncate">
                {vegetable.name}
              </span>
            </button>
          );
        })}
      </div>
      <div className="space-y-2 text-xs text-neutral-300">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-1">
            <StatusIcon status="optimal" stage="growth" />
            <span>{getStatusText("optimal")}</span>
          </div>
          <div className="flex items-center gap-1">
            <StatusIcon status="acceptable" stage="growth" />
            <span>{getStatusText("acceptable")}</span>
          </div>
          <div className="flex items-center gap-1">
            <StatusIcon status="warning" stage="growth" />
            <span>{getStatusText("warning")}</span>
          </div>
          <div className="flex items-center gap-1">
            <StatusIcon status="danger" stage="growth" />
            <span>{getStatusText("danger")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
