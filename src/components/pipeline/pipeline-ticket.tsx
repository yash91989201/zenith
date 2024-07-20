// UTILS
import { formatAmount } from "@/lib/utils";
// TYPES
import type { TagColor, TicketAndTagsType } from "@/lib/types";
// CUSTOM HOOKS
// UI
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui/hover-card";
// CUSTOM COMPONENTS
import { Tag } from "@global/tag";
// ICONS
import { Button } from "@/components/ui/button";
import { usePipelineDnd } from "@/hooks/use-pipeline-dnd";
import {
  Contact2,
  Edit,
  GripVertical,
  LinkIcon,
  MoreHorizontalIcon,
  Trash,
  User2,
} from "lucide-react";

type Props = {
  ticket: TicketAndTagsType;
};

export function PipelineTicket({ ticket }: Props) {
  const { openDeleteTicketModal, openUpdateTicketModal } = usePipelineDnd();

  return (
    <div>
      <DropdownMenu>
        <Card className="select-none bg-white shadow-none transition-all dark:bg-slate-900">
          <CardHeader className="space-y-3 p-3">
            <CardTitle className="flex items-center justify-between gap-3">
              <Button
                variant="secondary"
                size="icon"
                className="size-7 cursor-grab"
              >
                <GripVertical className="size-4" />
              </Button>
              <p className="flex flex-1 flex-col gap-1">
                <span>{ticket.name}</span>
                <span className="text-[0.65rem] text-muted-foreground">
                  {new Date().toLocaleDateString()}
                </span>
              </p>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="size-6">
                  <MoreHorizontalIcon className="size-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-3 pt-0">
            <div className="flex flex-wrap items-center gap-1.5">
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
                  <LinkIcon className="size-3" />
                  <span className="text-xs font-bold">Contact</span>
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
          </CardContent>
          <CardFooter className="m-0 flex items-center justify-between border-t-[1px] border-muted-foreground/20 p-3">
            <div className="flex items-center gap-3">
              <Avatar className="size-8">
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
                  <span className="w-24 overflow-ellipsis whitespace-nowrap text-xs text-muted-foreground">
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
              onClick={() =>
                openUpdateTicketModal({
                  ticket: ticket,
                  tags: ticket.tags,
                })
              }
            >
              <Edit className="size-4" />
              Edit Ticket
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-3"
              onClick={() => openDeleteTicketModal(ticket)}
            >
              <Trash className="size-4" />
              Delete Ticket
            </DropdownMenuItem>
          </DropdownMenuContent>
        </Card>
      </DropdownMenu>
    </div>
  );
}
