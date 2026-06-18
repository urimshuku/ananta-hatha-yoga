import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const headingFont = await readFile(
    join(process.cwd(), "assets/fonts/CormorantGaramond-SemiBold.woff"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#FAF6EE",
        }}
      >
        <div
          style={{
            fontFamily: "Heading",
            fontSize: 96,
            color: "#B08D57",
            lineHeight: 1,
          }}
        >
          N
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
