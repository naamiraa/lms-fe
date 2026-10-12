"use client";
import { useState } from "react";
import type { LearningContent } from "@/types/learning";

export function resolveLearningMedia(value: string | null) {
  if (!value?.trim()) return null;
  const raw = value.trim();
  if (/^(javascript|data|vbscript):/i.test(raw) || raw.startsWith("//"))
    return null;
  let url: URL;
  try {
    url = new URL(raw, "https://local.invalid/");
  } catch {
    return null;
  }
  if (!["https:", "http:"].includes(url.protocol)) return null;
  let src =
    url.origin === "https://local.invalid"
      ? `${url.pathname}${url.search}${url.hash}`
      : url.href;
  const host = url.hostname.toLowerCase();
  const youtube = [
    "youtube.com",
    "www.youtube.com",
    "m.youtube.com",
    "youtube-nocookie.com",
    "www.youtube-nocookie.com",
  ].includes(host);
  const videoId =
    host === "youtu.be"
      ? url.pathname.split("/")[1]
      : youtube
        ? url.searchParams.get("v") ||
          url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1]
        : null;
  if (videoId && /^[\w-]{11}$/.test(videoId))
    return {
      src: `https://www.youtube-nocookie.com/embed/${videoId}`,
      embed: true,
    };
  if (["vimeo.com", "www.vimeo.com", "player.vimeo.com"].includes(host)) {
    const id = url.pathname.match(/\/(?:video\/)?(\d+)(?:\/|$)/)?.[1];
    if (id)
      return {
        src: `https://player.vimeo.com/video/${id}${url.search}`,
        embed: true,
      };
  }
  if (host === "drive.google.com") {
    const id = url.pathname.match(/\/file\/d\/([\w-]+)/)?.[1];
    if (id)
      return {
        src: `https://drive.google.com/file/d/${id}/preview`,
        embed: true,
      };
  }
  return { src, embed: false };
}

export default function LearningMedia({
  content,
}: {
  content: LearningContent;
}) {
  const media = resolveLearningMedia(content.contentUrl);
  const [failed, setFailed] = useState(false);
  const kind = content.contentType.toUpperCase();

  if (!media || failed)
    return (
      <div className="flex aspect-video items-center justify-center rounded-2xl bg-[#071c2c] p-7 text-center text-white">
        <div className="max-w-md">
          <span
            className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-2xl"
            aria-hidden="true"
          >
            ▶
          </span>
          <h2 className="text-lg font-semibold">
            {failed
              ? "Video could not be loaded"
              : "Material is not available yet"}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {failed
              ? "The video link may be unavailable or the file format may not be supported. Contact your administrator to update this material."
              : "Your administrator needs to add a valid video or document link. You can read the material description below."}
          </p>
          {media && (
            <a
              href={media.src}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#006CB8]"
            >
              Check original resource ↗
            </a>
          )}
        </div>
      </div>
    );
  if (media.embed)
    return (
      <iframe
        title={content.title}
        src={media.src}
        className="aspect-video w-full rounded-2xl border-0 bg-[#071c2c]"
        allow="fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  if (kind === "VIDEO")
    return (
      <video
        key={media.src}
        src={media.src}
        controls
        playsInline
        preload="metadata"
        onError={() => setFailed(true)}
        className="aspect-video w-full rounded-2xl bg-[#071c2c]"
      >
        Your browser does not support video playback.
      </video>
    );
  if (kind === "PDF")
    return (
      <div className="space-y-3">
        <iframe
          src={media.src}
          title={content.title}
          className="h-[550px] w-full rounded-2xl border border-slate-200 bg-white"
        />
        <a
          href={media.src}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-[#006CB8]"
        >
          Open document ↗
        </a>
      </div>
    );
  return (
    <div className="rounded-2xl bg-blue-50 p-6">
      <p className="mb-4 text-sm text-slate-600">
        Read the description below and open the supporting resource.
      </p>
      <a
        href={media.src}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-[#006CB8]"
      >
        Open learning resource ↗
      </a>
    </div>
  );
}
