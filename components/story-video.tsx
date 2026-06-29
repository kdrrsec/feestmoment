import { cn } from "@/lib/utils"

type StoryVideoProps = {
  src: string
  title?: string
  className?: string
}

export function StoryVideo({ src, title = "Video", className }: StoryVideoProps) {
  return (
    <div
      className={cn(
        "relative mx-auto aspect-[9/16] w-full max-w-[320px] overflow-hidden rounded-xl border border-[#E5E5E5] bg-white shadow-sm",
        className
      )}
    >
      <video
        src={src}
        title={title}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  )
}
