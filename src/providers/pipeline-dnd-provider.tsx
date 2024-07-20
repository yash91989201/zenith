import { useToggle } from "@/hooks/use-toggle";
import type { LaneDetailType, TicketType, UpsertTicketType } from "@/lib/types";
import { createContext, useMemo, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

type PipelineDndContextProps = {
  createLaneModal: ReturnType<typeof useToggle>;
  updateLaneModal: ReturnType<typeof useToggle>;
  deleteLaneModal: ReturnType<typeof useToggle>;
  ticketModal: ReturnType<typeof useToggle>;
  deleteTicketModal: ReturnType<typeof useToggle>;
  lane?: LaneDetailType;
  setLane: Dispatch<SetStateAction<LaneDetailType | undefined>>;
  pipelineId: string;
  subAccountId: string;
  ticket?: TicketType;
  setTicket: Dispatch<SetStateAction<TicketType | undefined>>;
  ticketData?: UpsertTicketType;
  setTicketData: Dispatch<SetStateAction<UpsertTicketType | undefined>>;
};

export const PipelineDndContext = createContext<
  PipelineDndContextProps | undefined
>(undefined);

type PipelineDndProviderProps = {
  children: ReactNode;
  pipelineId: string;
  subAccountId: string;
};

export const PipelineDndProvider: React.FC<PipelineDndProviderProps> = ({
  pipelineId,
  subAccountId,
  children,
}) => {
  const createLaneModal = useToggle(false);
  const updateLaneModal = useToggle(false);
  const deleteLaneModal = useToggle(false);
  const ticketModal = useToggle(false);
  const deleteTicketModal = useToggle(false);

  const [lane, setLane] = useState<LaneDetailType | undefined>();
  const [ticket, setTicket] = useState<TicketType | undefined>();
  const [ticketData, setTicketData] = useState<UpsertTicketType | undefined>();

  const value = useMemo(
    () => ({
      createLaneModal,
      updateLaneModal,
      deleteLaneModal,
      ticketModal,
      deleteTicketModal,
      lane,
      setLane,
      pipelineId,
      subAccountId,
      ticket,
      setTicket,
      ticketData,
      setTicketData,
    }),
    [
      createLaneModal,
      updateLaneModal,
      deleteLaneModal,
      ticketModal,
      deleteTicketModal,
      lane,
      setLane,
      pipelineId,
      subAccountId,
      ticket,
      setTicket,
      ticketData,
      setTicketData,
    ],
  );

  return (
    <PipelineDndContext.Provider value={value}>
      {children}
    </PipelineDndContext.Provider>
  );
};
