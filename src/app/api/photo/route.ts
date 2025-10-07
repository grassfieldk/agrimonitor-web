import axios from "axios";

const protocol = process.env.PROTOCOL;
const hostname = process.env.RASPI_HOSTNAME;
const port = process.env.RASPI_PORT;

export async function GET() {
  if (!protocol || !hostname || !port) {
    return new Response("Missing environment variables", { status: 500 });
  }

  const url = `${protocol}://${hostname}:${port}/photo`;
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");
    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return new Response(error.message, { status: 502 });
    }
    return new Response("Unknown error", { status: 502 });
  }
}
