/**
 * Accepts any shape a YouTube URL takes and returns the 11-character video id:
 *   youtube.com/watch?v=ID · youtu.be/ID · /embed/ID · /shorts/ID · /live/ID
 * Returns null for anything that is not a recognisable YouTube link, so the
 * caller can fall back instead of rendering a broken player.
 */
export function getYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url.trim())
    const host = parsed.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      return parsed.pathname.slice(1).split('/')[0] || null
    }

    if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      const fromQuery = parsed.searchParams.get('v')
      if (fromQuery) return fromQuery

      const [, section, id] = parsed.pathname.split('/')
      if (section && id && ['embed', 'shorts', 'live', 'v'].includes(section)) {
        return id
      }
    }

    return null
  } catch {
    // Not a URL at all (empty string, a bare id, malformed input).
    return /^[\w-]{11}$/.test(url.trim()) ? url.trim() : null
  }
}

interface YouTubeEmbedProps {
  url: string
  title?: string
  className?: string
}

/**
 * Inline player for the lesson preview. Uses youtube-nocookie.com so no
 * tracking cookie is set until the visitor actually plays the video.
 *
 * Note: this can only play videos whose privacy is **Unlisted** or Public.
 * YouTube blocks embedding of *Private* videos for everyone but the owner.
 */
export function YouTubeEmbed({
  url,
  title = 'Lesson video',
  className = '',
}: YouTubeEmbedProps) {
  const id = getYouTubeId(url)
  if (!id) return null

  return (
    <div className={`relative aspect-video w-full overflow-hidden bg-black ${className}`}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 size-full border-0"
      />
    </div>
  )
}
