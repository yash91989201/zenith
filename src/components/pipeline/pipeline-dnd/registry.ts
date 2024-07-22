import invariant from 'tiny-invariant';
// TYPES
import type { CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/types';

export type LaneEntry = {
  element: HTMLElement;
};

export type TicketEntry = {
  element: HTMLElement;
  // actionMenuTrigger: HTMLElement;
};

/**
 * Registering tickets and their action menu trigger element,
 * so that we can restore focus to the trigger when a card moves between columns.
 */
export function createRegistry() {
  const lanes = new Map<string, LaneEntry>()
  const tickets = new Map<string, TicketEntry>()

  const registerTicket = ({ ticketId, entry }: { ticketId: string, entry: TicketEntry }): CleanupFn => {
    tickets.set(ticketId, entry)
    return () => {
      tickets.delete(ticketId)
    }
  }

  const registerLane = ({ laneId, entry }: { laneId: string; entry: LaneEntry }): CleanupFn => {

    lanes.set(laneId, entry)
    return () => {
      lanes.delete(laneId)
    }
  }

  const getTicket = (ticketId: string) => {
    const entry = tickets.get(ticketId)
    invariant(entry)
    return entry
  }

  const getLane = (laneId: string) => {
    const entry = lanes.get(laneId)
    invariant(entry)
    return entry
  }

  return {
    getLane,
    getTicket,
    registerLane,
    registerTicket,
  }
}