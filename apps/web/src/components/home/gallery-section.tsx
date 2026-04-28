import { useState, useRef } from "react"
import { X, Play } from "lucide-react"
import type { IMeeting, IPicture } from "@repo/shared-types";
import { ApiError } from "@/error/api";
import { useQuery } from "@tanstack/react-query";
import { apiBack } from "@/api/backend";
import { useParams } from "react-router-dom";
import { myfetch } from "@/lib/utils";
import { Spinner } from "../ui/spinner";


function VideoThumbnail({ src, onClick }: { src: string; onClick: () => void }) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isHovering, setIsHovering] = useState(false)

    return (
        <div
        className="relative w-full h-full cursor-pointer group"
        onMouseEnter={() => {
            setIsHovering(true)
            videoRef.current?.play()
        }}
        onMouseLeave={() => {
            setIsHovering(false)
            videoRef.current?.pause()
            if (videoRef.current) videoRef.current.currentTime = 0
        }}
        onClick={onClick}
        >
        <video ref={videoRef} src={src} className="w-full h-full object-cover" muted loop playsInline poster={src} />
        {/* Play icon overlay */}
        <div
            className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 ${isHovering ? "opacity-0" : "opacity-100"}`}
        >
            <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
            <Play className="w-5 h-5 text-primary-foreground ml-1" fill="currentColor" />
            </div>
        </div>
        {/* Video badge */}
        <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/60 text-xs font-medium">Vídeo</div>
        </div>
    )
}

async function fetchMeeting(slug: string) {
    return await myfetch<IMeeting>(
        () => apiBack.get(
            "/meetings/by-slug", {
                params: { slug }
            }
        )
    );
}

export function GallerySection() {
    const { slug = '' } = useParams<{ slug: string }>()
    const [selectedMedia, setSelectedMedia] = useState<IPicture | null>(null)

    const { data: meeting, isLoading: isLoading, isError, error } = useQuery<IMeeting, ApiError>({
        queryKey: ['meeting-name'],
        queryFn: () => fetchMeeting(slug),
        retry: false
    });

    function Loading() {
        return <Spinner></Spinner>;
    }

    function ErrorState({ error: _error }: { error: Error }) {
        return (
            <div style={{ color: 'red', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p>Erro ao carregar componente</p>
            </div>
        );
    }

    if (isLoading) return <Loading />;
    if (isError) return <ErrorState error={error as Error} />;

    const colSpanMap: Record<number, string> = {
        1: 'col-span-1',
        2: 'col-span-2',
        3: 'col-span-3',
        4: 'col-span-4',
    };

    const rowSpanMap: Record<number, string> = {
        1: 'row-span-1',
        2: 'row-span-2',
        3: 'row-span-3',
        4: 'row-span-4',
    };

    return (
        <section id="galeria" className="relative z-10 py-12 px-8 max-w-[1000px] mx-auto">
            <div className="text-2xl font-bold text-[var(--td)] mb-1.5">
                <h2>Nossa galeria</h2>
            </div>
        <div className="py-6 mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
            {meeting?.gallery.map((item, index) => (
                <div key={index} className={`${colSpanMap[item.w]} ${rowSpanMap[item.h]} relative rounded-xl overflow-hidden group`}>
                {item.type === "video" ? (
                    <VideoThumbnail src={item.url} onClick={() => setSelectedMedia(item)} />
                ) : (
                    <div className="w-full h-full cursor-pointer" onClick={() => setSelectedMedia(item)}>
                    <img
                        src={item.url || "/placeholder.svg"}
                        alt={`Galeria ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                )}

                {/* Anime-style corner decoration */}
                <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
            ))}
            </div>
        </div>

        {/* Lightbox */}
        {selectedMedia && (
            <div
            className="fixed inset-0 z-50 bg-background/90 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedMedia(null)}
            >
            <button
                className="absolute top-4 right-4 p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                onClick={() => setSelectedMedia(null)}
            >
                <X className="w-6 h-6" />
            </button>
            {selectedMedia.type === "video" ? (
                <video
                src={selectedMedia.url}
                className="max-w-full max-h-[90vh] rounded-xl"
                controls
                autoPlay
                onClick={(e) => e.stopPropagation()}
                />
            ) : (
                <img
                src={selectedMedia.url || "/placeholder.svg"}
                alt="Imagem ampliada"
                className="max-w-full max-h-[90vh] rounded-xl object-contain"
                />
            )}
            </div>
        )}
        </section>
    )
}
