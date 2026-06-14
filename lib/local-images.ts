import fs from "node:fs";
import path from "node:path";

const EXTENSIONS = ["avif", "webp", "jpg", "jpeg", "png"] as const;

/**
 * Resolve a local image under /public/images when the file exists on disk.
 * Returns the public URL path (e.g. /images/programs/surya-kriya.jpg).
 */
export function resolveLocalImageSrc(
  subpath: string[],
  basename: string,
): string | null {
  const dir = path.join(process.cwd(), "public", "images", ...subpath);

  for (const ext of EXTENSIONS) {
    const filePath = path.join(dir, `${basename}.${ext}`);
    if (fs.existsSync(filePath)) {
      const urlPath = ["images", ...subpath, `${basename}.${ext}`]
        .filter(Boolean)
        .join("/");
      return `/${urlPath}`;
    }
  }

  return null;
}

export function programImageSrc(slug: string): string | null {
  return resolveLocalImageSrc(["programs"], slug);
}

export function programSymbolSrc(slug: string): string | null {
  return resolveLocalImageSrc(["programs"], `${slug}-symbol`);
}

export function footerCertificationLogoSrc(): string | null {
  return resolveLocalImageSrc([], "certified-teacher-logo");
}
