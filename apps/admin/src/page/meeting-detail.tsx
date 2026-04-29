import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MeetingGallery } from "@/components/meeting-gallery"
import { MeetingParticipants } from "@/components/meeting-participants"
import type { IMeeting, IParticipant, IUser, IUserParticipant, Pagination, ParticipantStatus } from "@repo/shared-types"
import { apiBack } from "@/api/backend"
import { ApiError } from "@/error/api"
import { useQueries } from "@tanstack/react-query"
import { useReset } from "@/hooks/use-reset"
import { checkErrorByField } from "@/utils/check_error_by_field"
import { mytoast } from "@/components/toast"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { myfetch } from "@/utils/utils"

export function SwitchDemo({ isActive, handleIsActiveChange }: { isActive: boolean, handleIsActiveChange: (checked: boolean) => void }) {
  return (
    <div className="flex items-center space-x-2">
        <Switch
            id="airplane-mode"
            checked={isActive}       // controlled value
            onCheckedChange={handleIsActiveChange} // event handler
        />
        <Label htmlFor="airplane-mode">Activate</Label>
    </div>
  )
};

async function fetchUsersList() {
    return await myfetch<{ data: IUser[], pagination: Pagination }>(
        () => apiBack.get(
            "/users/list", {
                params: {
                    isPagination: false
                }
            }
            
        )
    );
}

async function fetchUserParticipants(meetingId?: string) {
    return await myfetch<IUserParticipant[]>(
        () => apiBack.get(
            "/users/participants", {
                params: {
                    meetingId,
                    isPagination: false
                }
            }
        )
    );
}

async function fetchMeetingById(meetingId?: string) {
    return await myfetch<IMeeting>(
        () => apiBack.get(
            "/meetings/by-id", {
                params: { _id: meetingId }
            }
        )
    );
}

export default function MeetingDetail() {
    const { meetingId = '' } = useParams<{ meetingId: string }>()
    const resetMeeting = useReset<IMeeting>('meetings/by-id', (oldData: IMeeting | undefined) =>
        {
            if (!oldData) return {} as IMeeting;
            return {
                ...oldData
            };
        }
    );
    const results = useQueries({
        queries: [
            {
                queryKey: ['meetings/by-id'],
                queryFn: () => fetchMeetingById(meetingId)
            },
            {
                queryKey: ['users/list'],
                queryFn: () => fetchUsersList(),
                placeholderData: { data: [], pagination: {} as Pagination }
            },
            {
                queryKey: ['users/participants'],
                queryFn: () => fetchUserParticipants(meetingId)
            },
        ],
    });
    
    const navigate = useNavigate()
    
    const isLoading = results.some(q => q.isLoading)
    const isError = results.some(q => q.isError)
    const firstError = results.find(q => q.isError)?.error
    const meeting = results[0].data;
    const data = results[1].data;
    const users = data?.data ?? [];
    const participantsQuery = results[2];
    const participants = participantsQuery.data ?? [];
    const refetchParticipants = participantsQuery.refetch;

    if (!meeting) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <p className="text-lg font-medium text-foreground">
                Meeting nao encontrado
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                Este meeting pode ter sido removido.
                </p>
                <Button variant="outline" className="mt-4" asChild>
                <a href="/meetings">Voltar para Meetings</a>
                </Button>
            </div>
        )
    }

    async function updateMeeting(data: IMeeting) {
        try {
            const res = await apiBack.put(
                "/meetings/edit", data, {
                    params: { _id: data._id }
                }
            );

            if (res.data.isError) {
                throw new ApiError(res.data.message);
            }

            mytoast.success("Meeting editado com sucesso!");
        } catch (error: unknown) {
            if (checkErrorByField(error, 'message')) {
                mytoast.error(error.message);
                return;
            }
            throw error;
        }
        resetMeeting();
        refetchParticipants();
    };

    async function removeGalleryFromMeeting(data: { meetingId: string, s3Path: string }) {
        try {
            const res = await apiBack.post(
                "/meetings/gallery/remove", data
            );

            if (res.data.isError) {
                throw new ApiError(res.data.message);
            }

            mytoast.success("Meeting editado com sucesso!");
        } catch (error: unknown) {
            if (checkErrorByField(error, 'message')) {
                mytoast.error(error.message);
                return;
            }
            throw error;
        }

        resetMeeting();
        refetchParticipants();
    }

    async function handleIsActiveChange(checked: boolean) {
        const data = {
            ...meeting,
            isActive: checked,
        } as IMeeting
        await updateMeeting(data)
    }

    async function handleRemoveItem(s3Path: string) {
        await removeGalleryFromMeeting({ s3Path, meetingId })
    }

    function handleAddParticipants(userIds: string[]) {
        const data = {
            ...meeting,
            participants: [
                ...meeting!.participants || [],
                ...userIds.map((userId) => ({
                    userId,
                    status: "pending" as keyof typeof ParticipantStatus ,
                })) as IParticipant[]
            ]
        } as IMeeting
        updateMeeting(data)
    }

    function handleRemoveParticipant(userId: string) {
        const data = {
            ...meeting,
            participants: [
                ...(meeting!.participants || []).filter((p) => p.userId !== userId),
            ],
        } as IMeeting
        updateMeeting(data)
    }

    function handleChangeStatus(userId: string, status: keyof typeof  ParticipantStatus) {
        const data = {
            ...meeting,
            participants: (meeting!.participants || []).map((p) =>
                p.userId === userId ? { ...p, status } : p
            ),
        } as IMeeting
        updateMeeting(data)
    }

    const photoCount = (meeting.gallery || []).filter((i) => i.type === "image").length
    const videoCount = (meeting.gallery || []).filter((i) => i.type === "video").length

    function Loading() {
        return <div>Loading...</div>;
    }

    function ErrorState({ error }: { error: Error }) {
        return <div style={{ color: "red" }}>{error.message}</div>;
    }

    if (isLoading) return <Loading />;
    if (isError) return <ErrorState error={firstError as Error} />;

    return (
        <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
            <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0"
                onClick={() => navigate("/meetings")}
                aria-label="Voltar para meetings"
            >
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {meeting.name}
            </h1>
            <p className="text-sm text-muted-foreground">
                {(meeting.participants || []).length} participantes &middot; {photoCount}{" "}
                {photoCount === 1 ? "foto" : "fotos"}
                {videoCount > 0 &&
                ` e ${videoCount} ${videoCount === 1 ? "video" : "videos"}`}
            </p>
            </div>
        </div>

        <div className="rounded-lg border bg-card p-5">
            <SwitchDemo
                isActive={meeting.isActive}
                handleIsActiveChange={handleIsActiveChange}
            />
        </div>

        {/* Gallery Section */}
        <div className="rounded-lg border bg-card p-5">
            <MeetingGallery
                onRemoveItem={handleRemoveItem}
            />
        </div>

        <Separator />

        {/* Participants Section */}
        <div className="rounded-lg border bg-card p-5">
            <MeetingParticipants
                meeting={meeting}
                resetMeeting={resetMeeting}
                participants={participants}
                users={users}
                onAddParticipants={handleAddParticipants}
                onRemoveParticipant={handleRemoveParticipant}
                onChangeStatus={handleChangeStatus}
            />
        </div>
        </div>
    )
}
