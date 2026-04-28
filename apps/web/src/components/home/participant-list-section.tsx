import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { getFullname, ParticipantStatus, type IUserParticipant } from "@repo/shared-types"
import { ApiError } from "@/error/api"
import { apiBack } from "@/api/backend"
import { useParams } from "react-router-dom"
import { myfetch } from "@/lib/utils"
import { Avatar } from "../avatar"

async function fetchParticipants(slug: string) {
    return await myfetch<IUserParticipant[]>(
        () => apiBack.get(
            "/users/participants", {
                params: { slug }
            }
        )
    );
}

// const bgs: string[] = [
//   "#dde8f5",
//   "#ece8f5",
//   "#e8f0e0",
//   "#fdf0e8",
//   "#f5e8f0",
// ];

export function ParticipantsGrid({ participants }: { participants: IUserParticipant[] }) {
  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(118px, 1fr))" }}>
      {participants.map((participant) => (
        <div
          key={getFullname(participant)}
          className="bg-[rgba(220,210,195,0.05)] backdrop-blur-sm border border-[rgba(160,136,120,0.25)] rounded-2xl guest-card rounded-xl p-[0.9rem_0.7rem] text-center"
        >
            <div className="w-[50px] h-[50px] rounded-full mx-auto mb-2 relative overflow-hidden border-2 border-[rgba(160,136,120,0.2)]">
                <Avatar user={participant} />
            </div>


          <div className="text-[12px] font-bold text-[var(--td)] mb-[0.12rem]">
            {participant.firstName}
          </div>
          {/* <div className="text-[10px] text-[var(--tl)]">{participant.tag}</div> */}

          <span
            className={`inline-block mt-1.5 text-[10px] px-2 py-[2px] rounded-full ${
              participant.status === "confirmed"
                ? "bg-[#e0eaf8] text-[#2a4a70]"
                : "bg-[#ece8f5] text-[#5a3a90]"
            }`}
          >
            {participant.status === "confirmed" ? "Confirmado" : "Aguardando"}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ParticipantListSection() {
    const { slug = '' } = useParams<{ slug: string }>()
    const [searchTerm, setSearchTerm] = useState("")
    const [filter, setFilter] = useState<"all" | keyof typeof ParticipantStatus>("all")

    const { data: participants = [], isLoading: isLoading, isError, error } = useQuery<IUserParticipant[], ApiError>({
        queryKey: ['users/participants'],
        queryFn: () => fetchParticipants(slug)
    });
    const confirmedCount = participants.filter(p => p.status === "confirmed").length;
    const pendingCount = participants.filter(p => p.status === "pending").length;

    function Loading() {
        return <div>Loading...</div>;
    }

    function ErrorState({ error }: { error: Error }) {
        return <div style={{ color: "red" }}>{error.message}</div>;
    }

    if (isLoading) return <Loading />;
    if (isError) return <ErrorState error={error as Error} />;

    return (
        <section className="py-12 px-8 max-w-[1000px] mx-auto" id="participants">
            <div className="text-[11px] font-bold tracking-[0.1em] text-[#7a70b0] uppercase mb-1.5">
                <h3>Lista de convidados</h3>
            </div>
            <div className="text-2xl font-bold text-[var(--td)] mb-1.5">
                <h2>Quem vai aparecer?</h2>
            </div>
            <div className="text-[14px] text-[var(--tl)]">
                {confirmedCount} confirmados · {pendingCount} pendentes
            </div>
            <section className="py-4">
                <div className="max-w-6xl">
                    {/* Search and filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-xl">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar convidado..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[rgba(220,210,195,0.05)] backdrop-blur-[8px] border border-[rgba(160,136,120,0.25)] rounded-2xl px-4 py-2.5 text-[14px] text-[var(--td)] placeholder:text-[rgba(160,136,120,0.5)] outline-none focus:border-[rgba(160,136,120,0.6)] transition-colors"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                        onClick={() => setFilter("all")}
                        className={cn(
                            "px-4 py-2 rounded-full text-[12px] cursor-pointer",
                            filter === 'all'
                            ? "bg-[#2a4a70] text-white hover:bg-[#1e3858] transition-colors"
                            : "bg-[rgba(160,136,120,0.15)] text-[rgba(160,136,120,0.5)] font-bold",
                        )}
                        >
                            Todos
                        </button>
                        <button
                            onClick={() => setFilter(ParticipantStatus.confirmed)}
                            className={cn(
                                "px-4 py-2 rounded-full text-[12px] cursor-pointer",
                                filter === ParticipantStatus.confirmed
                                ? "bg-[#2a4a70] text-white hover:bg-[#1e3858] transition-colors"
                                : "bg-[rgba(160,136,120,0.15)] text-[rgba(160,136,120,0.5)] font-bold",
                            )}
                        >
                            Confirmados
                        </button>
                        <button
                            onClick={() => setFilter(ParticipantStatus.pending)}
                            className={cn(
                                "px-4 py-2 rounded-full text-[12px] cursor-pointer",
                                filter === ParticipantStatus.pending
                                ? "bg-[#2a4a70] text-white hover:bg-[#1e3858] transition-colors"
                                : "bg-[rgba(160,136,120,0.15)] text-[rgba(160,136,120,0.5)] font-bold",
                            )}
                        >
                            Pendentes
                        </button>
                    </div>
                    </div>

                    {/* Guest grid */}
                    <ParticipantsGrid participants={participants} />

                    {/* Empty state */}
                    {participants.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Nenhum convidado encontrado.</p>
                    </div>
                    )}
                </div>
            </section>
        </section>
    )
}
