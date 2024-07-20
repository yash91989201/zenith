// CUSTOM HOOKS
import { usePipelineDnd } from "@/hooks/use-pipeline-dnd";
// UI
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@ui/alert-dialog";
// CUSTOM COMPONENTS
import { UpsertLaneForm } from "@/components/pipeline/upsert-lane-form";
import { UpsertTicketForm } from "@/components/pipeline/upsert-ticket-form";

export function PipelineUtilityModals() {
  const {
    createLaneModal,
    updateLaneModal,
    deleteLaneModal,
    ticketModal,
    deleteTicketModal,
    lane,
    ticket,
    ticketData,
    subAccountId,
    pipelineId,
    deleteLaneAction,
    deleteTicketAction,
    deletingTicket,
    deletingLane,
  } = usePipelineDnd();

  return (
    <>
      {/* CREATE LANE MODAL */}
      <Dialog
        open={createLaneModal.isOpen}
        onOpenChange={createLaneModal.toggle}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new lane</DialogTitle>
            <DialogDescription>You can add ticket to lanes</DialogDescription>
          </DialogHeader>
          <UpsertLaneForm
            modalChild
            pipelineId={pipelineId}
            subAccountId={subAccountId}
            onClose={createLaneModal.close}
          />
        </DialogContent>
      </Dialog>
      {/* UPDATE LANE MODAL */}
      <Dialog
        open={updateLaneModal.isOpen}
        onOpenChange={updateLaneModal.toggle}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update lane</DialogTitle>
            <DialogDescription>lane info</DialogDescription>
          </DialogHeader>
          <UpsertLaneForm
            modalChild
            lane={lane}
            subAccountId={subAccountId}
            pipelineId={pipelineId}
            onClose={updateLaneModal.close}
          />
        </DialogContent>
      </Dialog>
      {/* DELETE LANE MODAL */}
      <AlertDialog
        open={deleteLaneModal.isOpen}
        onOpenChange={deleteLaneModal.toggle}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Do you want to delete &apos;{lane?.name}&apos; lane ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              lane.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive"
              onClick={deleteLaneAction}
              disabled={deletingLane}
            >
              {deletingLane ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* UPSERT TICKET MODAL */}
      <Dialog open={ticketModal.isOpen} onOpenChange={ticketModal.toggle}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save ticket</DialogTitle>
            <DialogDescription>add ticket and tags</DialogDescription>
          </DialogHeader>
          <UpsertTicketForm
            modalChild
            laneId={lane?.id ?? ""}
            ticketData={ticketData}
            pipelineId={pipelineId}
            subAccountId={subAccountId}
            onClose={ticketModal.close}
          />
        </DialogContent>
      </Dialog>

      {/* DELETE TICKET MODAL */}
      <AlertDialog
        open={deleteTicketModal.isOpen}
        onOpenChange={deleteTicketModal.toggle}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Do you want to delete &apos;{ticket?.name}&apos; ticket ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              ticket.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive"
              onClick={deleteTicketAction}
              disabled={deletingTicket}
            >
              {deletingTicket ? "Deleting ..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
