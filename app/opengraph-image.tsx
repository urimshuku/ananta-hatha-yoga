import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const headingFont = await readFile(
    join(process.cwd(), "assets/fonts/CormorantGaramond-SemiBold.woff"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#FAF6EE",
          backgroundImage:
            "radial-gradient(60% 55% at 50% 0%, rgba(201,168,106,0.22) 0%, rgba(201,168,106,0) 70%)",
          padding: "72px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              fontFamily: "Heading",
              fontSize: 72,
              color: "#B08D57",
              lineHeight: 1,
            }}
          >
            N
          </div>
          <div
            style={{
              fontFamily: "Heading",
              fontSize: 64,
              color: "#211C16",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            {SITE_NAME}
          </div>
          <div
            style={{
              fontFamily: "Heading",
              fontSize: 30,
              color: "#5C4F3F",
              lineHeight: 1.4,
              maxWidth: 720,
            }}
          >
            Classical Hatha Yoga in Saranda, Albania
          </div>
          <div
            style={{
              fontFamily: "Heading",
              fontSize: 24,
              color: "#8A7A66",
              fontStyle: "italic",
            }}
          >
            {SITE_TAGLINE}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Heading",
          data: headingFont,
          style: "normal",
          weight: 600,
        },
      ],
    },
  );
}
