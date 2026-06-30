import { access, copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fallbackContent } from "../src/lib/fallback-data";

const distDir = path.resolve(import.meta.dirname, "../dist/public");
const appShell = path.join(distDir, "index.html");
const studioShell = path.join(distDir, "studio/index.html");

async function copyShell(target: string, source = appShell) {
  await mkdir(path.dirname(target), { recursive: true });
  await copyFile(source, target);
}

async function exists(file: string) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

await copyShell(path.join(distDir, "404.html"));

if (await exists(studioShell)) {
  await copyShell(path.join(distDir, "studio/404.html"), studioShell);
}

for (const project of fallbackContent.projects) {
  await copyShell(path.join(distDir, "work", project.id, "index.html"));
}
