import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
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
          backgroundColor: "#C9A86A",
          borderRadius: 6,
        }}
      >
        <div
          style={{
            fontFamily: "Heading",
            fontSize: 22,
            color: "#FAF6EE",
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
