import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
// UTILS
import { cn, formatAmount } from "@/lib/utils";
// TYPES
import type { TagColor, TicketAndTagsType } from "@/lib/types";
// CUSTOM HOOKS
import { useToggle } from "@/hooks/use-toggle";
// UI
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui/hover-card";
// CUSTOM COMPONENTS
import { Tag } from "@global/tag";
import { UpsertTicketForm } from "@/components/pipeline/upsert-ticket-form";
// ICONS
import {
  Edit,
  Trash,
  User2,
  LinkIcon,
  Contact2,
  MoreHorizontalIcon,
} from "lucide-react";

type Props = {
  laneId: string;
  pipelineId: string;
  subAccountId: string;
  ticket: TicketAndTagsType;
};

export function PipelineTicket({
  laneId,
  pipelineId,
  subAccountId,
  ticket,
}: Props) {
  const {
    attributes,
    transform,
    transition,
    isDragging,
    setNodeRef,
    listeners,
  } = useSortable({
    id: ticket.id,
  });

  const editTicket = useToggle(false);
  const deleteTicket = useToggle(false);

  return (
    <div
      {...listeners}
      {...attributes}
      ref={setNodeRef}
      className={cn(isDragging ? "opacity-75" : "", "h-full")}
      style={{ transition, transform: CSS.Translate.toString(transform) }}
    >
      <DropdownMenu>
        <Card className="bg-white shadow-none transition-all dark:bg-slate-900">
          <CardHeader className="p-3">
            <CardTitle className="flex items-center justify-between">
              <span className="w-full">{ticket.name}</span>
              <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}>
                <MoreHorizontalIcon className="size-5 text-muted-foreground" />
              </DropdownMenuTrigger>
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString()}
            </span>
            <div className="flex flex-wrap items-center gap-3">
              {ticket.tags.map((tag) => (
                <Tag
                  key={tag.id}
                  title={tag.name}
                  colorName={tag.color as TagColor}
                />
              ))}
            </div>
            <CardDescription className="w-full">
              {ticket.description}
            </CardDescription>
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-1.5 text-muted-foreground transition-all hover:bg-muted">
                  <LinkIcon className="size-4" />
                  <span className="text-sm font-bold">Contact</span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent side="right" className="w-fit">
                <div className="flex justify-between space-x-4">
                  <Avatar>
                    <AvatarImage />
                    <AvatarFallback className="bg-primary">
                      {ticket.customer?.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">
                      {ticket.customer?.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {ticket.customer?.email}
                    </p>
                    <div className="flex items-center pt-2">
                      <Contact2 className="mr-2 h-4 w-4 opacity-70" />
                      <span className="text-xs text-muted-foreground">
                        Joined
                        {ticket.customer?.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </CardHeader>
          <CardFooter className="m-0 flex items-center justify-between border-t-[1px] border-muted-foreground/20 p-3">
            <div className="item-center flex gap-3">
              <Avatar className="size-9">
                <AvatarImage alt="contact" src={ticket.assigned?.avatarUrl} />
                <AvatarFallback className="bg-primary text-sm text-white">
                  {ticket.assigned?.name}
                  {!ticket.assignedUserId && <User2 className="size-5" />}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col justify-center">
                <span className="text-sm text-muted-foreground">
                  {ticket.assignedUserId ? "Assigned to" : "Not Assigned"}
                </span>
                {ticket.assignedUserId && (
                  <span className="w-24 overflow-hidden  overflow-ellipsis whitespace-nowrap text-xs text-muted-foreground">
                    {ticket.assigned?.name}
                  </span>
                )}
              </div>
            </div>
            <span className="text-sm font-bold">
              {ticket.value && formatAmount(+ticket.value)}
            </span>
          </CardFooter>
          <DropdownMenuContent>
            <DropdownMenuLabel>Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center gap-3"
              onClick={editTicket.open}
            >
              <Edit className="size-4" />
              Edit Ticket
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-3"
              onClick={deleteTicket.open}
            >
              <Trash className="size-4" />
              Delete Ticket
            </DropdownMenuItem>
          </DropdownMenuContent>
        </Card>
      </DropdownMenu>

      <AlertDialog
        open={deleteTicket.isOpen}
        onOpenChange={deleteTicket.toggle}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              ticket and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={editTicket.isOpen} onOpenChange={editTicket.toggle}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save ticket</DialogTitle>
            <DialogDescription>add ticket and tags</DialogDescription>
          </DialogHeader>
          <UpsertTicketForm
            modalChild
            laneId={laneId}
            pipelineId={pipelineId}
            subAccountId={subAccountId}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
