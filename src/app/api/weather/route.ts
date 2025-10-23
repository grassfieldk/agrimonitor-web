import iconv from "iconv-lite";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const locationNumber = process.env.JMA_LOCATION_NUMBER;
    if (!locationNumber) {
      return NextResponse.json(
        { error: "JMA_LOCATION_NUMBER not set" },
        { status: 500 },
      );
    }

    const response = await fetch(
      "https://www.data.jma.go.jp/stats/data/mdrr/pre_rct/alltable/pre1h00_rct.csv",
      { next: { revalidate: 3600 } },
    );
    if (!response.ok) {
      throw new Error("Failed to fetch CSV");
    }
    const csvText = iconv.decode(
      Buffer.from(await response.arrayBuffer()),
      "Shift_JIS",
    );
    const lines = csvText.split("\n");
    const headers = lines[0].split(",");
    const data = lines.slice(1).map((line) => {
      const values = line.split(",");
      const obj: Record<string, string> = {};
      headers.forEach((header, index) => {
        obj[header] = values[index];
      });
      return obj;
    });

    const key = "観測所番号";
    const filteredData = data.filter((obj) => obj[key] === locationNumber);

    if (filteredData.length === 0) {
      return NextResponse.json({ error: "No data found" }, { status: 404 });
    }

    const obj = filteredData[0];
    const transformed = {
      locationNumber: obj["観測所番号"],
      dateTime: `${obj["現在時刻(年)"]}${obj["現在時刻(月)"].padStart(2, "0")}${obj["現在時刻(日)"].padStart(2, "0")}${obj["現在時刻(時)"].padStart(2, "0")}`,
      prefecture: obj["都道府県"],
      location: obj["地点"],
      precipitation: parseFloat(obj["現在値(mm)"]) || 0,
      maxPrecipitationToday: parseFloat(obj["23日の最大値(mm)"]) || 0,
      recordPrecipitation:
        parseFloat(obj["22日までの観測史上1位の値(mm)"]) || 0,
      octoberRecord: parseFloat(obj["22日までの10月の1位の値(mm)"]) || 0,
    };

    return NextResponse.json(transformed);
  } catch (_error) {
    console.error("Failed to fetch weather data:", _error);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 },
    );
  }
}
