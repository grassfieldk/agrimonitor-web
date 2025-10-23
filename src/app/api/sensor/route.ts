import axios from "axios";
import { NextResponse } from "next/server";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET() {
  if (!backendUrl) {
    return NextResponse.json(
      { error: "Missing environment variables" },
      { status: 500 },
    );
  }

  try {
    const response = await axios.get(`${backendUrl}/sensor`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Failed to fetch sensor data:", error);
    return NextResponse.json(
      { error: "Failed to fetch sensor data" },
      { status: 502 },
    );
  }
}
