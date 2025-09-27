import axios from "axios";
import { NextResponse } from "next/server";

const protocol = process.env.PROTOCOL;
const hostname = process.env.RASPI_HOSTNAME;
const port = process.env.RASPI_PORT;

export async function GET() {
  if (!protocol || !hostname || !port) {
    return NextResponse.json(
      { error: "Missing environment variables" },
      { status: 500 },
    );
  }

  const url = `${protocol}://${hostname}:${port}/sensor`;
  try {
    const response = await axios.get(url);
    return NextResponse.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 502 });
  }
}
