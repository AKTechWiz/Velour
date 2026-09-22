#!/usr/bin/env node
// Prepare the hero background video + poster frame.
//
// 1. Drop any video file (mp4 / mov / webm / mkv / …) into:  incoming/videos/
// 2. Run:  node scripts/prepare-hero-video.mjs
//
// When ffmpeg is available it transcodes the source to a 1080p H.264 MP4
// (no audio, faststart) at public/videos/hero.mp4 and extracts a poster
// frame at public/images/hero-poster.jpg.
// If ffmpeg is missing the source is copied as-is with a warning.
import { readdirSync, existsSync, mkdirSync, copyFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const inDir = path.join(root, "incoming", "videos");
const outDir = path.join(root, "public", "videos");
const outVideo = path.join(outDir, "hero.mp4");
const outPoster = path.join(root, "public", "images", "hero-poster.jpg");

const VIDEO_EXT = ["mp4", "mov", "webm", "mkv", "m4v", "avi", "mpeg", "mpg"];

function findSource() {
  if (!existsSync(inDir)) return null;
  const files = readdirSync(inDir).filter((f) =>
    VIDEO_EXT.includes(path.extname(f).toLowerCase().slice(1))
  );
  return files.length ? path.join(inDir, files[0]) : null;
}

function ffmpegAvailable() {
  try {
    execFileSync("ffmpeg", ["-version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function main() {
  const source = findSource();
  if (!source) {
    console.log("No video found in incoming/videos/. Add one there and re-run.");
    return;
  }

  mkdirSync(outDir, { recursive: true });
  mkdirSync(path.dirname(outPoster), { recursive: true });

  if (!ffmpegAvailable()) {
    copyFileSync(source, outVideo);
    console.log("warn: ffmpeg not found — copied video as-is to public/videos/hero.mp4.");
    console.log("      Install ffmpeg and re-run to transcode to 1080p and generate the poster frame.");
    return;
  }

  console.log("Transcoding hero video to 1080p H.264 (no audio, faststart)…");
  execFileSync(
    "ffmpeg",
    [
      "-y",
      "-i", source,
      "-vf", "scale='min(1920,iw)':-2",
      "-c:v", "libx264",
      "-preset", "medium",
      "-crf", "23",
      "-movflags", "+faststart",
      "-an",
      outVideo,
    ],
    { stdio: "inherit" }
  );

  console.log("Extracting poster frame…");
  execFileSync(
    "ffmpeg",
    [
      "-y",
      "-i", source,
      "-frames:v", "1",
      "-vf", "scale='min(1920,iw)':-2",
      "-q:v", "2",
      outPoster,
    ],
    { stdio: "inherit" }
  );

  console.log("Done: public/videos/hero.mp4 + public/images/hero-poster.jpg");
}

main();