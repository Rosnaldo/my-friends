import { useState, useMemo } from "react"
import {
  Search,
  Trash2,
  CheckCircle2,
  Clock,
  UserPlus,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { IMeeting, IUser, IUserParticipant, ParticipantStatus } from "@repo/shared-types"
import { MeetingParticipantsDialog } from "./meeting-participants-dialog"
import _ from "lodash"

interface MeetingParticipantsProps {
    meeting: IMeeting;
    resetMeeting: () => void
    participants: IUserParticipant[]
    users: IUser[]
    onAddParticipants: (userIds: string[]) => void
    onRemoveParticipant: (userId: string) => void
    onChangeStatus: (userId: string, status: keyof typeof ParticipantStatus) => void
}

export function MeetingParticipants({
    meeting,
    resetMeeting,
    participants,
    users,
    onAddParticipants,
    onRemoveParticipant,
    onChangeStatus,
}: MeetingParticipantsProps) {
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<"all" | keyof typeof ParticipantStatus>("all")
    const [addOpen, setAddOpen] = useState(false)
    const [removingUserId, setRemovingUserId] = useState<string | null>(null)

    // Map users by id for quick lookup
    const usersMap = useMemo(() => {
        const map = new Map<string, IUser>()
        users.forEach((u) => map.set(u._id, u))
        return map
    }, [users]);

    // Filter participants
    const filteredParticipants = useMemo(() => {
        return participants.filter((p) => {
            const user = usersMap.get(p._id)
            if (!user) return false
            const matchesSearch =
                search === "" ||
                `${user.firstName} ${user.lastName}`
                .toLowerCase()
                .includes(search.toLowerCase()) ||
                user?.email?.toLowerCase().includes(search.toLowerCase())
            const matchesStatus =
                statusFilter === "all" || p.status === statusFilter
            return matchesSearch && matchesStatus
        })
    }, [participants, search, statusFilter, usersMap])

    const confirmedCount = participants.filter(
        (p) => p.status === "confirmed"
    ).length
    const pendingCount = participants.filter(
        (p) => p.status === "pending"
    ).length

    function handleRemove() {
        if (removingUserId) {
            onRemoveParticipant(removingUserId)
            setRemovingUserId(null)
        }
    }

    const removingUser = removingUserId
        ? usersMap.get(removingUserId)
        : null

    return (
        <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
            <div>
            <h2 className="text-lg font-semibold text-card-foreground">
                Participants
            </h2>
            <p className="text-sm text-muted-foreground">
                {participants.length} total &middot; {confirmedCount} confirmed
                &middot; {pendingCount} pending
            </p>
            </div>
            <Button
                size="sm"
                className="gap-1.5"
                onClick={() => {
                    setAddOpen(true)
                }}
            >
                <UserPlus className="h-3.5 w-3.5" />
                Add Participant
            </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                placeholder="Search participants..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
            />
            </div>
            <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as "all" | keyof typeof ParticipantStatus)}
            >
            <SelectTrigger className="w-[150px]">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
            </Select>
        </div>

        {/* Participants Table */}
        <div className="rounded-lg border bg-card">
            <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                <TableHead className="w-[50px]">Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="w-[150px]">Status</TableHead>
                <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredParticipants.length === 0 ? (
                <TableRow>
                    <TableCell
                        colSpan={5}
                        className="h-24 text-center text-muted-foreground"
                    >
                    {participants.length === 0
                        ? "No participants yet. Add someone to this meeting."
                        : "No participants match your filters."}
                    </TableCell>
                </TableRow>
                ) : (
                filteredParticipants.map((participant) => {
                    const user = usersMap.get(participant._id)
                    if (!user) return null

                    return (
                    <TableRow key={participant._id}>
                        <TableCell>
                        <Avatar className="h-8 w-8">
                            <AvatarImage
                            src={user.avatar?.url}
                            alt={`${user.firstName} ${user.lastName}`}
                            />
                            <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                            {user.firstName.charAt(0)}
                            {user?.lastName?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        </TableCell>
                        <TableCell className="font-medium text-card-foreground">
                        {user.firstName} {user.lastName}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                        {user.email}
                        </TableCell>
                        <TableCell>
                        <Select
                            value={participant.status}
                            onValueChange={(v) =>
                            onChangeStatus(
                                participant._id,
                                v as keyof typeof ParticipantStatus
                            )
                            }
                        >
                            <SelectTrigger className="h-8 w-[130px]">
                            <SelectValue>
                                <span className="flex items-center gap-1.5">
                                {participant.status === "confirmed" ? (
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                ) : (
                                    <Clock className="h-3.5 w-3.5 text-amber-500" />
                                )}
                                <span className="capitalize">
                                    {participant.status}
                                </span>
                                </span>
                            </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="confirmed">
                                <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                Confirmed
                                </span>
                            </SelectItem>
                            <SelectItem value="pending">
                                <span className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-amber-500" />
                                Pending
                                </span>
                            </SelectItem>
                            </SelectContent>
                        </Select>
                        </TableCell>
                        <TableCell className="text-right">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => setRemovingUserId(participant._id)}
                            aria-label={`Remove ${user.firstName} ${user.lastName}`}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        </TableCell>
                    </TableRow>
                    )
                })
                )}
            </TableBody>
            </Table>
        </div>

        {/* Add Participant Dialog */}
        <MeetingParticipantsDialog
            meeting={meeting}
            addOpen={addOpen}
            onAddParticipants={onAddParticipants}
            participants={participants}
            resetMeeting={resetMeeting}
            setAddOpen={setAddOpen}
        />

        {/* Remove Confirm */}
        <AlertDialog
            open={removingUserId !== null}
            onOpenChange={(open) => {
            if (!open) setRemovingUserId(null)
            }}
        >
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Remove Participant</AlertDialogTitle>
                <AlertDialogDescription>
                {removingUser ? (
                    <>
                    Are you sure you want to remove{" "}
                    <span className="font-semibold text-foreground">
                        {removingUser.firstName} {removingUser.lastName}
                    </span>{" "}
                    from this meeting?
                    </>
                ) : (
                    "Are you sure you want to remove this participant?"
                )}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                onClick={handleRemove}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                Remove
                </AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </div>
    )
}
