interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  className?: string;
}

export function YouTubeEmbed({ videoId, title = "YouTube video", className }: YouTubeEmbedProps) {
  return (
    <div
      className={[
        "aspect-video overflow-hidden rounded-xl border border-border bg-charcoal shadow-soft",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}
