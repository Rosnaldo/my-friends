import { cn } from "@/lib/utils";
import React from "react";

const TicketStatus = {
  confirmed: 'confirmed',
  pending: 'pending',
  denied: 'denied',
} as const;

type Prop = {
  status: typeof TicketStatus;
}

function UserTicketStatus(prop: Prop) {
  const status = prop.status.toString();
  return (
    <p className={cn(`
      font-semibold
      ${status === TicketStatus.confirmed ? 'text-confirmed' : ''}
      ${status === TicketStatus.pending ? 'text-pending' : ''}
      ${status === TicketStatus.denied ? 'text-denied' : ''}
    `)}>{status}</p>
  );
}

export default UserTicketStatus;
