import fs from "node:fs";
import path from "node:path";
import axios from "axios";
import { NextResponse } from "next/server";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

async function getDefaultData() {
  const defaultDataPath = path.join(process.cwd(), "data", "default.json");
  const data = fs.readFileSync(defaultDataPath, "utf8");
  return JSON.parse(data);
}

async function initializeBackend() {
  if (!backendUrl) return;

  const defaultData = await getDefaultData();

  for (const vegetable of defaultData.vegetables) {
    await axios.post(`${backendUrl}/vegetables`, vegetable);
  }
}

export async function GET() {
  if (!backendUrl) {
    const defaultData = await getDefaultData();
    return NextResponse.json(defaultData);
  }

  try {
    const response = await axios.get(`${backendUrl}/data`);
    if (response.data?.vegetables?.length > 0) {
      return NextResponse.json(response.data);
    }

    // No data found, initialize backend
    await initializeBackend();
    const retryResponse = await axios.get(`${backendUrl}/data`);
    return NextResponse.json(retryResponse.data);
  } catch {
    const defaultData = await getDefaultData();
    return NextResponse.json(defaultData);
  }
}
