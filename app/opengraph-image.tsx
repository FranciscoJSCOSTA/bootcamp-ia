import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#eef2ff",
          backgroundImage: "linear-gradient(to bottom, #e0e7ff, #ffffff)",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            color: "#0f172a",
          }}
        >
          Aval
          <span style={{ color: "#4f46e5" }}>IA</span>
          <span style={{ marginLeft: 20, color: "#4f46e5" }}>Discursiva</span>
        </div>
        <div
          style={{
            marginTop: 48,
            display: "flex",
            fontSize: 42,
            fontWeight: 600,
            color: "#334155",
            textAlign: "center",
            maxWidth: 960,
          }}
        >
          Sua redação pode estar perdendo pontos que você nem percebe
        </div>
      </div>
    ),
    { ...size },
  );
}
