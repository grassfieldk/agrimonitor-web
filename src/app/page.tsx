"use client";

import { useEffect, useState } from "react";
import { GiSeedling, GiWheat } from "react-icons/gi";
import { RecentPhoto } from "@/components/status/RecentPhoto";
import { StatusIcon } from "@/components/status/StatusIcon";
import { Button } from "@/components/ui/Button";
import { Footer } from "@/components/ui/Footer";
import { ToggleButton } from "@/components/ui/ToggleButton";
import {
  initialSensorData,
  initialWeatherData,
  type SensorData,
  type TemperatureCategory,
  type TemperatureStatus,
  type VegetableInfo,
  type WeatherData,
} from "@/types/types";
import {
  checkTemperatureStatus,
  getHumidityColor,
  getPrecipitationColor,
  getStatusBgColor,
  getStatusText,
  getTemperatureColor,
} from "@/utils/util";

const fetchInterval = Number(process.env.NEXT_PUBLIC_FETCH_INTERVAL);

export default function Home() {
  const [sensorData, setSensorData] = useState<SensorData>(initialSensorData);
  const [weatherData, setWeatherData] = useState<WeatherData>(initialWeatherData);
  const [vegeInfos, setVegeInfos] = useState<VegetableInfo[]>([]);
  const [showGermination, setShowGermination] = useState<boolean>(false);
  const [showGrowth, setShowGrowth] = useState<boolean>(true);
  const [selectedVege, setSelectedVege] = useState<VegetableInfo | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);

  const handleVegetableSelect = (vegetable: VegetableInfo) => {
    if (selectedVege && selectedVege.id === vegetable.id) {
      setIsPanelOpen(!isPanelOpen);
    } else {
      setSelectedVege(vegetable);
      setIsPanelOpen(true);
    }
  };

  const onToggleGermination = () => setShowGermination(!showGermination);
  const onToggleGrowth = () => setShowGrowth(!showGrowth);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        const sensorRes = await fetch("/api/sensor");
        if (!sensorRes.ok)
          throw new Error(`Failed to fetch sensor data: ${sensorRes.status}`);
        const sensorData: SensorData = await sensorRes.json();
        setSensorData(sensorData);

        const weatherRes = await fetch("/api/weather");
        if (!weatherRes.ok)
          throw new Error(`Failed to fetch weather data: ${weatherRes.status}`);
        const weatherData: WeatherData = await weatherRes.json();
        setWeatherData(weatherData);

        const vegeRes = await fetch("/api/crud?table=vegetables");
        if (!vegeRes.ok)
          throw new Error(`Failed to fetch vegetable data: ${vegeRes.status}`);
        const vegeInfos: VegetableInfo[] = await vegeRes.json();
        console.log(
          "All vegetables:",
          vegeInfos.map((v) => ({ name: v.name, enabled: v.enabled })),
        );
        const enabledVegeInfos = vegeInfos.filter((vege) => vege.enabled);
        console.log(
          "Enabled vegetables:",
          enabledVegeInfos.map((v) => ({ name: v.name, enabled: v.enabled })),
        );
        setVegeInfos(enabledVegeInfos);
      } catch (error) {
        console.error("Error fetching data:", error);
        clearInterval(timer);
      }
    };

    fetchData();
    timer = setInterval(fetchData, fetchInterval);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isPanelOpen) {
        setIsPanelOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isPanelOpen]);

  return (
    <>
      <div className="flex flex-col justify-center items-center p-4 space-y-4 bg-background-nd rounded-lg shadow">
        <div className="flex flex-row justify-around space-x-2 w-full max-w-sm">
          <SensorDataDisplay sensorData={sensorData} />
          <WeatherDataDisplay weatherData={weatherData} />
        </div>
        <VegetableStatusList
          vegeInfos={vegeInfos}
          currentTemperature={Number(sensorData.temperature) || 0}
          showGermination={showGermination}
          showGrowth={showGrowth}
          onVegetableSelect={handleVegetableSelect}
        />
        <div className="w-full">
          <RecentPhoto />
          <p className="mt-2 text-center text-xs text-dark-sub">{`※ 画像は ${fetchInterval / 1000} 秒間隔で更新されます`}</p>
        </div>
      </div>

      <SelectedVegetablePanel
        selectedVege={selectedVege}
        sensorData={sensorData}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />

      <Footer>
        <ToggleButton isOn={showGermination} onToggle={onToggleGermination}>
          発芽適温表示
        </ToggleButton>
        <ToggleButton isOn={showGrowth} onToggle={onToggleGrowth}>
          生育適温表示
        </ToggleButton>
      </Footer>
    </>
  );
}

const SensorDataDisplay = ({ sensorData }: { sensorData: SensorData }) => {
  const temperature = sensorData.temperature;
  const humidity = sensorData.humidity;

  const tempColor = getTemperatureColor(Number(temperature) || 0);
  const humColor = getHumidityColor(Number(humidity) || 0);

  return (
    <div className="w-full space-y-2 text-center">
      <p>気温/湿度</p>
      <p className="text-shadow-sm">
        <span className="text-2xl font-bold" style={{ color: tempColor }}>
          {temperature}
        </span>
        <span className="inline-block w-6 text-center text-xl">℃</span>
        <br />
        <span className="text-2xl font-bold" style={{ color: humColor }}>
          {humidity}
        </span>
        <span className="inline-block w-6 text-center text-xl">%</span>
      </p>
    </div>
  );
};

const WeatherDataDisplay = ({ weatherData }: { weatherData: WeatherData }) => {
  if (!weatherData) return null;

  const prefecture = weatherData.prefecture;
  const location = weatherData.location;
  const precipitation = weatherData.precipitation;
  const color = getPrecipitationColor(precipitation);

  return (
    <div className="w-full space-y-2 text-center">
      <p>1時間降水量</p>
      <p className="text-shadow-sm">
        <span className="text-2xl font-bold" style={{ color: color }}>
          {precipitation}
        </span>
        <span className="inline-block w-10 text-center text-xl">mm</span>
      </p>
      <p>
        <span className="text-sm text-dark-sub">
          {prefecture} {location}
        </span>
      </p>
    </div>
  );
};

const VegetableStatusList = ({
  vegeInfos,
  currentTemperature,
  showGermination,
  showGrowth,
  onVegetableSelect,
}: {
  vegeInfos: VegetableInfo[];
  currentTemperature: number;
  showGermination: boolean;
  showGrowth: boolean;
  onVegetableSelect: (vegetable: VegetableInfo) => void;
}) => {
  const statusList: TemperatureStatus[] = [
    "optimal",
    "acceptable",
    "warning",
    "danger",
  ];

  return (
    <div className="w-full space-y-3">
      <div className="w-full grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-1">
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
              className="flex flex-col items-center w-full py-2 px-1 bg-primary rounded shadow text-light hover:bg-primary-hover"
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
              <span className="w-full text-xs text-nowrap text-clip overflow-hidden">
                {vegetable.name}
              </span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-4 py-1 bg-primary rounded-full text-light">
        {statusList.map((status) => (
          <div key={status} className="flex items-center gap-1">
            <StatusIcon status={status} stage="growth" />
            <span className="text-sm">{getStatusText(status)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SelectedVegetablePanel = ({
  selectedVege,
  sensorData,
  isOpen,
  onClose,
}: {
  selectedVege: VegetableInfo | null;
  sensorData: SensorData;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!selectedVege) return null;

  function formatRange(range: { low: number | null; high: number | null }) {
    const low = range.low !== null ? `${range.low}℃` : "－℃";
    const high = range.high !== null ? `${range.high}℃` : "－℃";
    return `${low} ～ ${high}`;
  }

  const growth = selectedVege.temperature.growth;
  const germination = selectedVege.temperature.germination;
  const growthStatus = checkTemperatureStatus(
    Number(sensorData.temperature) || 0,
    selectedVege,
    "growth",
  );
  const germinationStatus = checkTemperatureStatus(
    Number(sensorData.temperature) || 0,
    selectedVege,
    "germination",
  );

  const Status = ({ category }: { category: TemperatureCategory }) => {
    const isGrowth = category === "growth";
    const bgColor = getStatusBgColor(
      isGrowth ? germinationStatus : growthStatus,
    );
    return (
      <div className="space-y-2 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isGrowth ? <GiSeedling size={16} /> : <GiWheat size={16} />}
            <span className="font-medium text-sm">
              {isGrowth ? "発芽期" : "生育期"}
            </span>
          </div>
          <span className={`px-2 py-1 rounded text-xs text-white ${bgColor}`}>
            {getStatusText(germinationStatus)}
          </span>
        </div>
        <div className="text-xs space-y-1">
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
    <div
      className={`fixed bottom-16 left-0 right-0 bg-foreground-nd border-t border-foreground-th p-4 text-light transform transition-transform duration-100 ${
        isOpen ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="container max-w-screen-xl mx-auto px-4 space-y-4">
        <div className="space-y-4 text-center">
          <div className="font-bold text-lg">{selectedVege.name}</div>
          <div className="flex justify-center space-x-8 max-w-sm mx-auto">
            <Status category="growth" />
            <Status category="germination" />
          </div>
        </div>
        <Button
          onClick={onClose}
          variant="secondary"
          icon="close"
          className="w-full"
        >
          閉じる
        </Button>
      </div>
    </div>
  );
};
