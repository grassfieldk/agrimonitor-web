"use client";

import { useEffect, useState } from "react";
import { GiSeedling, GiWheat } from "react-icons/gi";
import { RecentPhoto } from "@/components/status/RecentPhoto";
import { StatusIcon } from "@/components/status/StatusIcon";
import { ToggleButton } from "@/components/ui/ToggleButton";
import {
  initialSensorData,
  type SensorData,
  type TemperatureCategory,
  type TemperatureStatus,
  type VegetableInfo,
} from "@/types/types";
import {
  checkTemperatureStatus,
  getStatusBgColor,
  getStatusText,
} from "@/utils/util";

const fetchInterval = Number(process.env.NEXT_PUBLIC_FETCH_INTERVAL);

const FOOTER_HEIGHT = "bottom-16";

export default function Home() {
  const [sensorData, setSensorData] = useState<SensorData>(initialSensorData);
  const [vegeInfos, setVegeInfos] = useState<VegetableInfo[]>([]);
  const [showGermination, setShowGermination] = useState<boolean>(false);
  const [showGrowth, setShowGrowth] = useState<boolean>(true);
  const [selectedVege, setSelectedVege] = useState<VegetableInfo | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const fetchData = async () => {
      const sensorRes = await fetch("/api/sensor");
      const sensorData: SensorData = await sensorRes.json();
      setSensorData(sensorData);

      const vegeRes = await fetch("/api/data");
      const vegeInfos: VegetableInfo[] = (await vegeRes.json()).vegetables;
      setVegeInfos(vegeInfos);
    };

    fetchData();
    timer = setInterval(fetchData, fetchInterval);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && selectedVege) {
        setSelectedVege(null);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedVege]);

  return (
    <>
      <EnvironmentInfo
        sendorData={sensorData}
        vegeInfos={vegeInfos}
        showGermination={showGermination}
        showGrowth={showGrowth}
        onVegetableSelect={setSelectedVege}
      />

      {selectedVege && (
        <div
          className={`fixed ${FOOTER_HEIGHT} left-0 right-0 bg-neutral-800 p-4`}
        >
          <div className="container max-w-screen-xl mx-auto">
            <VegetableStatus
              vegetable={selectedVege}
              growthStatus={checkTemperatureStatus(
                Number(sensorData.temperature) || 0,
                selectedVege,
                "growth",
              )}
              germinationStatus={checkTemperatureStatus(
                Number(sensorData.temperature) || 0,
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

const EnvironmentInfo = ({
  sendorData,
  vegeInfos,
  showGermination,
  showGrowth,
  onVegetableSelect,
}: {
  sendorData: SensorData;
  vegeInfos: VegetableInfo[];
  showGermination: boolean;
  showGrowth: boolean;
  onVegetableSelect: (vegetable: VegetableInfo) => void;
}) => {
  const temperature = sendorData.temperature;
  const humidity = sendorData.humidity;
  const currentTemperature = Number(sendorData.temperature) || 0;
  const statusList: TemperatureStatus[] = [
    "optimal",
    "acceptable",
    "warning",
    "danger",
  ];

  if (vegeInfos.length === 0 || currentTemperature === 0) {
    return null;
  }

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
    <div className="flex flex-col justify-center items-center p-4 space-y-2 bg-neutral-800 rounded-lg shadow">
      <div className="flex flex-row flex-wrap justify-between items-center w-full max-w-64 mx-auto mb-2">
        <div>
          <span className="text-xs text-neutral-300">更新日時</span>
          <br />
          {sendorData.datetime}
        </div>

        <div>
          <span className="text-2xl font-bold" style={{ color: tempColor }}>
            {temperature}
          </span>
          <span className="inline-block w-6 text-center text-neutral-300">
            ℃
          </span>
          <br />
          <span className="text-2xl font-bold" style={{ color: humColor }}>
            {humidity}
          </span>
          <span className="inline-block w-6 text-center text-neutral-300">
            %
          </span>
        </div>
      </div>
      <div className="w-full space-y-3">
        <div className="w-full grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
          {vegeInfos.map((vegetable) => {
            const growStatus = checkTemperatureStatus(
              currentTemperature,
              vegetable,
              "growth",
            );
            const germStatus = checkTemperatureStatus(
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
                    <StatusIcon status={germStatus} stage="germination" />
                  )}
                  {showGrowth && (
                    <StatusIcon status={growStatus} stage="growth" />
                  )}
                </div>
                <span className="w-full text-xs text-neutral-200 truncate">
                  {vegetable.name}
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-4 text-xs text-neutral-300">
          {statusList.map((status) => (
            <div key={status} className="flex items-center gap-1">
              <StatusIcon status={status} stage="growth" />
              <span>{getStatusText(status)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full">
        <RecentPhoto />
      </div>
    </div>
  );
};

interface IndicatorInfoProps {
  vegetable: VegetableInfo;
  growthStatus: TemperatureStatus;
  germinationStatus: TemperatureStatus;
}

export const VegetableStatus = ({
  vegetable,
  growthStatus,
  germinationStatus,
}: IndicatorInfoProps) => {
  function formatRange(range: { low: number | null; high: number | null }) {
    const low = range.low !== null ? `${range.low}℃` : "－℃";
    const high = range.high !== null ? `${range.high}℃` : "－℃";
    return `${low} ～ ${high}`;
  }

  const growth = vegetable.temperature.growth;
  const germination = vegetable.temperature.germination;

  const Status = ({ category }: { category: TemperatureCategory }) => {
    const isGrowth = category === "growth";
    const bgColor = getStatusBgColor(
      isGrowth ? germinationStatus : growthStatus,
    );
    return (
      <div className="space-y-2 w-48">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isGrowth ? (
              <GiSeedling className="text-green-400 w-4 h-4" />
            ) : (
              <GiWheat className="text-green-500 w-4 h-4" />
            )}
            <span className="font-medium text-sm">
              {isGrowth ? "発芽期" : "生育期"}
            </span>
          </div>
          <span className={`px-2 py-1 rounded text-xs text-white ${bgColor}`}>
            {getStatusText(germinationStatus)}
          </span>
        </div>
        <div className="text-xs text-gray-300 space-y-0.5">
          <div className="flex justify-between">
            <span>最適:</span>
            <span>
              {formatRange(
                isGrowth ? growth.optimumRange : germination.optimumRange,
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span>限界:</span>
            <span>
              {formatRange(
                isGrowth ? growth.limitRange : germination.limitRange,
              )}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="font-bold text-center text-base">{vegetable.name}</div>
      <div className="flex justify-center space-x-8">
        <Status category="growth" />
        <Status category="germination" />
      </div>
    </div>
  );
};
