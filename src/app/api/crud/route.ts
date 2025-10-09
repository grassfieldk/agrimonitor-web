import axios from "axios";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const baseUrl = `${backendUrl}/data`;
const responseNoBackendUrl = NextResponse.json(
  { error: "Backend URL is not configured" },
  { status: 500 },
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const table = searchParams.get("table") || "data";

  if (!backendUrl) return responseNoBackendUrl;

  try {
    const response = await axios.get(`${baseUrl}/${table}`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Failed to fetch ${table}:`, error);
    return NextResponse.json(
      { error: `Failed to fetch ${table} data` },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const table = searchParams.get("table");

  if (!table) {
    return NextResponse.json({ error: "Table is required" }, { status: 400 });
  }

  if (!backendUrl) return responseNoBackendUrl;

  try {
    const body = await request.json();
    const response = await axios.post(`${baseUrl}/${table}`, body);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Failed to create ${table} item:`, error);
    return NextResponse.json(
      { error: `Failed to create ${table} item` },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const table = searchParams.get("table");
  const id = searchParams.get("id");

  if (!table || !id) {
    return NextResponse.json(
      { error: "Table and id parameters are required" },
      { status: 400 },
    );
  }

  if (!backendUrl) return responseNoBackendUrl;

  try {
    const body = await request.json();
    const response = await axios.put(`${baseUrl}/${table}/${id}`, body);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Failed to update ${table} item:`, error);
    return NextResponse.json(
      { error: `Failed to update ${table} item` },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const table = searchParams.get("table");
  const id = searchParams.get("id");

  if (!table || !id) {
    return NextResponse.json(
      { error: "Table and id parameters are required" },
      { status: 400 },
    );
  }

  if (!backendUrl) return responseNoBackendUrl;

  try {
    await axios.delete(`${baseUrl}/${table}/${id}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Failed to delete ${table} item:`, error);
    return NextResponse.json(
      { error: `Failed to delete ${table} item` },
      { status: 500 },
    );
  }
}
